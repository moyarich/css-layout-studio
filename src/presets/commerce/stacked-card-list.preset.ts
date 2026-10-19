// ==== File: CSS Generator/src/presets/commerce/stacked-card-list.preset.ts ====

import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +-------------------------------------------------------------+
 * | Hero                                                        |
 * +-------------------------------------------------------------+
 * | Card List                                             |
 * | +-----+----------+-------------------+-------+-------------+ |
 * | | #1  | Product  | Details           | Score | Action      | |
 * | +-----+----------+-------------------+-------+-------------+ |
 * | | #2  | Product  | Details           | Score | Action      | |
 * | +-----+----------+-------------------+-------+-------------+ |
 * | | #3  | Product  | Details           | Score | Action      | |
 * | +-----+----------+-------------------+-------+-------------+ |
 * +-------------------------------------------------------------+
 */

const inTheWild = [
  {
    name: "Projectools CRM comparison",
    url: "https://projectools.io/compare/crm-management/",
  },
  {
    name: "Google Meet Blog",
    url: "https://workspace.google.com/blog/meet",
  },
];

export const presets = [
  {
    id: "stacked-card-list-flex",
    name: "Stacked card List - Flex",
    description:
      "Hero above a vertically ranked list of product comparison rows using nested Flexbox containers.",
    type: "flex",
    inTheWild,

    html: `<div class="container">
  <header class="hero">Comparison Hero</header>

  <main class="comparison-list">
    <article class="comparison-item">
      <section class="rank">#1</section>
      <section class="product">Product</section>
      <section class="details">Details</section>
      <section class="score">Score</section>
      <section class="action">Action</section>
    </article>

    <article class="comparison-item">
      <section class="rank">#2</section>
      <section class="product">Product</section>
      <section class="details">Details</section>
      <section class="score">Score</section>
      <section class="action">Action</section>
    </article>

    <article class="comparison-item">
      <section class="rank">#3</section>
      <section class="product">Product</section>
      <section class="details">Details</section>
      <section class="score">Score</section>
      <section class="action">Action</section>
    </article>
  </main>
</div>`,

    css: `.container {
  box-sizing: border-box;

  /* The page stacks the hero above the stacked card list. */
  display: flex;
  flex-direction: column;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.hero,
.comparison-item > * {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.hero {
  flex: 0 0 140px;
  background: #f5f0c8;
}

.comparison-list {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  gap: 16px;
}

.comparison-item {
  /* Fixed supporting regions leave the details column flexible. */
  display: flex;
  flex: 1 1 0;
  min-height: 0;
  gap: 12px;
}

.rank {
  flex: 0 0 64px;
  background: #f5f0c8;
}

.product {
  flex: 0 0 160px;
  background: #cfe4f7;
}

.details {
  flex: 1 1 0;
  min-width: 0;
  background: #d8f1df;
}

.score {
  flex: 0 0 110px;
  background: #dddaf5;
}

.action {
  flex: 0 0 150px;
  background: #f7dfc8;
}`,
    editor: {
      category: "Commerce",
    },
  },

  {
    id: "stacked-card-list-grid",
    name: "Stacked card List - Grid",
    description:
      "Hero above a vertically ranked list of product comparison rows using CSS Grid.",
    type: "grid",
    inTheWild,

    html: `<div class="container">
  <header class="hero">Comparison Hero</header>

  <main class="comparison-list">
    <article class="comparison-item">
      <section class="rank">#1</section>
      <section class="product">Product</section>
      <section class="details">Details</section>
      <section class="score">Score</section>
      <section class="action">Action</section>
    </article>

    <article class="comparison-item">
      <section class="rank">#2</section>
      <section class="product">Product</section>
      <section class="details">Details</section>
      <section class="score">Score</section>
      <section class="action">Action</section>
    </article>

    <article class="comparison-item">
      <section class="rank">#3</section>
      <section class="product">Product</section>
      <section class="details">Details</section>
      <section class="score">Score</section>
      <section class="action">Action</section>
    </article>
  </main>
</div>`,

    css: `.container {
  box-sizing: border-box;

  /* The page uses two rows: hero and flexible comparison list. */
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: 140px minmax(0, 1fr);
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.hero,
.comparison-item > * {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.hero {
  background: #f5f0c8;
}

.comparison-list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: repeat(3, minmax(0, 1fr));
  min-height: 0;
  gap: 16px;
}

.comparison-item {
  /*
   * Rank, product, score, and action stay predictable while
   * the details track receives the remaining horizontal space.
   */
  display: grid;
  grid-template-columns:
    64px
    160px
    minmax(0, 1fr)
    110px
    150px;
  min-height: 0;
  gap: 12px;
}

.rank {
  background: #f5f0c8;
}

.product {
  background: #cfe4f7;
}

.details {
  background: #d8f1df;
}

.score {
  background: #dddaf5;
}

.action {
  background: #f7dfc8;
}`,
    editor: {
      category: "Commerce",
    },
  },
] satisfies PresetSource[];
