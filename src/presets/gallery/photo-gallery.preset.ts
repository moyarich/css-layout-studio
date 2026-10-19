import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +----------------------+-----------+-----------+
 * | Large photo          | Photo     | Photo     |
 * |                      +-----------+-----------+
 * +-----------+----------+-----------------------+
 * | Photo     | Photo    | Wide photo            |
 * +-----------+----------+-----------------------+
 */

const inTheWild = [
  { name: "Google Photos", url: "https://photos.google.com/" },
  { name: "Behance galleries", url: "https://www.behance.net/" },
  { name: "Zillow listings", url: "https://www.zillow.com/" },
];

export const presets = [
  {
    id: "gallery-flex",
    name: "Photo Gallery - Flex",
    description:
      "Dense editorial gallery with varied image regions using nested Flexbox groups.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <div class="gallery-top">
    <section class="photo photo-a">Photo A</section>

    <div class="gallery-top-right">
      <section class="photo photo-b">Photo B</section>
      <div class="gallery-pair">
        <section class="photo photo-c">Photo C</section>
        <section class="photo photo-d">Photo D</section>
      </div>
    </div>
  </div>

  <div class="gallery-bottom">
    <section class="photo photo-e">Photo E</section>
    <section class="photo photo-f">Photo F</section>
    <section class="photo photo-g">Photo G</section>
  </div>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Nested Flexbox groups preserve the editorial composition without Grid. */
  display: flex;
  flex-direction: column;
  gap: 10px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.gallery-top,
.gallery-top-right,
.gallery-pair,
.gallery-bottom {
  display: flex;
  gap: 10px;
}

.gallery-top {
  flex: 0 0 280px;
}

.photo-a {
  flex: 1 1 0;
}

.gallery-top-right {
  flex: 1 1 0;
  flex-direction: column;
}

.photo-b,
.gallery-pair {
  flex: 1 1 0;
}

.photo-c {
  flex: 2 1 0;
}

.photo-d {
  flex: 1 1 0;
}

.gallery-bottom {
  flex: 0 0 220px;
}

.photo-e,
.photo-f {
  flex: 1 1 0;
}

.photo-g {
  flex: 2 1 0;
}

.photo {
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 14px;
}

.photo-a { background: #cfe4f7; }
.photo-b { background: #d8f1df; }
.photo-c { background: #f5f0c8; }
.photo-d { background: #f1dce5; }
.photo-e { background: #e4dcf7; }
.photo-f { background: #f7dfc8; }
.photo-g { background: #dcecf7; }`,
    editor: { category: "Gallery" },
  },
  {
    id: "gallery-grid",
    name: "Photo Gallery - Grid",
    description:
      "Dense editorial gallery with varied image regions using nested CSS Grid groups.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <div class="gallery-top">
    <section class="photo photo-a">Photo A</section>

    <div class="gallery-top-right">
      <section class="photo photo-b">Photo B</section>
      <div class="gallery-pair">
        <section class="photo photo-c">Photo C</section>
        <section class="photo photo-d">Photo D</section>
      </div>
    </div>
  </div>

  <div class="gallery-bottom">
    <section class="photo photo-e">Photo E</section>
    <section class="photo photo-f">Photo F</section>
    <section class="photo photo-g">Photo G</section>
  </div>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Grid tracks reproduce the grouped editorial composition. */
  display: grid;
  grid-template-rows: 280px 220px;
  gap: 10px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.gallery-top {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.gallery-top-right {
  display: grid;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.gallery-pair {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 10px;
}

.gallery-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 10px;
}

.photo {
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 14px;
}

.photo-a { background: #cfe4f7; }
.photo-b { background: #d8f1df; }
.photo-c { background: #f5f0c8; }
.photo-d { background: #f1dce5; }
.photo-e { background: #e4dcf7; }
.photo-f { background: #f7dfc8; }
.photo-g { background: #dcecf7; }`,
    editor: { category: "Gallery" },
  },
] satisfies PresetSource[];
