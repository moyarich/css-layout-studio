import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +-------------------------------------------------------------+
 * | Header / Navigation                                         |
 * +-------------------------------------------------------------+
 * |                                                             |
 * | Detail Hero                                                 |
 * |                                                             |
 * +-----------------------------------------+-------------------+
 * |                                         |                   |
 * | Primary Content                         | Supporting Rail   |
 * |                                         |                   |
 * |                                         |                   |
 * +-----------------------------------------+-------------------+
 * |                                                             |
 * | Related / Discovery                                         |
 * |                                                             |
 * +-------------------------------------------------------------+
 * | Footer                                                      |
 * +-------------------------------------------------------------+
 */

const inTheWild = [
  {
    name: "I Got Next Magazine Discovery",
    url: "https://igotnextmagazine.com/discovery/581bcb5a-600c-40a2-b25a-d61f4b35f3f8",
  },
];

const html = `<div class="container">
  <header class="header">Header / Navigation</header>

  <section class="hero">Detail Hero</section>

  <main class="main">
    <article class="content">Primary Content</article>
    <aside class="sidebar">Supporting Rail</aside>
  </main>

  <section class="related">Related / Discovery</section>

  <footer class="footer">Footer</footer>
</div>`;

const sharedRegionStyles = `
.header,
.hero,
.content,
.sidebar,
.related,
.footer {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.header {
  background: #f5f0c8;
}

.hero {
  background: #cfe4f7;
}

.content {
  background: #d8f1df;
}

.sidebar {
  background: #c8f2e4;
}

.related {
  background: #f1dce5;
}

.footer {
  background: #e4dcf7;
}
`;

export const presets: PresetSource[] = [
  {
    id: "editorial-detail-flex",
    name: "Editorial Detail - Flex",
    description:
      "Editorial detail page shell with header, hero, primary content and supporting rail, related content, and footer using nested Flexbox containers.",
    type: "flex",
    inTheWild,
    html,

    css: `.container {
  box-sizing: border-box;

  /* The page shell stacks the major editorial regions vertically. */
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  height: 100%;
  padding: 16px;
  margin: 0 auto;
}

.header {
  flex: 0 0 72px;
}

.hero {
  flex: 0 0 320px;
}

.main {
  /*
   * The primary editorial region expands while the
   * supporting rail remains intentionally narrower.
   */
  display: flex;
  flex: 1 1 0%;
  min-width: 0;
  gap: 16px;
}

.content {
  flex: 1 1 0;
  min-width: 0;
}

.sidebar {
  flex: 0 0 280px;
}

.related {
  flex: 0 0 220px;
}

.footer {
  flex: 0 0 160px;
}

${sharedRegionStyles}`,

    editor: {
      category: "Content",
      canvas: {
        minHeight: 1100,
      },
    },
  },

  {
    id: "editorial-detail-grid",
    name: "Editorial Detail - Grid",
    description:
      "Editorial detail page shell with header, hero, primary content and supporting rail, related content, and footer using CSS Grid.",
    type: "grid",
    inTheWild,
    html,

    css: `.container {
  box-sizing: border-box;

  /*
   * Explicit page rows establish the shell while the main
   * editorial region receives the remaining vertical space.
   */
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows:
    72px
    320px
    minmax(0%, 1fr)
    220px
    160px;
  gap: 16px;

  width: 100%;
  height: 100%;
  padding: 16px;
  margin: 0 auto;
}

.main {
  /*
   * The content track stays flexible while the supporting
   * rail keeps a predictable reading width.
   */
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    280px;
  min-width: 0;
  min-height: 0;
  gap: 16px;
}

${sharedRegionStyles}`,

    editor: {
      category: "Content",
      canvas: {
        minHeight: 1100,
      },
    },
  },
];
