# Presets

Presets are source folders
Each layout has separate Flex and Grid folders:

```text
presets/<order>-<category>/<order>-<layout>/
  01-flex/
    preset.json
    index.html
    styles.css
    layout.tsx
    preview.tsx
    page.mdx
  02-grid/
    ...same files
```

- `preset.json`: ID, name, description, type, examples, and editor settings.
- `index.html` and `styles.css`: authoritative editable sources loaded by the editor.
- `layout.tsx`: standalone React markup. Import `styles.css` when using it in an app.
- `preview.tsx`: isolated iframe preview of the HTML/CSS for documentation.
- `page.mdx`: Documentation page with frontmatter, preview, and source links.

The two TSX files serve the reusable layout and its documentation preview.
Changes to HTML should also be reflected in `layout.tsx`; previews always use the HTML/CSS.

## Adding a preset

1. Create a numbered layout folder inside its numbered category, then add
   `01-flex/` and `02-grid/` variant folders.
2. Add the files shown above; no registry edits or `presets = []` exports are needed.
3. Give each variant a unique ID (`example-flex`, `example-grid`), a name
   (`Example - Flex`, `Example - Grid`), and its `type` (`flex`, `grid`).
4. Set `editor.category` and provide `inTheWild` examples with a `name` and optional `url`.
5. Document the shared visual structure in `page.mdx`.
6. Use `.container` as the root with `width: 100%; height: 100%;`.

`registry.config.ts` defines the source directories and optional source filenames.
The Vite plugin in `vite-plugins/preset-registry.ts` scans those folders and exposes
`virtual:preset-registry`. `index.ts` only re-exports the generated registry.

Sorting follows the folder hierarchy: numeric prefixes first, then natural
alphabetical order at each level. Use prefixes at every level: category, layout, and variant. For example,
`02-content/01-article-aside/01-flex` comes before
`02-content/02-before-after/01-flex`. Within each layout, `01-flex` precedes `02-grid`.
Rename a folder prefix to change its position; IDs and display names stay unchanged.
Source groups follow their declaration order in `registry.config.ts`.
New categories need no code changes. Category labels default to the first folder
name without its numeric prefix; `editor.category` can override the label.
Missing source files, invalid metadata, duplicate IDs, and empty registries fail
with an error. Development reloads when source files or folders change.

```ts
import { PRESETS } from "./presets";
```

##Documentation

Point a registry source at this directory and discover `**/page.mdx`.
Pages use the CLI scaffold's YAML frontmatter and relative component imports.
Layout Studio compiles MDX through Vite and renders these pages directly; no separate documentation app is required.

---

## Flex and Grid parity

A preset pair should describe the same visual layout.

For example:

```text
Editorial Article
│
├── Header
│   └── Ad
│
├── Sticky Article Header
│
├── Main
│   ├── Article
│   └── Sidebar
│
└── Footer
```

The Flex version should express that structure using Flexbox.

The Grid version should express the same structure using CSS Grid.

Do not change the semantic layout merely to make one implementation easier.

Nested containers are acceptable when the layout naturally requires them.

---

## HTML

Keep preset HTML focused on **layout structure**, not production content.

Prefer semantic elements when they describe the region clearly:

```html
<div class="container">
  <header class="header">Header</header>

  <main class="main">
    <article class="article">Article</article>
    <aside class="sidebar">Sidebar</aside>
  </main>

  <footer class="footer">Footer</footer>
</div>
```

Use short labels that make each region easy to identify in the editor.

Avoid filling presets with realistic application content unless that content is necessary to demonstrate the layout.

---

## CSS

### Root container

The root should normally include:

```css
.container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
```

Then apply the appropriate layout system:

```css
display: flex;
```

or:

```css
display: grid;
```

---

## Flexible children

Flexible Flexbox and Grid children should generally be allowed to shrink.

For Flexbox:

```css
.content {
  flex: 1 1 0;
  min-width: 0;
}
```

For Grid:

```css
.container {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
}
```

Prefer:

```css
minmax(0, 1fr)
```

over:

```css
1fr
```

for flexible content tracks when their contents may otherwise impose an intrinsic minimum width.

This is particularly useful for layouts containing:

- articles
- code
- tables
- images
- long text
- nested layout containers

Also add `min-width: 0` to Grid or Flex children that need to shrink with their track.

```css
.article {
  min-width: 0;
}
```

Use `min-height: 0` for the equivalent vertical shrinking case when necessary.

---

## Sizing

Prefer layout-relative sizing when the relationship between regions is important.

Flex example:

```css
.main {
  display: flex;
  gap: 32px;
}

.article {
  flex: 1 1 auto;
}

.sidebar {
  flex: 0 0 320px;
}
```

Grid equivalent:

```css
.main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 32px;
}
```

Use fixed dimensions when the fixed size is an intentional part of the preset.

---

## Layout-specific CSS

The Flex and Grid implementations do not need identical CSS.

They should use idiomatic features of their respective layout systems.

### Flexbox

Prefer properties such as:

```css
display: flex;
flex-direction: column;
flex-wrap: wrap;
flex-grow: 1;
flex: 1 1 0;
align-items: center;
justify-content: center;
```

### Grid

Prefer properties such as:

```css
display: grid;
grid-template-columns: repeat(3, minmax(0, 1fr));
grid-template-rows: auto 1fr auto;
grid-column: 1 / -1;
place-items: center;
```

Avoid reproducing Flexbox behavior in Grid with unnecessary wrappers when Grid can express the relationship directly.

