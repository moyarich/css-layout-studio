import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +---------------------------------------------+
 * | Header                  [ Advertisement ]   |
 * +---------------------------------------------+
 * | Sticky article header                       |
 * +-------------------------------+-------------+
 * | Article                       | Sidebar     |
 * |                               |             |
 * +-------------------------------+-------------+
 * | Footer                                      |
 * +---------------------------------------------+
 */

const inTheWild = [
  { name: "The New York Times", url: "https://www.nytimes.com/" },
  { name: "The Verge", url: "https://www.theverge.com/" },
  { name: "Medium", url: "https://medium.com/" },
];

export const presets: PresetSource[] = [
  {
    id: "editorial-article-flex",
    name: "Editorial Article - Flex",
    description:
      "Editorial article layout using flexbox with a header ad, sticky article header, article content, sidebar, and footer.",
    type: "flex",
    inTheWild,

    html: `
      <div class="container">
        <header class="header">
          <div class="ad">Ad</div>
        </header>

        <div class="article-header">
          Article Header
        </div>

        <main class="main">
          <article class="article">
            Article
          </article>

          <aside class="sidebar">
            Sidebar
          </aside>
        </main>

        <footer class="footer">
          Footer
        </footer>
      </div>
    `,

    css: `
      .container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .header {
        min-height: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f0c8;
      }

      .ad {
        width: 60%;
        min-height: 90px;
        background: #f7dfc8;
      }

      .article-header {
        position: sticky;
        top: 0;
        z-index: 10;
        min-height: 64px;
        background: #e4dcf7;
      }

      .main {
        display: flex;
        gap: 32px;
        width: 100%;
        margin: 0 auto;
        padding: 32px 24px;
        flex-grow: 1;
      }

      .article {
        flex: 1 1 auto;
        min-width: 0;
        background: #cfe4f7;
      }

      .sidebar {
        flex: 0 0 320px;
        min-width: 0;
        background: #c8f2e4;
      }

      .footer {
        min-height: 180px;
        background: #f1dce5;
      }

      .header,
      .ad,
      .article-header,
      .article,
      .sidebar,
      .footer {
        min-width: 0;
        border: 1px solid #a8afb9;
        border-radius: 8px;
        padding: 16px;
      }
    `,

    editor: {
      category: "Content",
    },
  },

  {
    id: "editorial-article-grid",
    name: "Editorial Article - Grid",
    description:
      "Editorial article layout using CSS Grid with a header ad, sticky article header, article content, sidebar, and footer.",
    type: "grid",
    inTheWild,

    html: `
      <div class="container">
        <header class="header">
          <div class="ad">Ad</div>
        </header>

        <div class="article-header">
          Article Header
        </div>

        <main class="main">
          <article class="article">
            Article
          </article>

          <aside class="sidebar">
            Sidebar
          </aside>
        </main>

        <footer class="footer">
          Footer
        </footer>
      </div>
    `,

    css: `
      .container {
        height: 100%;
        display: grid;
        grid-template-rows: minmax(180px, auto) minmax(64px, auto) minmax(0, 1fr) minmax(180px, auto);
      }

      .header {
        min-height: 180px;
        display: grid;
        place-items: center;
        background: #f5f0c8;
      }

      .ad {
        width: 60%;
        min-height: 90px;
        background: #f7dfc8;
      }

      .article-header {
        position: sticky;
        top: 0;
        z-index: 10;
        min-height: 64px;
        background: #e4dcf7;
      }

      .main {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 320px;
        gap: 32px;
        width: 100%;
        margin: 0 auto;
        padding: 32px 24px;
      }

      .article {
        min-width: 0;
        background: #cfe4f7;
      }

      .sidebar {
        min-width: 0;
        background: #c8f2e4;
      }

      .footer {
        min-height: 180px;
        background: #f1dce5;
      }

      .header,
      .ad,
      .article-header,
      .article,
      .sidebar,
      .footer {
        min-width: 0;
        border: 1px solid #a8afb9;
        border-radius: 8px;
        padding: 16px;
      }
    `,

    editor: {
      category: "Content",
    },
  },
];
