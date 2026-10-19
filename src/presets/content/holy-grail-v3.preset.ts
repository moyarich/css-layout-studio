import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +---------------------------------------------------+
 * | Header                                            |
 * +------------+------------------------+-------------+
 * | Sticky     |                        |             |
 * |            | Scrollable article     | Scrollable  |
 * | Side scroll|                        | right side  |
 * |            |                        |             |
 * |            |                        |             |
 * |            +------------------------+-------------+
 * |            | Footer                               |
 * +------------+--------------------------------------+
 */

const inTheWild = [
  {
    name: "Visual Studio",
    url: "https://code.visualstudio.com/docs/editing/userinterface/",
  },
];

const html = `<div class="container">
  <header class="header">Header</header>

  <div class="workspace">
    <aside class="sidebar-left">
      <div class="sidebar-sticky">Sticky Sidebar</div>
      <div class="sidebar-scroll-content">Scrollable Side Content</div>
    </aside>

    <div class="content-shell">
      <main class="content-row">
        <article class="article">
          <div>Scrollable Article</div>
          <div class="article-scroll-content"></div>
        </article>
        <aside class="sidebar-right">
          <div>Scrollable Right Sidebar</div>
          <div class="right-scroll-content"></div>
        </aside>
      </main>

      <footer class="footer">Footer</footer>
    </div>
  </div>
</div>`;

const sharedRegionStyles = `.header,
.sidebar-left,
.article,
.sidebar-right,
.footer {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.header { background: #f5f0c8; }
.sidebar-left { background: #c8f2e4; }
.article { background: #cfe4f7; }
.sidebar-right { background: #dddaf5; }
.footer { background: #f1dce5; }

.sidebar-sticky {
  position: sticky;
  top: 0;
  z-index: 1;
  padding-bottom: 16px;
  background: #c8f2e4;
}

.sidebar-scroll-content,
.article-scroll-content,
.right-scroll-content {
  min-height: 100vh;
}`;

export const presets = [
  {
    id: "holy-grail-v3-flex",
    name: "Holy Grail V3 - Flex",
    description:
      "Fixed header, sticky scrolling left sidebar, independently scrollable article and right rail, and an inset footer using Flexbox.",
    type: "flex",
    inTheWild,
    html,
    css: `.container {
  box-sizing: border-box;

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
  flex: 0 0 72px;
}

.workspace {
  display: flex;
  flex: 1 1 0;
  gap: 16px;

  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.sidebar-left {
  flex: 0 0 240px;

  min-height: 0;
  overflow-y: auto;
}

.content-shell {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 16px;

  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.content-row {
  display: flex;
  flex: 1 1 0;
  gap: 16px;

  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.article {
  flex: 1 1 0;

  min-height: 0;
  overflow-y: auto;
}

.sidebar-right {
  flex: 0 0 280px;

  min-height: 0;
  overflow-y: auto;
}

.footer {
  flex: 0 0 72px;
}

${sharedRegionStyles}`,
    editor: { category: "Content" },
  },
  {
    id: "holy-grail-v3-grid",
    name: "Holy Grail V3 - Grid",
    description:
      "Fixed header, sticky scrolling left sidebar, independently scrollable article and right rail, and an inset footer using CSS Grid.",
    type: "grid",
    inTheWild,
    html,
    css: `.container {
  box-sizing: border-box;

  display: grid;
  grid-template-rows: 72px minmax(0, 1fr);
  gap: 16px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
  overflow: hidden;
}

.workspace {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 16px;

  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.sidebar-left {
  min-height: 0;
  overflow-y: auto;
}

.content-shell {
  display: grid;
  grid-template-rows: minmax(0, 1fr) 72px;
  gap: 16px;

  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.content-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 16px;

  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.article,
.sidebar-right {
  min-height: 0;
  overflow-y: auto;
}

${sharedRegionStyles}`,
    editor: { category: "Content" },
  },
] satisfies PresetSource[];
