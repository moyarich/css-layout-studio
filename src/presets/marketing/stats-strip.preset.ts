import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +------------+------------+------------+------------+
 * | Metric     | Metric     | Metric     | Metric     |
 * +------------+------------+------------+------------+
 */

const inTheWild = [
  { name: "Microsoft Annual Report", url: "https://www.microsoft.com/investor/reports/ar25/" },
  { name: "Stripe company page", url: "https://stripe.com/about" },
  { name: "charity: water", url: "https://www.charitywater.org/" },
];

export const presets = [
  {
    id: "stats-flex",
    name: "Stats Strip - Flex",
    description: "Four equal metric blocks using Flexbox.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <section class="metric metric-one">Metric 1</section>
  <section class="metric metric-two">Metric 2</section>
  <section class="metric metric-three">Metric 3</section>
  <section class="metric metric-four">Metric 4</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Equal flex factors create a four-metric strip. */
  display: flex;
  align-items: center;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.metric {
  box-sizing: border-box;
  flex: 1 1 0;
  min-width: 0;
  height: 100px;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.metric-one { background: #cfe4f7; }
.metric-two { background: #d8f1df; }
.metric-three { background: #f5f0c8; }
.metric-four { background: #e4dcf7; }`,
    editor: { category: "Marketing" },
  },
  {
    id: "stats-grid",
    name: "Stats Strip - Grid",
    description: "Four equal metric blocks using CSS Grid.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <section class="metric metric-one">Metric 1</section>
  <section class="metric metric-two">Metric 2</section>
  <section class="metric metric-three">Metric 3</section>
  <section class="metric metric-four">Metric 4</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Four equal tracks reproduce the metric strip. */
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: center;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.metric {
  box-sizing: border-box;
  min-width: 0;
  height: 100px;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.metric-one { background: #cfe4f7; }
.metric-two { background: #d8f1df; }
.metric-three { background: #f5f0c8; }
.metric-four { background: #e4dcf7; }`,
    editor: { category: "Marketing" },
  },
] satisfies PresetSource[];
