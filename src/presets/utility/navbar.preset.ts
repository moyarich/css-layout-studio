import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +------------+--------------------------+------------+
 * | Logo       | Navigation               | Actions    |
 * +------------+--------------------------+------------+
 */

const inTheWild = [
  { name: "GitHub navigation", url: "https://github.com/" },
  { name: "Stripe navigation", url: "https://stripe.com/" },
  { name: "Shopify navigation", url: "https://www.shopify.com/" },
];

export const presets = [
  {
    id: "navbar-flex",
    name: "Navbar - Flex",
    description: "Logo, navigation, and actions using a single Flexbox row.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <section class="logo">Logo</section>
  <nav class="navigation">Navigation</nav>
  <section class="actions">Actions</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Flex weights keep the navigation region dominant. */
  display: flex;
  align-items: center;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.logo,
.navigation,
.actions {
  box-sizing: border-box;
  height: 64px;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.logo {
  flex: 2 1 0;
  background: #f5f0c8;
}

.navigation {
  flex: 6 1 0;
  background: #cfe4f7;
}

.actions {
  flex: 3 1 0;
  background: #f1dce5;
}`,
    editor: { category: "Utility" },
  },
  {
    id: "navbar-grid",
    name: "Navbar - Grid",
    description: "Logo, navigation, and actions using CSS Grid columns.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <section class="logo">Logo</section>
  <nav class="navigation">Navigation</nav>
  <section class="actions">Actions</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Grid tracks mirror the 2/6/3 proportions. */
  display: grid;
  grid-template-columns: 2fr 6fr 3fr;
  align-items: center;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.logo,
.navigation,
.actions {
  box-sizing: border-box;
  height: 64px;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.logo { background: #f5f0c8; }
.navigation { background: #cfe4f7; }
.actions { background: #f1dce5; }`,
    editor: { category: "Utility" },
  },
] satisfies PresetSource[];
