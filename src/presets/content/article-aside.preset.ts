import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +------------------------------+-------------+
 * | Article                      | Aside       |
 * |                              +-------------+
 * |                              | Related     |
 * +------------------------------+-------------+
 */

const inTheWild = [
  { name: "MDN documentation", url: "https://developer.mozilla.org/" },
  { name: "Wikipedia articles", url: "https://www.wikipedia.org/" },
  { name: "The Guardian articles", url: "https://www.theguardian.com/" },
];

export const presets = [
  {
    id: "article-flex",
    name: "Article + Aside - Flex",
    description:
      "Readable article with a stacked aside and related-content rail using Flexbox.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <article class="article">Article</article>

  <div class="supporting-content">
    <aside class="aside">Aside</aside>
    <section class="related">Related</section>
  </div>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* The article and supporting rail form the outer Flexbox row. */
  display: flex;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.article {
  flex: 7 1 0;
}

.supporting-content {
  /* The rail is another Flexbox, stacked vertically. */
  display: flex;
  flex: 3 1 0;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.aside {
  flex: 2 1 0;
}

.related {
  flex: 1 1 0;
}

.article,
.aside,
.related {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 18px;
}

.article { background: #cfe4f7; }
.aside { background: #c8f2e4; }
.related { background: #f1dce5; }`,
    editor: { category: "Content" },
  },
  {
    id: "article-grid",
    name: "Article + Aside - Grid",
    description:
      "Readable article with a stacked aside and related-content rail using CSS Grid.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <article class="article">Article</article>

  <div class="supporting-content">
    <aside class="aside">Aside</aside>
    <section class="related">Related</section>
  </div>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* A 7/3 grid creates the article and supporting rail. */
  display: grid;
  grid-template-columns: 7fr 3fr;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.supporting-content {
  /* The rail itself uses two proportional Grid rows. */
  display: grid;
  grid-template-rows: 2fr 1fr;
  gap: 20px;
  min-width: 0;
}

.article,
.aside,
.related {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 18px;
}

.article { background: #cfe4f7; }
.aside { background: #c8f2e4; }
.related { background: #f1dce5; }`,
    editor: { category: "Content" },
  },
] satisfies PresetSource[];
