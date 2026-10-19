import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +--------------------------+------------------+
 * | Primary feature          | Feature          |
 * |                          +------------------+
 * |                          | Feature          |
 * +-------------+------------+------------------+
 * | Feature     | Feature    | Feature          |
 * +-------------+------------+------------------+
 */

const inTheWild = [
  { name: "Animaapp", url: "https://www.animaapp.com/" },
  { name: "Apple product pages", url: "https://www.apple.com/" },
  {
    name: "The Artworks Inc",
    url: "https://www.theartworksinc.com/editorial-illustration/",
  },
];

export const presets = [
  {
    id: "bento-flex",
    name: "Bento Grid - Flex",
    description:
      "Asymmetric product-feature bento using nested Flexbox groups.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <div class="bento-top">
    <section class="primary-feature">Primary</section>
    <div class="side-stack">
      <section class="stat-card">Stat</section>
      <section class="logo-cloud">Logo Cloud</section>
    </div>
  </div>

  <div class="bento-bottom">
    <section class="insight">Insight</section>
    <section class="automation">Automation</section>
  </div>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Flexbox needs semantic row/stack groups to model this two-dimensional bento. */
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.bento-top,
.bento-bottom,
.side-stack {
  display: flex;
  gap: 16px;
}

.bento-top {
  flex: 0 0 300px;
}

.primary-feature {
  flex: 2 1 0;
}

.side-stack {
  flex: 1 1 0;
  flex-direction: column;
}

.stat-card,
.logo-cloud {
  flex: 1 1 0;
}

.bento-bottom {
  flex: 0 0 180px;
}

.insight {
  flex: 1 1 0;
}

.automation {
  flex: 2 1 0;
}

.primary-feature,
.stat-card,
.logo-cloud,
.insight,
.automation {
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.primary-feature { background: #cfe4f7; }
.stat-card { background: #f5f0c8; }
.logo-cloud { background: #e4dcf7; }
.insight { background: #d8f1df; }
.automation { background: #f1dce5; }`,
    editor: { category: "Marketing" },
  },
  {
    id: "bento-grid",
    name: "Bento Grid - Grid",
    description:
      "Asymmetric product-feature bento using nested CSS Grid groups.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <div class="bento-top">
    <section class="primary-feature">Primary</section>
    <div class="side-stack">
      <section class="stat-card">Stat</section>
      <section class="logo-cloud">Logo Cloud</section>
    </div>
  </div>

  <div class="bento-bottom">
    <section class="insight">Insight</section>
    <section class="automation">Automation</section>
  </div>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* the semantic groups use Grid tracks instead of Flexbox distribution. */
  display: grid;
  grid-template-rows: 300px 180px;
  gap: 16px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.bento-top {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.side-stack {
  display: grid;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.bento-bottom {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
}

.primary-feature,
.stat-card,
.logo-cloud,
.insight,
.automation {
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.primary-feature { background: #cfe4f7; }
.stat-card { background: #f5f0c8; }
.logo-cloud { background: #e4dcf7; }
.insight { background: #d8f1df; }
.automation { background: #f1dce5; }`,
    editor: { category: "Marketing" },
  },
] satisfies PresetSource[];
