import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +---------------------------------------------+
 * |                  Eyebrow                    |
 * |               Hero headline                 |
 * |                Hero copy                    |
 * |              Hero visual                    |
 * +---------------------------------------------+
 */

const inTheWild = [{ name: "Notion homepage", url: "https://www.notion.com/" }];

export const presets = [
  {
    id: "centered-hero-flex",
    name: "Centered Hero - Flex",
    description:
      "Centered eyebrow, headline, actions, and product shot using a Flexbox column.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <section class="eyebrow">Eyebrow</section>
  <section class="headline">Headline</section>
  <section class="actions">Actions</section>
  <section class="product-shot">Product Shot</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* A vertical Flexbox models the single centered content stack. */
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.eyebrow,
.headline,
.actions,
.product-shot {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.eyebrow {
  flex: 0 0 54px;
  background: #f5f0c8;
}

.headline {
  flex: 0 0 120px;
  background: #cfe4f7;
}

.actions {
  flex: 0 0 72px;
  background: #f1dce5;
}

.product-shot {
  flex: 0 0 260px;
  background: #e4dcf7;
}`,
    editor: { category: "Marketing" },
  },
  {
    id: "centered-hero-grid",
    name: "Centered Hero - Grid",
    description:
      "Centered eyebrow, headline, actions, and product shot using CSS Grid rows.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <section class="eyebrow">Eyebrow</section>
  <section class="headline">Headline</section>
  <section class="actions">Actions</section>
  <section class="product-shot">Product Shot</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Explicit rows reproduce the vertical stack. */
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: 54px 120px 72px 260px;
  gap: 16px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.eyebrow,
.headline,
.actions,
.product-shot {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.eyebrow { background: #f5f0c8; }
.headline { background: #cfe4f7; }
.actions { background: #f1dce5; }
.product-shot { background: #e4dcf7; }`,
    editor: { category: "Marketing" },
  },
] satisfies PresetSource[];
