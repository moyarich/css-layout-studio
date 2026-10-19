import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +-------------------------+-------------------------+
 * | Hero copy               | Hero visual             |
 * |                         |                         |
 * +-------------------------+-------------------------+
 */

const inTheWild = [
  { name: "Polene Paris", url: "https://eng.polene-paris.com/" },
];

export const presets = [
  {
    id: "split-hero-flex",
    name: "Split Hero - Flex",
    description: "Equal-width hero copy and visual panels using Flexbox.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <section class="hero-copy">Hero Copy</section>
  <section class="hero-visual">Hero Visual</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Flex distributes the available row width equally. */
  display: flex;
  align-items: stretch;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.hero-copy,
.hero-visual {
  box-sizing: border-box;
  flex: 1 1 0;
  min-width: 0;
  min-height: 320px;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 20px;
}

.hero-copy { background: #cfe4f7; }
.hero-visual { background: #e4dcf7; }`,
    editor: { category: "Marketing" },
  },
  {
    id: "split-hero-grid",
    name: "Split Hero - Grid",
    description: "Equal-width hero copy and visual panels using CSS Grid.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <section class="hero-copy">Hero Copy</section>
  <section class="hero-visual">Hero Visual</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Two equal grid tracks create the split. */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.hero-copy,
.hero-visual {
  box-sizing: border-box;
  min-width: 0;
  min-height: 320px;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 20px;
}

.hero-copy { background: #cfe4f7; }
.hero-visual { background: #e4dcf7; }`,
    editor: { category: "Marketing" },
  },
] satisfies PresetSource[];
