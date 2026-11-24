import { readFile, readdir } from "node:fs/promises";
import { resolve, relative, sep, posix } from "node:path";
import { parseDocument } from "yaml";
import type { Plugin, ViteDevServer } from "vite";
import type { PageSource } from "../../src/studio/source-types";
import type { PresetSource } from "../../presets/types";

export interface PresetRegistryConfig {
  sources: Record<
    string,
    {
      base: string;
      files?: { page?: string; html?: string; css?: string };
    }
  >;
}
export interface PresetRegistryEntry extends PresetSource {
  source: string;
  path: string;
  files: { page: string; html: string; css: string };
  sources: PageSource[];
}
const collator = new Intl.Collator("en", { numeric: true });
function compareFolders(a: string, b: string): number {
  const left = a.split("/");
  const right = b.split("/");
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    const x = left[i].match(/^(\d+)[-_]/);
    const y = right[i].match(/^(\d+)[-_]/);
    const order = Number(x?.[1] ?? Infinity) - Number(y?.[1] ?? Infinity);
    if (order) return order;
    const name = collator.compare(left[i], right[i]);
    if (name) return name;
  }
  return left.length - right.length || a.localeCompare(b);
}
function label(folder: string): string {
  return folder
    .replace(/^\d+[-_]/, "")
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Read YAML without executing MDX imports; metadata discovery stays deterministic. */
export function parsePresetFrontmatter(text: string, file: string) {
  const match = text.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw Error(`${file}: YAML frontmatter is required`);
  const document = parseDocument(match[1]);
  if (document.errors.length)
    throw Error(`${file}: invalid frontmatter: ${document.errors[0].message}`);
  const metadata = document.toJS();
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata))
    throw Error(`${file}: frontmatter must be a mapping`);
  const name = metadata.name ?? metadata.title;
  if (
    typeof metadata.id !== "string" ||
    !metadata.id.trim() ||
    typeof name !== "string" ||
    !name.trim()
  )
    throw Error(`${file}: id and title are required in frontmatter`);
  return { ...metadata, name };
}

/** Discover source folders in configured source order, then numeric folder order. */
export async function buildPresetRegistry(
  config: PresetRegistryConfig,
  root: string,
  watch: (file: string) => void = () => {},
): Promise<PresetRegistryEntry[]> {
  const entries: PresetRegistryEntry[] = [];
  const ids = new Set<string>();
  for (const [source, options] of Object.entries(config.sources)) {
    const base = resolve(root, options.base);
    const names = {
      page: "page.mdx",
      html: "index.html",
      css: "styles.css",
      ...options.files,
    };
    for (const name of Object.values(names)) {
      if (!name || name.includes("/") || name.includes("\\") || name === "..")
        throw Error(`Registry file names must be local basenames: ${name}`);
    }
    const discovered: PresetRegistryEntry[] = [];
    async function walk(folder: string): Promise<void> {
      const children = await readdir(folder, { withFileTypes: true });
      if (
        children.some((child) => child.isFile() && child.name === names.page)
      ) {
        const files = Object.fromEntries(
          Object.entries(names).map(([key, name]) => [
            key,
            resolve(folder, name),
          ]),
        ) as PresetRegistryEntry["files"];
        Object.values(files).forEach(watch);
        const page = await readFile(files.page, "utf8");
        const metadata = parsePresetFrontmatter(page, files.page);
        if (
          metadata.type !== undefined &&
          !["flex", "grid"].includes(metadata.type)
        )
          throw Error(`${files.page}: invalid layout type`);
        if (ids.has(metadata.id))
          throw Error(`Duplicate preset ID: ${metadata.id}`);
        ids.add(metadata.id);
        const path = relative(base, folder).split(sep).join("/");
        const [html, css] = await Promise.all([
          readFile(files.html, "utf8"),
          readFile(files.css, "utf8"),
        ]);
        const sources: PageSource[] = [
          { name: names.html, code: html, language: "html", edit: true },
          { name: names.css, code: css, language: "css", edit: true, default: true },
        ];
        for (const name of ["layout.tsx", "preview.tsx"]) {
          if (children.some((child) => child.isFile() && child.name === name)) {
            const file = resolve(folder, name);
            watch(file);
            sources.push({ name, code: await readFile(file, "utf8"), language: "typescript" });
          }
        }
        sources.push({ name: names.page, code: page, language: "mdx" });
        discovered.push({
          ...metadata,
          editor: {
            ...metadata.editor,
            category: metadata.editor?.category ?? label(path.split("/")[0]),
          },
          source,
          path,
          files: Object.fromEntries(
            Object.entries(files).map(([key, file]) => [
              key,
              relative(root, file).split(sep).join("/"),
            ]),
          ) as PresetRegistryEntry["files"],
          html,
          css,
          sources,
        });
      }
      for (const child of children)
        if (
          child.isDirectory() &&
          !child.name.startsWith(".") &&
          child.name !== "node_modules"
        )
          await walk(resolve(folder, child.name));
    }
    await walk(base);
    discovered.sort((a, b) => compareFolders(a.path, b.path));
    entries.push(...discovered);
  }
  if (!entries.length) throw Error("Preset registry contains no presets");
  return entries;
}

export function presetRegistryPlugin(config: PresetRegistryConfig): Plugin {
  const publicId = "virtual:preset-registry";
  const virtualId = "\0" + publicId;
  let root: string;
  function relevant(file: string) {
    return Object.values(config.sources).some((source) => {
      const path = relative(resolve(root, source.base), resolve(file));
      return (
        path === "" ||
        (path !== ".." &&
          !path.startsWith(".." + sep) &&
          !posix.isAbsolute(path))
      );
    });
  }
  function reload(server: ViteDevServer, file: string) {
    if (!relevant(file)) return;
    const module = server.moduleGraph.getModuleById(virtualId);
    if (module) server.moduleGraph.invalidateModule(module);
    server.ws.send({ type: "full-reload" });
  }
  return {
    name: "preset-registry",
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      if (id === publicId) return virtualId;
    },
    async load(id) {
      if (id !== virtualId) return;
      const entries = await buildPresetRegistry(config, root, (file) =>
        this.addWatchFile(file),
      );
      const imports: string[] = [];
      const records: string[] = [];
      for (const [index, entry] of entries.entries()) {
        const page = resolve(root, entry.files.page);
        imports.push(`import * as Page${index} from ${JSON.stringify(page)};`);
        records.push(`withPage(${JSON.stringify(entry)}, Page${index})`);
      }
      return `${imports.join("\n")}
function withPage(entry, page) {
  const sources = page.sources ?? entry.sources;
  return {
    ...entry,
    Page: page.default,
    sources,
    html: sources.find(source => source.edit === true && source.language === "html")?.code ?? entry.html,
    css: sources.find(source => source.edit === true && source.language === "css")?.code ?? entry.css,
  };
}
export const registry = { entries: [${records.join(",")}] };
export const PRESETS = registry.entries;`;
    },
    configureServer(server) {
      server.watcher.add(
        Object.values(config.sources).map((source) =>
          resolve(root, source.base),
        ),
      );
      const onChange = (file: string) => reload(server, file);
      server.watcher
        .on("add", onChange)
        .on("unlink", onChange)
        .on("change", onChange)
        .on("addDir", onChange)
        .on("unlinkDir", onChange);
      server.httpServer?.once("close", () => {
        for (const event of ["add", "unlink", "change", "addDir", "unlinkDir"])
          server.watcher.off(event, onChange);
      });
    },
  };
}
