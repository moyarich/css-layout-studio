import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +----------------+--------+--------+--------+--------+
 * | Brand          | Product| Company|Resource| Legal  |
 * |                | links  | links  | links  | links  |
 * +----------------+--------+--------+--------+--------+
 */

const inTheWild = [
  { name: "GitHub", url: "https://github.com/" },
  { name: "Adobe", url: "https://www.adobe.com/" },
  { name: "Shopify", url: "https://www.shopify.com/" },
];

export const presets = [
  {
    id: "footer-flex",
    name: "Mega Footer - Flex",
    description: "Wide brand region plus four link columns using Flexbox.",
    type: "flex",
    inTheWild,
    html: `<footer class="container">
  <section class="brand">Brand</section>
  <section class="product-links">Product</section>
  <section class="company-links">Company</section>
  <section class="resource-links">Resources</section>
  <section class="legal-links">Legal</section>
</footer>`,
    css: `.container {
  box-sizing: border-box;

  /* Flex weights make the brand column twice as wide as each link column. */
  display: flex;
  align-items: end;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.brand,
.product-links,
.company-links,
.resource-links,
.legal-links {
  box-sizing: border-box;
  min-width: 0;
  height: 272px;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.brand {
  flex: 2 1 0;
  background: #cfe4f7;
}

.product-links,
.company-links,
.resource-links,
.legal-links {
  flex: 1 1 0;
}

.product-links { background: #d8f1df; }
.company-links { background: #f5f0c8; }
.resource-links { background: #e4dcf7; }
.legal-links { background: #f1dce5; }`,
    editor: { category: "Marketing" },
  },
  {
    id: "footer-grid",
    name: "Mega Footer - Grid",
    description: "Wide brand region plus four link columns using CSS Grid.",
    type: "grid",
    inTheWild,
    html: `<footer class="container">
  <section class="brand">Brand</section>
  <section class="product-links">Product</section>
  <section class="company-links">Company</section>
  <section class="resource-links">Resources</section>
  <section class="legal-links">Legal</section>
</footer>`,
    css: `.container {
  box-sizing: border-box;

  /* Grid tracks mirror the 2/1/1/1/1 proportions. */
  display: grid;
  grid-template-columns: 2fr repeat(4, minmax(0, 1fr));
  align-items: end;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.brand,
.product-links,
.company-links,
.resource-links,
.legal-links {
  box-sizing: border-box;
  min-width: 0;
  height: 272px;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.brand { background: #cfe4f7; }
.product-links { background: #d8f1df; }
.company-links { background: #f5f0c8; }
.resource-links { background: #e4dcf7; }
.legal-links { background: #f1dce5; }`,
    editor: { category: "Marketing" },
  },
] satisfies PresetSource[];
