import type { PresetSource } from "../../editor/types";

/*
 * Visual structure
 *
 * +--------------+--------------------------------+
 * | Sidebar      | Main panel                     |
 * |              |                                |
 * |              |                                |
 * +--------------+--------------------------------+
 */

const inTheWild: NonNullable<PresetSource["inTheWild"]> = [];

export const presets = [
  {
    id: "sidebar-flex",
    name: "Sidebar Layout - Flex",
    description: "Left sidebar with a flexible main panel using Flexbox.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <aside class="sidebar">Sidebar</aside>
  <main class="main">Main Content</main>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* A 1/3 Flexbox split creates the sidebar and main panel. */
  display: flex;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.sidebar,
.main {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 18px;
}

.sidebar {
  flex: 1 1 0;
  background: #c8f2e4;
}

.main {
  flex: 3 1 0;
  background: #cfe4f7;
}`,
    editor: { category: "App" },
  },
  {
    id: "sidebar-grid",
    name: "Sidebar Layout - Grid",
    description: "Left sidebar with a flexible main panel using CSS Grid.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <aside class="sidebar">Sidebar</aside>
  <main class="main">Main Content</main>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* A 1/3 Grid split reproduces the sidebar proportions. */
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.sidebar,
.main {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 18px;
}

.sidebar { background: #c8f2e4; }
.main { background: #cfe4f7; }`,
    editor: { category: "App" },
  },
] satisfies PresetSource[];