Likewise, nested Flexbox groups are acceptable when Flexbox needs additional structure to represent a two-dimensional layout.

---

## Comments

Add comments when they explain an important layout decision.

Good:

```css
/* Three cards exactly fill the row after two 20px gaps. */
```

```css
/* Grid tracks mirror the 2/6/3 proportions. */
```

Avoid comments that merely repeat the property:

```css
/* Use flex. */
display: flex;
```

---

## Editor metadata

Presets can provide editor-specific metadata:

```ts
editor: {
  category: "Content",
  selectedNodeId,
  canvas: {
    width: 1440,
    minHeight: 900,
  },
}
```

Only provide canvas overrides when the preset genuinely needs a specific preview size.

---

## Categories

Use one of the existing categories:

```text
App
Content
Marketing
Commerce
Gallery
Utility
```

Choose the category based on what the layout represents rather than the CSS technique used to implement it.

For example:

```ts
editor: {
  category: "Content",
}
```

is appropriate for:

```text
Editorial Article
Responsive Card Grid
Holy Grail
Media Object
```

---

## Visual styling

Presets are layout demonstrations, so styling should remain simple and consistent.

Regions normally use:

```css
box-sizing: border-box;
min-width: 0;
border: 1px solid #a8afb9;
border-radius: 8px;
padding: 16px;
```

Colors identify regions and make the layout visually readable. They do not establish permanent semantic meanings.

The Flex and Grid variants of a preset should use the same colors for corresponding regions.

---

## Color palette

| Swatch                                                                                                        | Hex       | Suggested use                            | Example CSS classes                                     |
| ------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------- | ------------------------------------------------------- |
| <span style="display:inline-block;width:3rem;height:1rem;background:#cfe4f7;border:1px solid #a8afb9"></span> | `#cfe4f7` | Primary content, brand, or first item    | `.primary`, `.brand`, `.item-primary`                   |
| <span style="display:inline-block;width:3rem;height:1rem;background:#dcecf7;border:1px solid #a8afb9"></span> | `#dcecf7` | Secondary blue region                    | `.secondary`, `.region-secondary`, `.item-secondary`    |
| <span style="display:inline-block;width:3rem;height:1rem;background:#d8f1df;border:1px solid #a8afb9"></span> | `#d8f1df` | Supporting content or secondary item     | `.supporting`, `.content-secondary`, `.item-supporting` |
| <span style="display:inline-block;width:3rem;height:1rem;background:#c8f2e4;border:1px solid #a8afb9"></span> | `#c8f2e4` | Sidebar, aside, or navigation region     | `.sidebar`, `.aside`, `.navigation`                     |
| <span style="display:inline-block;width:3rem;height:1rem;background:#f5f0c8;border:1px solid #a8afb9"></span> | `#f5f0c8` | Header, highlighted item, or summary     | `.header`, `.highlight`, `.summary`                     |
| <span style="display:inline-block;width:3rem;height:1rem;background:#f7dfc8;border:1px solid #a8afb9"></span> | `#f7dfc8` | Advertisement or call to action          | `.ad`, `.advertisement`, `.cta`                         |
| <span style="display:inline-block;width:3rem;height:1rem;background:#e4dcf7;border:1px solid #a8afb9"></span> | `#e4dcf7` | Navigation, title bar, or alternate item | `.nav`, `.title-bar`, `.item-alternate`                 |
| <span style="display:inline-block;width:3rem;height:1rem;background:#dddaf5;border:1px solid #a8afb9"></span> | `#dddaf5` | Secondary sidebar or metric              | `.sidebar-secondary`, `.metric`, `.stat`                |
| <span style="display:inline-block;width:3rem;height:1rem;background:#e7def3;border:1px solid #a8afb9"></span> | `#e7def3` | Light violet alternate                   | `.alternate-light`, `.violet-light`, `.item-muted`      |
| <span style="display:inline-block;width:3rem;height:1rem;background:#f1dce5;border:1px solid #a8afb9"></span> | `#f1dce5` | Footer, related content, or final item   | `.footer`, `.related`, `.item-final`                    |
| <span style="display:inline-block;width:3rem;height:1rem;background:#f2d6e8;border:1px solid #a8afb9"></span> | `#f2d6e8` | Chart or emphasized content              | `.chart`, `.emphasis`, `.featured`                      |
| <span style="display:inline-block;width:3rem;height:1rem;background:#a8afb9;border:1px solid #a8afb9"></span> | `#a8afb9` | Standard border color                    | `.border`, `.outline`, `.divider`                       |

Example:

```css
.primary {
  background: #cfe4f7;
}

.sidebar {
  background: #c8f2e4;
}

.footer {
  background: #f1dce5;
}

.border {
  border-color: #a8afb9;
}
```

Class names are examples only. Choose names that describe the region's role in the specific preset, and do not treat the palette colors as permanent semantic tokens.

Use contrasting fills for adjacent layout regions.

---

## Layout Studio

The app compiles each `page.mdx` as a React component. The Overview displays its
authored documentation and embeds the same selectable preview used by the
Playground. Documentation source links open the corresponding Source tab.
The local `preview.tsx` reads `DocumentationPreviewContext` when displayed in the
editor, and retains its isolated HTML/CSS preview when used independently.

Export folder downloads a ZIP with all six preset files, including the current
HTML/CSS edits. Its preview is standalone and does not import editor context.
TSX and MDX tabs show reference sources; HTML and CSS support live editing.
