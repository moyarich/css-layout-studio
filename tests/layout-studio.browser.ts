import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { chromium } from "playwright";
import { createServer } from "vite";
import { unzipSync, strFromU8 } from "fflate";

const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
await server.listen();
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1586, height: 992 } });
const errors: string[] = [];
page.on("pageerror", (error) => errors.push(error.stack ?? error.message));
await mkdir("output", { recursive: true });
try {
  await page.goto(server.resolvedUrls!.local[0]);
  await page
    .getByRole("heading", { name: "Article + Aside", exact: true })
    .waitFor();
  await page
    .getByRole("heading", { name: "How it works", exact: true })
    .waitFor();
  await page
    .getByRole("heading", { name: "In the wild", exact: true })
    .waitFor();
  await page.locator(".preview-shadow-host").waitFor();
  await page.screenshot({ path: "output/layout-studio-desktop.png" });

  await page.getByRole("button", { name: "Grid", exact: true }).click();
  await page.waitForFunction(() =>
    document.querySelector(".page-heading p")?.textContent?.includes("Grid"),
  );
  await page.getByRole("button", { name: "Phone", exact: true }).click();
  assert.equal(
    await page
      .locator(".canvas-area")
      .evaluate((el) => Math.round(el.getBoundingClientRect().width)),
    375,
  );
  await page.getByRole("button", { name: "Desktop", exact: true }).click();
  await page.getByRole("button", { name: "Outline", exact: true }).click();
  await page.getByText("Document outline", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Inspector", exact: true }).click();

  await page.getByRole("tab", { name: "Playground", exact: true }).click();
  await page
    .locator(".editor-frame .monaco-editor textarea")
    .waitFor({ timeout: 30000 });
  await page.locator(".editor-frame .monaco-editor").click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.insertText(
    ".container { width: 100%; height: 100%; display: grid; gap: 37px; }",
  );
  await page.waitForFunction(() =>
    document
      .querySelector(".preview-shadow-host")
      ?.shadowRoot?.querySelector("#preview-styles")
      ?.textContent?.includes("37px"),
  );
  await page.getByRole("tab", { name: "Overview", exact: true }).click();
  await page.waitForFunction(() =>
    document
      .querySelector(".preview-shadow-host")
      ?.shadowRoot?.querySelector("#preview-styles")
      ?.textContent?.includes("37px"),
  );

  await page.getByRole("button", { name: "CSS", exact: true }).click();
  await page.getByRole("tab", { name: "Source", exact: true }).waitFor();
  assert.equal(
    await page
      .getByRole("tab", { name: "Source", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  await page.getByRole("button", { name: "page.mdx", exact: true }).click();
  await page
    .locator(".read-only-source")
    .filter({ hasText: "How it works" })
    .waitFor();
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export folder", exact: true })
    .click();
  const download = await downloadPromise;
  const archive = unzipSync(await readFile((await download.path())!));
  const paths = Object.keys(archive);
  assert.equal(paths.length, 6);
  assert.match(
    strFromU8(archive[paths.find((path) => path.endsWith("/styles.css"))!]),
    /37px/,
  );
  assert.doesNotMatch(
    strFromU8(archive[paths.find((path) => path.endsWith("/preview.tsx"))!]),
    /DocumentationPreviewContext|useContext/,
  );

  await page.getByRole("tab", { name: "Overview", exact: true }).click();
  await page.getByRole("textbox", { name: "Search layouts" }).fill("Bento");
  await page
    .locator(".library-items button")
    .filter({ hasText: "Bento" })
    .click();
  await page.getByRole("heading", { name: /Bento/ }).first().waitFor();
  await page
    .getByRole("textbox", { name: "Search layouts" })
    .fill("unmatched-layout-name");
  await page.getByText("No layouts found. Try another name.").waitFor();
  await page.getByRole("textbox", { name: "Search layouts" }).fill("");
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  assert.equal(
    await page.locator(".studio").getAttribute("data-theme"),
    "dark",
  );
  await page.getByRole("button", { name: "Toggle color theme" }).click();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Toggle layout library" }).click();
  await page
    .getByRole("textbox", { name: "Search layouts" })
    .fill("Article + Aside");
  await page
    .locator(".library-items button")
    .filter({ hasText: "Article + Aside" })
    .click();
  await page.screenshot({ path: "output/layout-studio-mobile.png" });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
    false,
  );
  assert.deepEqual(errors, []);
  console.log(
    "Passed: MDX rendering, variants, viewports, outline, live CSS edits, source links, ZIP contents, search, theme, and mobile layout.",
  );
} finally {
  await browser.close();
  await server.close();
}
