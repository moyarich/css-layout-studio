import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +----------------------+----------------------+
 * | Before               | After                |
 * |                      |                      |
 * +----------------------+----------------------+
 */

const inTheWild = [
  { name: "Dropbox homepage", url: "https://www.dropbox.com/" },
  {
    name: "Adobe Lightroom",
    url: "https://www.adobe.com/products/photoshop-lightroom.html",
  },
  {
    name: "Awwwards case studies",
    url: "https://www.awwwards.com/websites/case-study/",
  },
];

export const presets = [
  {
    id: "comparison-flex",
    name: "Before / After - Flex",
    description: "Balanced before-and-after panels using Flexbox.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <section class="before">Before</section>
  <section class="after">After</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Equal flex factors create a balanced comparison. */
  display: flex;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.before,
.after {
  box-sizing: border-box;
  flex: 1 1 0;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 18px;
}

.before { background: #f1dce5; }
.after { background: #d8f1df; }`,
    editor: { category: "Content" },
  },
  {
    id: "comparison-grid",
    name: "Before / After - Grid",
    description: "Balanced before-and-after panels using CSS Grid.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <section class="before">Before</section>
  <section class="after">After</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Two equal tracks create the balanced comparison. */
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.before,
.after {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 18px;
}

.before { background: #f1dce5; }
.after { background: #d8f1df; }`,
    editor: { category: "Content" },
  },
] satisfies PresetSource[];
