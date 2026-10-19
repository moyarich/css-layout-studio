import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +----------------------+----------------------+
 * | First name           | Last name            |
 * +----------------------+----------------------+
 * | Email                | Company              |
 * +---------------------------------------------+
 * | Full-width field                            |
 * +---------------------------------------------+
 * | Message                                     |
 * +---------------------------------------------+
 */

const inTheWild = [
  { name: "Shopify Checkout", url: "https://www.shopify.com/checkout" },
  { name: "GitHub signup", url: "https://github.com/signup" },
  { name: "Salesforce lead forms", url: "https://www.salesforce.com/" },
];

export const presets = [
  {
    id: "form-flex",
    name: "Two-Column Form - Flex",
    description: "Paired fields with full-width rows using wrapping Flexbox.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <section class="field first-name">First Name</section>
  <section class="field last-name">Last Name</section>
  <section class="field email">Email</section>
  <section class="field company">Company</section>
  <section class="field role">Role</section>
  <section class="field message">Message</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Wrapping plus calculated half-widths creates two-column field rows. */
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.field {
  box-sizing: border-box;
  height: 90px;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.first-name,
.last-name,
.company,
.role {
  flex: 0 0 calc((100% - 20px) / 2);
}

.email,
.message {
  flex: 0 0 100%;
}

.message {
  height: 160px;
}

.first-name { background: #cfe4f7; }
.last-name { background: #dcecf7; }
.email { background: #d8f1df; }
.company { background: #f5f0c8; }
.role { background: #e4dcf7; }
.message { background: #f1dce5; }`,
    editor: { category: "Utility" },
  },
  {
    id: "form-grid",
    name: "Two-Column Form - Grid",
    description: "Paired fields with full-width rows using CSS Grid.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <section class="field first-name">First Name</section>
  <section class="field last-name">Last Name</section>
  <section class="field email">Email</section>
  <section class="field company">Company</section>
  <section class="field role">Role</section>
  <section class="field message">Message</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Two Grid columns make spanning full-width fields explicit. */
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: 90px 90px 90px 160px;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.field {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.email,
.message {
  grid-column: 1 / -1;
}

.first-name { background: #cfe4f7; }
.last-name { background: #dcecf7; }
.email { background: #d8f1df; }
.company { background: #f5f0c8; }
.role { background: #e4dcf7; }
.message { background: #f1dce5; }`,
    editor: { category: "Utility" },
  },
] satisfies PresetSource[];
