import assert from "node:assert/strict";
import { mkdir, readFile, mkdtemp, writeFile, rm } from "node:fs/promises";
import { chromium } from "playwright";
import { createServer } from "vite";
import { unzipSync, strFromU8 } from "fflate";

let authoredFixture: string | undefined;
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
  assert.equal(
    await page
      .getByRole("tab", { name: "Playground", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  assert.deepEqual(
    await page
      .getByRole("tablist", { name: "Workspace" })
      .getByRole("tab")
      .allTextContents(),
    ["Overview", "Playground"],
  );
  await page.getByRole("tab", { name: "Overview", exact: true }).click();
  await page.getByText("Document outline", { exact: true }).waitFor();
  assert.equal(await page.locator(".live-card").count(), 1);
  assert.equal(await page.locator(".source-peek").count(), 0);
  await page
    .getByRole("heading", { name: "How it works", exact: true })
    .waitFor();
  await page
    .getByRole("heading", { name: "In the wild", exact: true })
    .waitFor();
  assert.equal(
    await page
      .locator(".in-the-wild")
      .getByRole("link", { name: "MDN documentation" })
      .getAttribute("href"),
    "https://developer.mozilla.org/",
  );
  await page.screenshot({ path: "output/layout-studio-desktop.png" });

  await page.getByRole("tab", { name: "Playground", exact: true }).click();
  await page.getByRole("button", { name: "CSS Grid", exact: true }).click();
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
  const resizeHandle = page.getByRole("button", { name: "Resize preview bottom-right", exact: true });
  const handleBox = (await resizeHandle.boundingBox())!;
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + handleBox.width / 2 + 65, handleBox.y + handleBox.height / 2);
  await page.mouse.up();
  assert.equal(await page.locator(".canvas-area").evaluate(el => Math.round(el.getBoundingClientRect().width)), 440);
  await resizeHandle.focus();
  await page.keyboard.press("ArrowLeft");
  assert.equal(await page.locator(".canvas-area").evaluate(el => Math.round(el.getBoundingClientRect().width)), 430);
  for (const corner of ["top-left", "top-right", "bottom-left", "bottom-right"]) {
    const before = await page.locator(".canvas-area").evaluate(el => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height }));
    const handle = page.getByRole("button", { name: `Resize preview ${corner}`, exact: true });
    const box = (await handle.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2 + 20);
    await page.mouse.up();
    const after = await page.locator(".canvas-area").evaluate(el => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height }));
    assert.equal(after.width, before.width + (corner.endsWith("left") ? -20 : 20));
    assert.equal(after.height, before.height + (corner.startsWith("top") ? -20 : 20));
  }
  await page.getByRole("button", { name: "Desktop", exact: true }).click();
  await page.getByRole("tab", { name: "Overview", exact: true }).click();
  await page.getByText("Document outline", { exact: true }).waitFor();
  await page.getByRole("tab", { name: "Overview", exact: true }).click();

  await page.getByRole("tab", { name: "Playground", exact: true }).click();
  await page
    .locator(".editor-frame .monaco-editor textarea")
    .waitFor({ timeout: 30000 });
  const previewNode = await page
    .locator(".preview-shadow-host .container[data-editor-id]")
    .elementHandle();
  assert.ok(previewNode);
  await page.locator(".editor-frame .monaco-editor").click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.insertText(
    ".container { width: 100%; height: 100%; display: grid; gap: 37px; border: 2px solid red !important; border-radius: 12px 8px / 6px 4px; border-top-right-radius: 25%; }",
  );
  await page.waitForFunction(() =>
    document
      .querySelector(".preview-shadow-host")
      ?.shadowRoot?.querySelector("#preview-styles")
      ?.textContent?.includes("37px"),
  );
  assert.equal(await previewNode.evaluate((element) => element.isConnected), true);
  await previewNode.dispose();
  await page.getByRole("searchbox", { name: "Search inspector properties" }).fill("top border width");
  const borderHeader = page.locator(".range-widget-wrapper .label-field-wrapper").filter({
    has: page.getByText("Top border width", { exact: true }),
  });
  await borderHeader.getByRole("button", { name: "Input mode" }).waitFor();
  await borderHeader.getByRole("button", { name: "Show details for border-top-width" }).click();
  const borderDetails = page.getByRole("dialog", { name: "border-top-width details" });
  assert.equal(
    await borderDetails.locator(".inspector-field-tooltip-details > span").first().locator("code").textContent(),
    "2px",
  );
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Clear inspector search" }).click();
  const inspectorSearch = page.getByRole("searchbox", { name: "Search inspector properties" });
  await inspectorSearch.fill("corner radius");
  await page.getByText("Corner radius", { exact: true }).waitFor();
  const rightRadius = page.getByRole("spinbutton", { name: "Top-right radius", exact: true });
  assert.equal(await rightRadius.inputValue(), "25");
  const rightRadiusControl = page.locator(".range-widget-wrapper").filter({
    has: page.getByText("Top-right radius", { exact: true }),
  });
  const unitControl = rightRadiusControl.locator(".css-range-unit");
  assert.equal(await unitControl.inputValue(), "%");
  await unitControl.selectOption("cqi");
  await page.waitForFunction(() =>
    document.querySelector(".preview-shadow-host")?.shadowRoot
      ?.querySelector("#preview-styles")?.textContent?.includes("25cqi"),
  );
  await unitControl.selectOption("%");

  const modeButton = rightRadiusControl.getByRole("button", { name: "Input mode" });
  const modes = rightRadiusControl.getByRole("menu", { name: "Input mode" });
  await modeButton.click();
  await modes.getByRole("menuitemradio", { name: "Number", checked: true }).waitFor();
  await modeButton.click();
  await modes.waitFor({ state: "hidden" });

  await modeButton.press("ArrowDown");
  await page.waitForFunction(() => document.activeElement?.textContent?.trim() === "Slider");
  const focusedMode = modes.getByRole("menuitemradio", { name: "Slider", checked: false });
  assert.equal(await focusedMode.evaluate((item) => getComputedStyle(item).outlineStyle), "solid");
  await modes.getByRole("menuitemradio", { name: "Number", checked: true }).waitFor();
  await page.keyboard.press("Escape");
  await modes.waitFor({ state: "hidden" });
  assert.equal(await modeButton.evaluate((button) => document.activeElement === button), true);

  await modeButton.click();
  await modes.getByRole("menuitemradio", { name: "CSS value" }).click();
  const cssRadius = rightRadiusControl.getByRole("textbox", { name: "Top-right radius" });
  assert.equal(await cssRadius.inputValue(), "25%");
  assert.equal(await cssRadius.evaluate((input) => document.activeElement === input), true);

  await modeButton.press("Enter");
  await page.waitForFunction(() => document.activeElement?.textContent?.trim() === "CSS value");
  await page.keyboard.press("Home");
  await page.keyboard.press("Enter");
  const radiusSlider = rightRadiusControl.getByRole("slider", { name: "Top-right radius" });
  await radiusSlider.waitFor();
  await rightRadiusControl.evaluate((field) => { field.style.inlineSize = "140px"; });
  assert.equal(
    await radiusSlider.evaluate((input) => {
      const widget = input.closest(".css-range-widget")!;
      const control = widget.querySelector(".css-range-value")!;
      return input.clientWidth === widget.clientWidth &&
        widget.scrollWidth === widget.clientWidth &&
        input.getBoundingClientRect().bottom <= control.getBoundingClientRect().top;
    }),
    true,
  );
  await rightRadiusControl.evaluate((field) => { field.style.removeProperty("inline-size"); });
  await modeButton.click();
  await modes.getByRole("menuitemradio", { name: "Number" }).click();
  await rightRadius.fill("30");
  await rightRadius.blur();

  const leftRadius = page.getByRole("textbox", { name: "Top-left radius", exact: true });
  assert.equal(await leftRadius.inputValue(), "12px 6px");
  await leftRadius.fill("14px 9px");
  await leftRadius.blur();
  await page.waitForFunction(() => {
    const container = document.querySelector(".preview-shadow-host")?.shadowRoot?.querySelector(".container");
    if (!container) return false;
    const style = getComputedStyle(container);
    return style.borderTopRightRadius === "30%" &&
      style.borderTopLeftRadius === "14px 9px" &&
      style.borderBottomRightRadius === "12px 6px";
  });
  await page.waitForFunction(() => {
    const lines = Array.from(
      document.querySelectorAll(".source-peek .monaco-editor .view-line"),
      (line) => line.textContent?.replaceAll("\u00a0", " "),
    );
    return lines.includes(".container {") &&
      lines.includes("  gap: 37px;") &&
      lines.includes("  border-top-left-radius: 14px 9px;") &&
      lines.includes("}");
  });
  await page.getByRole("button", { name: "Clear inspector search" }).click();


  await page.getByRole("tab", { name: "Overview", exact: true }).click();
  assert.equal(await page.locator(".live-card").count(), 1);
  assert.equal(await page.locator(".source-peek").count(), 0);

  await page.getByRole("tab", { name: "Playground", exact: true }).click();
  assert.equal(await page.locator(".live-card").count(), 1);
  assert.equal(await page.locator(".source-peek").count(), 1);
  assert.deepEqual(
    await page.locator(".live-actions .source-files button").allTextContents(),
    ["HTML", "CSS"],
  );
  assert.equal(
    await page.getByRole("button", { name: "page.mdx", exact: true }).count(),
    0,
  );
  await page.getByRole("button", { name: "CSS", exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export folder", exact: true })
    .click();
  const download = await downloadPromise;
  const archive = unzipSync(await readFile((await download.path())!));
  const paths = Object.keys(archive);
  assert.deepEqual(
    paths.map((path) => path.split("/").at(-1)).sort(),
    ["index.html", "page.mdx", "styles.css"],
  );
  assert.match(
    strFromU8(archive[paths.find((path) => path.endsWith("/styles.css"))!]),
    /37px/,
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
  await page.getByRole("tab", { name: "Playground", exact: true }).click();
  assert.equal(await page.locator(".live-toolbar").evaluate(el => el.scrollWidth <= el.clientWidth), true);
  await page.screenshot({ path: "output/layout-studio-mobile.png" });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
    false,
  );
  // Prove that the MDX document, rather than App.tsx, owns the composition.
  await page.setViewportSize({ width: 1586, height: 992 });
  const initialCount = Number(
    (await page.locator(".library-footer").innerText()).match(/\d+/)![0],
  );
  authoredFixture = await mkdtemp("presets/99-mdx-composition-");
  const original = "presets/02-content/01-article-aside/01-flex/";
  for (const file of ["index.html", "styles.css"]) {
    await writeFile(
      `${authoredFixture}/${file}`,
      await readFile(original + file),
    );
  }
  await writeFile(
    `${authoredFixture}/notes.txt`,
    "A source imported by this MDX page only.",
  );
  await writeFile(
    `${authoredFixture}/page.mdx`,
    await readFile("tests/fixtures/mdx-composition.mdx"),
  );
  await page.waitForFunction(
    (count) =>
      document
        .querySelector(".library-footer")
        ?.textContent?.includes(`${count} presets`),
    initialCount + 1,
  );
  await page
    .getByRole("textbox", { name: "Search layouts" })
    .fill("MDX Composition Test");
  await page
    .locator(".library-items button")
    .filter({ hasText: "MDX Composition Test" })
    .click();
  await page
    .getByRole("heading", { name: "Authored MDX heading", exact: true })
    .waitFor();
  assert.deepEqual(
    await page
      .getByRole("tablist", { name: "Workspace" })
      .getByRole("tab")
      .allTextContents(),
    ["Examples", "Edit files"],
  );
  assert.equal(await page.locator(".studio-inspector").count(), 0);
  assert.equal(
    await page.getByRole("button", { name: "Copy code", exact: true }).count(),
    0,
  );
  assert.equal(await page.locator(".library-group").count(), 1);
  await page
    .locator(".studio-breadcrumb")
    .filter({ hasText: "Authored navigation" })
    .waitFor();

  assert.equal(
    await page
      .getByRole("link", { name: "Ordinary notes link" })
      .getAttribute("href"),
    "./notes.txt",
  );
  assert.equal(
    await page
      .locator(".source-files")
      .getByRole("button", { name: "Read my notes" })
      .getAttribute("title"),
    "Notes source",
  );
  assert.equal(
    await page.locator(".source-files button strong").textContent(),
    "Read my notes",
  );
  assert.equal(
    await page
      .locator(".source-files")
      .getByRole("link", { name: "Unknown file" })
      .getAttribute("href"),
    "./missing.txt",
  );

  assert.equal(
    await page
      .locator(".custom-block.experimental .custom-block-title")
      .textContent(),
    "Custom authored block",
  );
  await page.getByRole("heading", { name: "Community examples" }).waitFor();
  assert.equal(
    await page
      .locator(".in-the-wild")
      .getByRole("link", { name: "Custom reference" })
      .count(),
    1,
  );
  assert.equal(
    await page.getByRole("link", { name: "Frontmatter reference" }).count(),
    0,
  );
  assert.deepEqual(
    await page.locator(".file-tabs button[aria-pressed]").allTextContents(),
    ["notes.txt"],
  );
  assert.match(
    await page.locator(".source-peek pre").innerText(),
    /A source imported by this MDX page only/,
  );
  const customDownloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export folder", exact: true })
    .click();
  const customDownload = await customDownloadPromise;
  const customArchive = unzipSync(
    await readFile((await customDownload.path())!),
  );
  const customPaths = Object.keys(customArchive);
  assert.equal(customPaths.length, 1);
  assert.ok(customPaths[0].endsWith("/hidden.txt"));
  assert.equal(
    strFromU8(customArchive[customPaths[0]]),
    "Editable source outside the preview list.",
  );
  await page.getByRole("tab", { name: "Examples" }).focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(
    await page
      .getByRole("tab", { name: "Edit files" })
      .getAttribute("aria-selected"),
    "true",
  );
  // Source links target the stable "explore" ID, independent of its visible label.
  await page.getByRole("tab", { name: "Examples", exact: true }).click();
  await page
    .getByRole("button", { name: "Read my notes", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("tab", { name: "Edit files", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );

  await page
    .getByRole("link", { name: "Authored workspace", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("tab", { name: "Examples", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  await page
    .getByRole("button", { name: "Read my notes", exact: true })
    .click();
  // Explicit filtered props can render independent editable and read-only lists.
  await page
    .locator(".source-peek .read-only-source")
    .filter({ hasText: "A source imported by this MDX page only." })
    .waitFor();
  const genericEditor = page.locator(".source-peek").filter({
    has: page.getByRole("button", { name: "hidden.txt", exact: true }),
  });
  await genericEditor.locator(".monaco-editor textarea").waitFor();
  await genericEditor.locator(".monaco-editor").click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.insertText("Edited generic source content.");
  await genericEditor
    .locator(".source-panel__dirty")
    .waitFor({ state: "visible" });
  await genericEditor
    .locator(".source-panel__dirty")
    .waitFor({ state: "hidden" });
  const editedDownloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export folder", exact: true })
    .click();
  const editedDownload = await editedDownloadPromise;
  const editedArchive = unzipSync(
    await readFile((await editedDownload.path())!),
  );
  const editedPath = Object.keys(editedArchive).find((path) =>
    path.endsWith("/hidden.txt"),
  )!;
  assert.equal(
    strFromU8(editedArchive[editedPath]),
    "Edited generic source content.",
  );
  await page.locator(".live-card").waitFor();
  assert.equal(
    await page.getByRole("button", { name: "Phone", exact: true }).count(),
    0,
  );
  await page.getByRole("button", { name: "Small", exact: true }).click();
  assert.equal(
    await page
      .locator(".canvas-area")
      .evaluate((el) => Math.round(el.getBoundingClientRect().width)),
    420,
  );

  await page.getByRole("heading", { name: "Frontmatter examples" }).waitFor();
  assert.equal(
    await page
      .getByRole("link", { name: "Frontmatter reference" })
      .getAttribute("href"),
    "https://example.com/frontmatter",
  );
  await page.getByText("Unlinked example", { exact: true }).waitFor();
  await writeFile(
    `${authoredFixture}/canvas.html`,
    '<div class="container">HTML selected by page.mdx</div>',
  );
  await writeFile(
    `${authoredFixture}/canvas.css`,
    ".container { display: grid; gap: 41px; }",
  );
  await writeFile(
    `${authoredFixture}/page.mdx`,
    `---
id: authored-mdx-test
title: Directive Composition Test
heading: Directive workspace
files:
  html: canvas.html
  css: canvas.css
---
<StudioShell>
<StudioBody>
<Workspace>
<PresetPageTitle />

::::: workspace-tabs inspect

:::: workspace-tab notes | Notes first

## Notes only

::::

:::: workspace-tab inspect | Inspect layout

::: preview-layout Authored preview
:::

::: in-the-wild References

[Authored link](https://example.com/)

:::

::::

:::::

</Workspace>
</StudioBody>
</StudioShell>
`,
  );
  await page.reload();
  await page
    .getByRole("textbox", { name: "Search layouts" })
    .fill("Directive Composition Test");
  await page
    .locator(".library-items button")
    .filter({ hasText: "Directive Composition Test" })
    .click();
  await page.getByRole("heading", { name: "Directive workspace" }).waitFor();
  const directiveTabs = page.getByRole("tablist", { name: "Workspace" }).getByRole("tab");
  assert.deepEqual(await directiveTabs.allTextContents(), ["Notes first", "Inspect layout"]);
  assert.equal(await directiveTabs.nth(1).getAttribute("aria-selected"), "true");
  const directivePanel = page.getByRole("tabpanel");
  assert.match(await directivePanel.innerText(), /Authored preview[\s\S]*References/);
  const authoredCanvas = directivePanel.locator(".preview-shadow-host .container");
  assert.equal(await authoredCanvas.textContent(), "HTML selected by page.mdx");
  assert.equal(await authoredCanvas.evaluate((element) => getComputedStyle(element).gap), "41px");

  assert.equal(await directivePanel.getByRole("link", { name: "Authored link" }).count(), 1);
  assert.equal(await page.locator(".studio-inspector, .source-peek, .outline-tree-panel").count(), 0);
  await directiveTabs.nth(0).click();
  await directivePanel.getByRole("heading", { name: "Notes only" }).waitFor();
  assert.equal(await directivePanel.locator(".live-card").count(), 0);

  assert.deepEqual(errors, []);
  console.log(
    "Passed: MDX rendering, variants, viewports, outline, live CSS edits, source links, ZIP contents, search, theme, mobile layout, and fully authored MDX composition.",
  );
} finally {
  await browser.close();
  await server.close();
  if (authoredFixture)
    await rm(authoredFixture, { recursive: true, force: true });
}
