import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +---------------------------------------------------+
 * | Fixed header                                      |
 * +------------+------------------------+-------------+
 * | Side head  |                        |             |
 * +------------+ Scrollable article     | Scrollable  |
 * | Side scroll|                        | right side  |
 * +------------+                        |             |
 * | Side foot  |                        |             |
 * +------------+------------------------+-------------+
 * | Fixed footer                                      |
 * +---------------------------------------------------+
 */

const inTheWild: NonNullable<PresetSource["inTheWild"]> = [];

export const presets = [
  {
    id: "holy-grail-v2-flex",
    name: "Holy Grail V2 - Flex",
    description:
      "Fixed application shell with non-scrolling header and footer, a left sidebar with fixed header and footer, and independently scrollable content regions using Flexbox.",
    type: "flex",
    inTheWild,

    html: `<div class="container">
  <header class="header">Header</header>

  <main class="main">
    <aside class="sidebar-left">
      <header class="sidebar-header">Sidebar Header</header>
      <div class="sidebar-content">
        <div>Left Sidebar</div>
        <div class="inner-sidebar-content"></div>
      </div>
      <footer class="sidebar-footer">Sidebar Footer</footer>
    </aside>

    <article class="article">Article</article>

    <aside class="sidebar-right">Right Sidebar</aside>
  </main>

  <footer class="footer">Footer</footer>
</div>`,

    css: `.container {
  box-sizing: border-box;

  /* The outer shell never scrolls; scrolling belongs to the content regions. */
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
  overflow: hidden;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;

  flex: 0 0 72px;
  background: #f5f0c8;
}

.main {
  display: flex;
  flex: 1 1 0;
  gap: 16px;

  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.sidebar-left {
  display: flex;
  flex: 0 0 240px;
  flex-direction: column;

  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.sidebar-header {
  flex: 0 0 72px;
  background: #e4dcf7;
}

.sidebar-content {
  flex: 1 1 0;

  min-width: 0;
  min-height: 0;
  overflow-y: auto;

  background: #c8f2e4;
}

.sidebar-footer {
  flex: 0 0 72px;
  background: #d8f1df;
}

.inner-sidebar-content {
  height: 100vh;
}

.article {
  flex: 1 1 0;

  min-width: 0;
  min-height: 0;
  overflow-y: auto;

  background: #cfe4f7;
}

.sidebar-right {
  flex: 0 0 280px;

  min-width: 0;
  min-height: 0;
  overflow-y: auto;

  background: #dddaf5;
}

.footer {
  flex: 0 0 72px;
  background: #f1dce5;
}

.header,
.sidebar-header,
.sidebar-content,
.sidebar-footer,
.article,
.sidebar-right,
.footer {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}`,

    editor: {
      category: "Content",
    },
  },

  {
    id: "holy-grail-v2-grid",
    name: "Holy Grail V2 - Grid",
    description:
      "Fixed application shell with non-scrolling header and footer, a left sidebar with fixed header and footer, and independently scrollable content regions using CSS Grid.",
    type: "grid",
    inTheWild,

    html: `<div class="container">
  <header class="header">Header</header>

  <main class="main">
    <aside class="sidebar-left">
      <header class="sidebar-header">Sidebar Header</header>
      <div class="sidebar-content">
        <div>Left Sidebar</div>
        <div class="inner-sidebar-content"></div>
      </div>
      <footer class="sidebar-footer">Sidebar Footer</footer>
    </aside>

    <article class="article">Article</article>

    <aside class="sidebar-right">Right Sidebar</aside>
  </main>

  <footer class="footer">Footer</footer>
</div>`,

    css: `.container {
  box-sizing: border-box;

  /* Fixed shell rows keep the header and footer outside the scroll regions. */
  display: grid;
  grid-template-rows: 72px minmax(0, 1fr) 72px;
  gap: 16px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
  overflow: hidden;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;

  background: #f5f0c8;
}

.main {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr) 280px;
  gap: 16px;

  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.sidebar-left {
  display: grid;
  grid-template-rows: 72px minmax(0, 1fr) 72px;

  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.sidebar-header {
  background: #e4dcf7;
}

.sidebar-content {
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  background: #c8f2e4;
}

.inner-sidebar-content {
  height: 100vh;
}

.sidebar-footer {
  background: #d8f1df;
}

.article {
  min-width: 0;
  min-height: 0;
  overflow-y: auto;

  background: #cfe4f7;
}

.sidebar-right {
  min-width: 0;
  min-height: 0;
  overflow-y: auto;

  background: #dddaf5;
}

.footer {
  background: #f1dce5;
}

.header,
.sidebar-header,
.sidebar-content,
.sidebar-footer,
.article,
.sidebar-right,
.footer {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}`,

    editor: {
      category: "Content",
    },
  },
] satisfies PresetSource[];
