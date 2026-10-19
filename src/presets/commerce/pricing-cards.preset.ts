import { PresetSource } from "..";

/*
 * Visual structure
 *
 *               +-------------+
 * +-------------+ Featured    +-------------+
 * | Basic       | plan        | Pro         |
 * |             |             |             |
 * +-------------+-------------+-------------+
 */

const inTheWild = [
  { name: "GitHub Pricing", url: "https://github.com/pricing" },
  { name: "Webflow plans", url: "https://webflow.com/pricing" },
  { name: "Notion Pricing", url: "https://www.notion.com/pricing" },
];

export const presets = [
  {
    id: "pricing-flex",
    name: "Pricing Cards - Flex",
    description:
      "Three pricing tiers with a taller featured center card using Flexbox.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <section class="plan starter-plan">Starter</section>
  <section class="plan pro-plan">Pro</section>
  <section class="plan business-plan">Business</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Flex weights define the 29/33/29 card proportions. */
  display: flex;
  align-items: center;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.plan {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 18px;
}

.starter-plan {
  flex: 29 1 0;
  height: 340px;
  background: #d8f1df;
}

.pro-plan {
  flex: 33 1 0;
  height: 390px;
  background: #cfe4f7;
}

.business-plan {
  flex: 29 1 0;
  height: 340px;
  background: #e4dcf7;
}`,
    editor: { category: "Commerce" },
  },
  {
    id: "pricing-grid",
    name: "Pricing Cards - Grid",
    description:
      "Three pricing tiers with a taller featured center card using CSS Grid.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <section class="plan starter-plan">Starter</section>
  <section class="plan pro-plan">Pro</section>
  <section class="plan business-plan">Business</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Fractional tracks mirror the Flexbox card proportions. */
  display: grid;
  grid-template-columns: 29fr 33fr 29fr;
  align-items: center;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.plan {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 18px;
}

.starter-plan {
  height: 340px;
  background: #d8f1df;
}

.pro-plan {
  height: 390px;
  background: #cfe4f7;
}

.business-plan {
  height: 340px;
  background: #e4dcf7;
}`,
    editor: { category: "Commerce" },
  },
] satisfies PresetSource[];
