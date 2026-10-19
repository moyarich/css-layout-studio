import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +---------------------------------------------+
 * | Header                                      |
 * +-----------+---------------------+-----------+
 * | Left      | Main content        | Right     |
 * | sidebar   |                     | sidebar   |
 * +-----------+---------------------+-----------+
 * | Footer                                      |
 * +---------------------------------------------+
 */

const inTheWild = [
  { name: "BBC News", url: "https://www.bbc.com/news" },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org/" },
  { name: "Smashing Magazine", url: "https://www.smashingmagazine.com/" },
];

export const presets = [
  {
    id: "holy-grail-v1-flex",
    name: "Holy Grail V1 - Flex",
    description:
      "Header, left sidebar, main content, right sidebar, and footer using Flexbox.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <header class="header">Header</header>
  <aside class="sidebar-left">Left Sidebar</aside>
  <main class="main">Main Content</main>
  <aside class="sidebar-right">Right Sidebar</aside>
  <footer class="footer">Footer</footer>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Wrapping creates the header, middle row, and footer. */
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 16px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.header,
.sidebar-left,
.main,
.sidebar-right,
.footer {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

/* Full-width first row. */
.header {
  flex: 0 0 100%;
  height: 80px;
  background: #f5f0c8;
}

/* The middle regions share the remaining row width in 16/62/16 proportions. */
.sidebar-left,
.main,
.sidebar-right {
  height: calc(100% - 192px);
}

.sidebar-left {
  flex: 16 1 0;
  background: #c8f2e4;
}

.main {
  flex: 62 1 0;
  background: #cfe4f7;
}

.sidebar-right {
  flex: 16 1 0;
  background: #dddaf5;
}

/* Full-width final row. */
.footer {
  flex: 0 0 100%;
  height: 80px;
  background: #f1dce5;
}`,
    editor: { category: "Content" },
  },
  {
    id: "holy-grail-v1-grid",
    name: "Holy Grail V1 - Grid",
    description:
      "Header, left sidebar, main content, right sidebar, and footer using CSS Grid.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <header class="header">Header</header>
  <aside class="sidebar-left">Left Sidebar</aside>
  <main class="main">Main Content</main>
  <aside class="sidebar-right">Right Sidebar</aside>
  <footer class="footer">Footer</footer>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Grid expresses the three-row page shell directly. */
  display: grid;
  grid-template-columns: 16fr 62fr 16fr;
  grid-template-rows: 80px 1fr 80px;
  gap: 16px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.header,
.sidebar-left,
.main,
.sidebar-right,
.footer {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.header {
  grid-column: 1 / -1;
  grid-row: 1;
  background: #f5f0c8;
}

.sidebar-left {
  grid-column: 1;
  grid-row: 2;
  background: #c8f2e4;
}

.main {
  grid-column: 2;
  grid-row: 2;
  background: #cfe4f7;
}

.sidebar-right {
  grid-column: 3;
  grid-row: 2;
  background: #dddaf5;
}

.footer {
  grid-column: 1 / -1;
  grid-row: 3;
  background: #f1dce5;
}`,
    editor: { category: "Content" },
  },
] satisfies PresetSource[];
