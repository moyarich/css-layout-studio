// ==== File: CSS Generator/src/presets/commerce/editorial-showcase.preset.ts ====

import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +-------------------------------------------------------------+
 * | Navigation                                                  |
 * +-------------------------------------------------------------+
 * |                                                             |
 * | Full-Bleed Hero                                             |
 * |                                                             |
 * +-------------------------------------------------------------+
 * | Editorial Feature                                           |
 * | +----------------------+----------------------------------+ |
 * | | Copy                 | Visual                           | |
 * | |                      |                                  | |
 * | +----------------------+----------------------------------+ |
 * +-------------------------------------------------------------+
 * |                                                             |
 * | Full-Width Feature                                          |
 * |                                                             |
 * +-------------------------------------------------------------+
 * | Stories                                                     |
 * | +---------------------------+-----------------------------+ |
 * | | Story                     | Story                       | |
 * | +---------------------------+-----------------------------+ |
 * +-------------------------------------------------------------+
 * | Footer                                                      |
 * +-------------------------------------------------------------+
 */

const inTheWild = [
  {
    name: "NORR11",
    url: "https://norr11.com/",
  },
  {
    name: "Aesop",
    url: "https://www.aesop.com/",
  },
  {
    name: "HAY",
    url: "https://www.hay.com/",
  },
];

const html = `<div class="container">
  <header class="navigation">Navigation</header>

  <section class="hero">Hero</section>

  <section class="editorial-feature">
    <div class="editorial-copy">Editorial Copy</div>
    <div class="editorial-visual">Editorial Visual</div>
  </section>

  <section class="feature-visual">Feature Visual</section>

  <section class="stories">
    <article class="story story-one">Story One</article>
    <article class="story story-two">Story Two</article>
  </section>

  <footer class="footer">Footer</footer>
</div>`;

const sharedRegionStyles = `
.navigation,
.hero,
.editorial-copy,
.editorial-visual,
.feature-visual,
.story,
.footer {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.navigation {
  background: #f5f0c8;
}

.hero {
  background: #cfe4f7;
}

.editorial-copy {
  background: #d8f1df;
}

.editorial-visual {
  background: #e4dcf7;
}

.feature-visual {
  background: #f7dfc8;
}

.story-one {
  background: #dcecf7;
}

.story-two {
  background: #f1dce5;
}

.footer {
  background: #dddaf5;
}
`;

export const presets: PresetSource[] = [
  {
    id: "editorial-showcase-flex",
    name: "Editorial Showcase - Flex",
    description:
      "Image-led commerce homepage with navigation, full-bleed hero, split editorial feature, promotional visual, stories, and footer using nested Flexbox containers.",
    type: "flex",
    inTheWild,
    html,

    css: `.container {
  box-sizing: border-box;

  /* The storefront is a vertical sequence of large editorial sections. */
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  padding: 16px;
  margin: 0 auto;
}

.navigation {
  flex: 0 0 72px;
}

.hero {
  /* The primary visual dominates the opening viewport. */
  flex: 0 0 520px;
}

.editorial-feature {
  display: flex;
  flex: 0 0 360px;
  min-width: 0;
  gap: 16px;
}

.editorial-copy {
  /* Copy occupies the smaller side of the editorial split. */
  flex: 2 1 0;
}

.editorial-visual {
  flex: 3 1 0;
}

.feature-visual {
  flex: 0 0 420px;
}

.stories {
  display: flex;
  flex: 0 0 280px;
  min-width: 0;
  gap: 16px;
}

.story {
  flex: 1 1 0;
}

.footer {
  flex: 0 0 180px;
}

${sharedRegionStyles}`,

    editor: {
      category: "Commerce",
    },
  },

  {
    id: "editorial-showcase-grid",
    name: "Editorial Showcase - Grid",
    description:
      "Image-led commerce homepage with navigation, full-bleed hero, split editorial feature, promotional visual, stories, and footer using CSS Grid.",
    type: "grid",
    inTheWild,
    html,

    css: `.container {
  box-sizing: border-box;

  /*
   * Large explicit rows reproduce the vertical rhythm of an
   * image-led editorial storefront.
   */
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows:
    72px
    520px
    360px
    420px
    280px
    180px;
  gap: 16px;
  width: 100%;
  padding: 16px;
  margin: 0 auto;
}

.editorial-feature {
  /*
   * The visual receives more horizontal space than the
   * accompanying editorial copy.
   */
  display: grid;
  grid-template-columns:
    minmax(0, 2fr)
    minmax(0, 3fr);
  min-width: 0;
  gap: 16px;
}

.stories {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  min-width: 0;
  gap: 16px;
}

${sharedRegionStyles}`,

    editor: {
      category: "Commerce",
    },
  },
];
