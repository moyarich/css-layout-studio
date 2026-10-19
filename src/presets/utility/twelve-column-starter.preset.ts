import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +---------------------------------------------------+
 * | 12 columns                                        |
 * +----------------------------------+----------------+
 * | 8 columns                        | 4 columns      |
 * +-------------------------+-------------------------+
 * | 6 columns               | 6 columns               |
 * +------------+------------+------------+------------+
 * | 3 columns  | 3 columns  | 3 columns  | 3 columns  |
 * +------------+------------+------------+------------+
 */

const inTheWild = [
  { name: "Bootstrap grid", url: "https://getbootstrap.com/docs/5.3/layout/grid/" },
  { name: "Material Design layouts", url: "https://m3.material.io/foundations/layout/understanding-layout/overview" },
  { name: "The New York Times", url: "https://www.nytimes.com/" },
];

export const presets = [
  {
    id: "12-col-flex",
    name: "12-Column Starter - Flex",
    description:
      "12/8/4/6/6/3-column span examples reproduced with wrapping Flexbox.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <section class="span full-span">12 cols</section>
  <section class="span eight-span">8 cols</section>
  <section class="span four-span">4 cols</section>
  <section class="span half-span half-a">6 cols</section>
  <section class="span half-span half-b">6 cols</section>
  <section class="span quarter-span quarter-a">3 cols</section>
  <section class="span quarter-span quarter-b">3 cols</section>
  <section class="span quarter-span quarter-c">3 cols</section>
  <section class="span quarter-span quarter-d">3 cols</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Each calculated flex-basis subtracts row gaps before applying the span ratio. */
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.span {
  box-sizing: border-box;
  height: 90px;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.full-span {
  flex: 0 0 100%;
  background: #cfe4f7;
}

.eight-span {
  flex: 0 0 calc((100% - 20px) * 2 / 3);
  background: #d8f1df;
}

.four-span {
  flex: 0 0 calc((100% - 20px) / 3);
  background: #f5f0c8;
}

.half-span {
  flex: 0 0 calc((100% - 20px) / 2);
}

.half-a { background: #e4dcf7; }
.half-b { background: #f1dce5; }

.quarter-span {
  flex: 0 0 calc((100% - 60px) / 4);
}

.quarter-a { background: #dcecf7; }
.quarter-b { background: #f7dfc8; }
.quarter-c { background: #d8f1df; }
.quarter-d { background: #e7def3; }`,
    editor: { category: "Utility" },
  },
  {
    id: "12-col-grid",
    name: "12-Column Starter - Grid",
    description: "12/8/4/6/6/3-column span examples using a 12-track CSS Grid.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <section class="span full-span">12 cols</section>
  <section class="span eight-span">8 cols</section>
  <section class="span four-span">4 cols</section>
  <section class="span half-span half-a">6 cols</section>
  <section class="span half-span half-b">6 cols</section>
  <section class="span quarter-span quarter-a">3 cols</section>
  <section class="span quarter-span quarter-b">3 cols</section>
  <section class="span quarter-span quarter-c">3 cols</section>
  <section class="span quarter-span quarter-d">3 cols</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Twelve equal tracks make each requested span explicit. */
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: repeat(4, 90px);
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.span {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.full-span {
  grid-column: span 12;
  background: #cfe4f7;
}

.eight-span {
  grid-column: span 8;
  background: #d8f1df;
}

.four-span {
  grid-column: span 4;
  background: #f5f0c8;
}

.half-span {
  grid-column: span 6;
}

.half-a { background: #e4dcf7; }
.half-b { background: #f1dce5; }

.quarter-span {
  grid-column: span 3;
}

.quarter-a { background: #dcecf7; }
.quarter-b { background: #f7dfc8; }
.quarter-c { background: #d8f1df; }
.quarter-d { background: #e7def3; }`,
    editor: { category: "Utility" },
  },
] satisfies PresetSource[];
