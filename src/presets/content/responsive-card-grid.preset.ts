import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +----------+----------+----------+----------+
 * | Card     | Card     | Card     | Card     |
 * +----------+----------+----------+----------+
 * | Card     | Card     | Card     | Card     |
 * +----------+----------+----------+----------+
 */

const inTheWild = [
  {
    name: "Awwwards",
    url: "https://www.awwwards.com/websites/sites_of_the_year/",
  },
  { name: "Airbnb search results", url: "https://www.airbnb.com/" },

  {
    name: "Workbook Portfolios",
    url: "https://www.workbook.com/portfolios/illustrators/editorial",
  },
  {
    name: "Illustrationx",
    url: "https://www.illustrationx.com/styles/editorial",
  },
  { name: "Netflix browse screens", url: "https://www.netflix.com/" },
  { name: "Linear App", url: "https://linear.app/now" },
  { name: "Dribbble", url: "https://dribbble.com/" },

  { name: "Github courses Page", url: "https://learn.github.com/courses/" },

  { name: "Google Workspace Blog", url: "https://workspace.google.com/blog/" },
  { name: "Unclegrey", url: "https://unclegrey.dk/" },
];

export const presets = [
  {
    id: "card-grid-flex",
    name: "Responsive Card Grid - Flex",
    description:
      "Eight equal cards arranged as four columns by two rows using wrapping Flexbox.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <section class="card card-one">Card 1</section>
  <section class="card card-two">Card 2</section>
  <section class="card card-three">Card 3</section>
  <section class="card card-four">Card 4</section>
  <section class="card card-five">Card 5</section>
  <section class="card card-six">Card 6</section>
  <section class="card card-seven">Card 7</section>
  <section class="card card-eight">Card 8</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Fixed flex-basis accounts for the three gaps in each four-card row. */
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 18px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.card {
  box-sizing: border-box;
  flex: 0 0 calc((100% - 54px) / 4);
  height: 170px;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.card-one, .card-five { background: #cfe4f7; }
.card-two, .card-six { background: #d8f1df; }
.card-three, .card-seven { background: #f1dce5; }
.card-four, .card-eight { background: #e4dcf7; }`,
    editor: { category: "Content" },
  },
  {
    id: "card-grid-grid",
    name: "Responsive Card Grid - Grid",
    description:
      "Eight equal cards arranged as four columns by two rows using CSS Grid.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <section class="card card-one">Card 1</section>
  <section class="card card-two">Card 2</section>
  <section class="card card-three">Card 3</section>
  <section class="card card-four">Card 4</section>
  <section class="card card-five">Card 5</section>
  <section class="card card-six">Card 6</section>
  <section class="card card-seven">Card 7</section>
  <section class="card card-eight">Card 8</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Four equal tracks create the two-row card collection. */
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(2, 170px);
  gap: 18px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.card {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.card-one, .card-five { background: #cfe4f7; }
.card-two, .card-six { background: #d8f1df; }
.card-three, .card-seven { background: #f1dce5; }
.card-four, .card-eight { background: #e4dcf7; }`,
    editor: { category: "Content" },
  },
] satisfies PresetSource[];
