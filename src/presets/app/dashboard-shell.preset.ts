import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +----------+-----------------------------------+
 * | Sidebar  | Top bar                           |
 * |          +-----------+-----------+-----------+
 * |          | KPI       | KPI       | KPI       |
 * |          +-----------------------+-----------+
 * |          | Chart                 | Activity  |
 * +----------+-----------------------+-----------+
 */

const inTheWild = [
  { name: "Stripe Dashboard", url: "https://dashboard.stripe.com/" },
  { name: "Shopify Admin", url: "https://admin.shopify.com/" },
  { name: "Google Analytics", url: "https://analytics.google.com/" },
];

export const presets = [
  {
    id: "dashboard-flex",
    name: "Dashboard Shell - Flex",
    description:
      "Sidebar, top bar, KPI row, chart, and activity panel using nested Flexbox containers.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <aside class="sidebar">Sidebar</aside>

  <main class="workspace">
    <header class="topbar">Topbar</header>

    <div class="kpis">
      <section class="kpi kpi-one">KPI 1</section>
      <section class="kpi kpi-two">KPI 2</section>
      <section class="kpi kpi-three">KPI 3</section>
    </div>

    <div class="content-row">
      <section class="chart">Chart</section>
      <section class="activity">Activity</section>
    </div>
  </main>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* The shell is a horizontal Flexbox: sidebar + workspace. */
  display: flex;
  gap: 14px;

  width: 100%;
  height: 100%;
  padding: 10px;
  margin: 0 auto;
}

.sidebar,
.topbar,
.kpi,
.chart,
.activity {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.sidebar {
  flex: 0 0 280px;
  background: #c8f2e4;
}

.workspace {
  /* The workspace stacks its three rows with Flexbox. */
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
  gap: 14px;
}

.topbar {
  flex: 0 0 90px;
  background: #f5f0c8;
}

.kpis {
  /* Three equal KPI cards. */
  display: flex;
  flex: 0 0 150px;
  gap: 14px;
}

.kpi {
  flex: 1 1 0;
}

.kpi-one { background: #cfe4f7; }
.kpi-two { background: #f1dce5; }
.kpi-three { background: #dddaf5; }

.content-row {
  /* The chart receives twice the horizontal space of Activity. */
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  gap: 14px;
}

.chart {
  flex: 2 1 0;
  background: #f2d6e8;
}

.activity {
  flex: 1 1 0;
  background: #f7dfc8;
}`,
    editor: { category: "App" },
  },
  {
    id: "dashboard-grid",
    name: "Dashboard Shell - Grid",
    description:
      "Sidebar, top bar, KPI row, chart, and activity panel using one CSS Grid shell.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <aside class="sidebar">Sidebar</aside>
  <header class="topbar">Topbar</header>
  <section class="kpi kpi-one">KPI 1</section>
  <section class="kpi kpi-two">KPI 2</section>
  <section class="kpi kpi-three">KPI 3</section>
  <section class="chart">Chart</section>
  <section class="activity">Activity</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Grid can place every dashboard region directly in one two-dimensional shell. */
  display: grid;
  grid-template-columns: 280px repeat(3, minmax(0, 1fr));
  grid-template-rows: 90px 150px 1fr;
  gap: 14px;

  width: 100%;
  height: 100%;
  padding: 10px;
  margin: 0 auto;
}

.sidebar,
.topbar,
.kpi,
.chart,
.activity {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.sidebar {
  grid-column: 1;
  grid-row: 1 / -1;
  background: #c8f2e4;
}

.topbar {
  grid-column: 2 / -1;
  grid-row: 1;
  background: #f5f0c8;
}

.kpi-one {
  grid-column: 2;
  grid-row: 2;
  background: #cfe4f7;
}

.kpi-two {
  grid-column: 3;
  grid-row: 2;
  background: #f1dce5;
}

.kpi-three {
  grid-column: 4;
  grid-row: 2;
  background: #dddaf5;
}

.chart {
  grid-column: 2 / span 2;
  grid-row: 3;
  background: #f2d6e8;
}

.activity {
  grid-column: 4;
  grid-row: 3;
  background: #f7dfc8;
}`,
    editor: { category: "App" },
  },
] satisfies PresetSource[];
