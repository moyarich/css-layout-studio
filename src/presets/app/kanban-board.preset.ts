import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +-----------+-----------+-----------+-----------+
 * | Backlog   | To do     | Doing     | Done      |
 * |           |           |           |           |
 * |           |           |           |           |
 * +-----------+-----------+-----------+-----------+
 */

const inTheWild = [
  { name: "Trello boards", url: "https://trello.com/" },
  { name: "Jira boards", url: "https://www.atlassian.com/software/jira" },
  { name: "GitHub Projects", url: "https://github.com/features/issues" },
];

export const presets = [
  {
    id: "kanban-flex",
    name: "Kanban Board - Flex",
    description: "Four equal workflow columns using Flexbox.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <section class="column backlog">Backlog</section>
  <section class="column todo">Todo</section>
  <section class="column doing">Doing</section>
  <section class="column done">Done</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Equal flex factors create four same-width workflow columns. */
  display: flex;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.column {
  box-sizing: border-box;
  flex: 1 1 0;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.backlog { background: #e4dcf7; }
.todo { background: #cfe4f7; }
.doing { background: #f5f0c8; }
.done { background: #d8f1df; }`,
    editor: { category: "App" },
  },
  {
    id: "kanban-grid",
    name: "Kanban Board - Grid",
    description: "Four equal workflow columns using CSS Grid.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <section class="column backlog">Backlog</section>
  <section class="column todo">Todo</section>
  <section class="column doing">Doing</section>
  <section class="column done">Done</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Four equal tracks create the workflow columns. */
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.column {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.backlog { background: #e4dcf7; }
.todo { background: #cfe4f7; }
.doing { background: #f5f0c8; }
.done { background: #d8f1df; }`,
    editor: { category: "App" },
  },
] satisfies PresetSource[];
