import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +--------------+--------------+--------------+
 * | Feature      | Feature      | Feature      |
 * +--------------+--------------+--------------+
 * | Call to action                              |
 * +---------------------------------------------+
 */

const inTheWild = [
  { name: "Linear features", url: "https://linear.app/features" },
  { name: "Asana product pages", url: "https://asana.com/product" },
];

export const presets = [
  {
    id: "three-feature-flex",
    name: "3-Up Features - Flex",
    description:
      "Three equal feature cards above a full-width call to action using Flexbox.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <section class="feature feature-one">Feature One</section>
  <section class="feature feature-two">Feature Two</section>
  <section class="feature feature-three">Feature Three</section>
  <section class="call-to-action">Call To Action</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Wrapping creates a three-card row followed by a full-width CTA. */
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.feature,
.call-to-action {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.feature {
  /* Three cards exactly fill the row after two 20px gaps. */
  flex: 0 0 calc((100% - 40px) / 3);
  height: 180px;
}

.feature-one { background: #cfe4f7; }
.feature-two { background: #f1dce5; }
.feature-three { background: #e4dcf7; }

.call-to-action {
  flex: 0 0 100%;
  height: 150px;
  background: #f7dfc8;
}`,
    editor: { category: "Marketing" },
  },
  {
    id: "three-feature-grid",
    name: "3-Up Features - Grid",
    description:
      "Three equal feature cards above a full-width call to action using CSS Grid.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <section class="feature feature-one">Feature One</section>
  <section class="feature feature-two">Feature Two</section>
  <section class="feature feature-three">Feature Three</section>
  <section class="call-to-action">Call To Action</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Three equal columns plus a second row spanning every column. */
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: 180px 150px;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.feature,
.call-to-action {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.feature-one { background: #cfe4f7; }
.feature-two { background: #f1dce5; }
.feature-three { background: #e4dcf7; }

.call-to-action {
  grid-column: 1 / -1;
  background: #f7dfc8;
}`,
    editor: { category: "Marketing" },
  },
] satisfies PresetSource[];
