import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { stringify } from "yaml";
import {
  buildPresetRegistry,
  parsePresetFrontmatter,
} from "../vite-plugins/preset-registry/preset-registry";

test("registry uses folder hierarchy, numeric ordering, and configurable filenames", async () => {
  const root = await mkdtemp(join(tmpdir(), "preset-registry-"));
  const config = {
    sources: {
      layouts: {
        base: "layouts",
        files: { page: "layout.mdx", html: "markup.html" },
      },
    },
  };
  async function add(
    path: string,
    id: string,
    files?: { html: string; css: string },
  ) {
    const folder = join(root, "layouts", path);
    await mkdir(folder, { recursive: true });
    await writeFile(
      join(folder, "layout.mdx"),
      "---\n" +
        stringify({
          id,
          title: "Same display name",
          heading: "Example layout",
          previewHeight: 480,
          ...(files && { files }),
          inTheWild: [{ name: "Example", url: "https://example.com" }],
          editor: { canvas: { width: 1440 } },
        }) +
        "---\n\n# Example",
    );
    await writeFile(
      join(folder, files?.html ?? "markup.html"),
      '<div class="container">Example</div>',
    );
    await writeFile(
      join(folder, files?.css ?? "styles.css"),
      ".container { display: grid; }",
    );
  }
  try {
    await add("10-zebra/01-example/10-other", "last");
    await add("02-new-category/01-example/02-grid", "second");
    await add("02-new-category/01-example/01-flex", "first");
    const entries = await buildPresetRegistry(config, root);
    assert.deepEqual(
      entries.map((entry) => entry.id),
      ["first", "second", "last"],
    );
    assert.equal(entries[0].editor?.category, "New Category");
    assert.equal(entries[0].name, "Same display name");
    assert.equal(entries[0].heading, "Example layout");
    assert.equal(entries[0].previewHeight, 480);
    assert.deepEqual(
      entries[0].sources.map(({ name, language }) => [name, language]),
      [
        ["markup.html", "html"],
        ["styles.css", "css"],
        ["layout.mdx", "mdx"],
      ],
    );
    assert.equal(entries[0].sources[1].default, true);
    assert.equal(entries[0].editor?.canvas?.width, 1440);
    assert.equal(entries[0].inTheWild?.[0].url, "https://example.com");
    assert.ok(entries[0].files.page.endsWith("layout.mdx"));
    assert.equal(entries[0].html, '<div class="container">Example</div>');
    await add("01-added/01-example", "new");
    assert.equal((await buildPresetRegistry(config, root))[0].id, "new");
    await add("00-authored", "authored", {
      html: "canvas.html",
      css: "canvas.css",
    });
    const [authored] = await buildPresetRegistry(config, root);
    assert.equal(authored.id, "authored");
    assert.deepEqual(
      authored.sources.map(({ name }) => name),
      ["canvas.html", "canvas.css", "layout.mdx"],
    );
    assert.equal(authored.sources[0].code, authored.html);
    assert.equal(authored.sources[1].code, authored.css);
    await writeFile(
      join(root, "layouts/00-authored/layout.mdx"),
      "---\nid: authored\ntitle: Authored\nfiles:\n  html: ../canvas.html\n---\n",
    );
    await assert.rejects(
      buildPresetRegistry(config, root),
      /files.html must be a local filename/,
    );
    await rm(join(root, "layouts/00-authored"), { recursive: true });
    await add("20-duplicate", "first");
    await assert.rejects(
      buildPresetRegistry(config, root),
      /Duplicate preset ID/,
    );
    await rm(join(root, "layouts/20-duplicate"), { recursive: true });
    await rm(join(root, "layouts/01-added/01-example/styles.css"));
    await assert.rejects(buildPresetRegistry(config, root), /ENOENT/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("frontmatter rejects missing IDs, invalid YAML, and duplicate YAML keys", () => {
  assert.throws(
    () => parsePresetFrontmatter("# No metadata", "page.mdx"),
    /frontmatter is required/,
  );
  assert.throws(
    () => parsePresetFrontmatter("---\ntitle: Missing ID\n---", "page.mdx"),
    /id and title are required/,
  );
  assert.throws(
    () => parsePresetFrontmatter("---\nid: [broken\n---", "page.mdx"),
    /invalid frontmatter/,
  );
  assert.throws(
    () =>
      parsePresetFrontmatter(
        "---\nid: one\nid: two\ntitle: Duplicate\n---",
        "page.mdx",
      ),
    /invalid frontmatter/,
  );
});
