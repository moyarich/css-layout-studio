import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +-----------------------------------------------------------+
 * | Fixed documentation header                                |
 * +--------------+-----------------------------+--------------+
 * | Scrollable   | Scrollable document         | On this page |
 * | docs nav     |                             | navigation   |
 * |              |                             |              |
 * |              |-----------------------------|              |
 * |              | Article footer              |              |
 * +--------------+-----------------------------+--------------+
 */

const inTheWild = [
  {
    name: "Vite shared-options documentation",
    url: "https://vite.dev/config/shared-options",
  },
];

const html = `<div class="container">
  <header class="header">
    <strong>Documentation</strong>
    <nav>Guide &nbsp; Config &nbsp; Plugins</nav>
  </header>

  <div class="docs-shell">
    <aside class="sidebar-left">
      <strong>Config</strong>
      <a>Configuring</a>
      <a class="active">Shared options</a>
      <a>Server options</a>
      <a>Build options</a>
      <div class="nav-spacer"></div>
    </aside>

    <main class="article">
      <article class="document">
        <small>CONFIG</small>
        <h1>Shared Options</h1>
        <p>Options in this section apply across development, build, and preview.</p>
        <section><h2>root</h2><code>string · Default: process.cwd()</code></section>
        <section><h2>base</h2><code>string · Default: /</code></section>
        <section><h2>mode</h2><code>string</code></section>
        <div class="article-spacer"></div>
      </article>
      <footer class="footer">Previous: Configuring &nbsp; · &nbsp; Next: Server Options</footer>
    </main>

    <aside class="sidebar-right">
      <strong>On this page</strong>
      <a>root</a>
      <a>base</a>
      <a>mode</a>
      <a>plugins</a>
    </aside>
  </div>
</div>`;

const sharedStyles = `

/* Shared region surfaces */
.header,
.sidebar-left,
.document,
.sidebar-right,
.footer {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
}

/* Fixed documentation header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  background: #f5f0c8;
}

.header nav { color: #5e6470; font-size: 12px; }

/* Documentation navigation */
.sidebar-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
  background: #c8f2e4;
}

.sidebar-left a,
.sidebar-right a {
  padding: 5px 7px;
  border-radius: 5px;
  color: #4f5968;
  font-size: 11px;
}

.sidebar-left .active {
  background: #ffffff;
  color: #5065d6;
  font-weight: 700;
}

.nav-spacer { min-height: 75vh; }

/* Scrollable document */
.article {
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
}

.document {
  padding: 28px;
  background: #ffffff;
}

.document h1 { margin: 6px 0 10px; }
.document p { color: #5e6470; line-height: 1.6; }
.document section { padding: 18px 0; border-top: 1px solid #d7dce5; }
.document section h2 { margin: 0 0 8px; }
.document code { color: #5065d6; }
.article-spacer { min-height: 70vh; }

.footer {
  margin-top: 16px;
  padding: 18px;
  background: #f1dce5;
  color: #5e6470;
  text-align: center;
}

/* On-page navigation */
.sidebar-right {
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 100%;
  padding: 16px;
  overflow-y: auto;
  background: #dddaf5;
}`;

export const presets = [
  {
    id: "holy-grail-v4-flex",
    name: "Holy Grail V4 - Flex",
    description:
      "Documentation shell with a fixed header, scrollable navigation and article, an on-page rail, and an article footer using Flexbox.",
    type: "flex",
    inTheWild,
    html,
    css: `.container {
  box-sizing: border-box;

  /* The outer Flexbox reserves a fixed header above the documentation shell. */
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
  overflow: hidden;
  background: #f7f8fb;
}

.header { flex: 0 0 64px; }

.docs-shell {
  display: flex;
  flex: 1 1 0;
  gap: 16px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.sidebar-left { flex: 0 0 220px; }
.article { flex: 1 1 0; }
.sidebar-right { flex: 0 0 190px; }
${sharedStyles}`,
    editor: { category: "Content" },
  },
  {
    id: "holy-grail-v4-grid",
    name: "Holy Grail V4 - Grid",
    description:
      "Documentation shell with a fixed header, scrollable navigation and article, an on-page rail, and an article footer using CSS Grid.",
    type: "grid",
    inTheWild,
    html,
    css: `.container {
  box-sizing: border-box;

  /* The outer Grid reserves a fixed header above the documentation shell. */
  display: grid;
  grid-template-rows: 64px minmax(0, 1fr);
  gap: 16px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
  overflow: hidden;
  background: #f7f8fb;
}

.docs-shell {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) 190px;
  gap: 16px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
${sharedStyles}`,
    editor: { category: "Content" },
  },
] satisfies PresetSource[];
