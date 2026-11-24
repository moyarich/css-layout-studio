# Presets

Presets are source folders
Each layout has separate Flex and Grid folders:

```text
presets/<order>-<category>/<order>-<layout>/
  01-flex/
    index.html
    styles.css
    page.mdx
  02-grid/
    ...same files
```

- `page.mdx` frontmatter: ID, title, description, type, examples, and editor settings.
- `index.html` and `styles.css`: the editable sources selected by the page’s frontmatter.
- `page.mdx`: Documentation page with frontmatter and layout-specific guidance.

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
The Vite plugin in `vite-plugins/preset-registry/preset-registry.ts` discovers `page.mdx` files, reads their YAML frontmatter, and exposes
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

## Documentation

Each `page.mdx` chooses the rendered sections and their order. Frontmatter
supplies data such as the heading, preview height in pixels, and examples.

The standard preset pages use shared JSX components for the shell and named
directives for workspace content. A tab uses a stable ID and a visible label,
separated by a pipe. The title on `workspace-tabs` selects the default tab ID.

```mdx
<StudioShell>
<StudioBody>
<Workspace>
<PresetPageTitle />

::::: workspace-tabs example

:::: workspace-tab example | Example

::: preview-layout
:::

::::

:::::

</Workspace>
</StudioBody>
</StudioShell>
```

Place `outline`, `in-the-wild`, and `source-editor` directives wherever they
belong, or omit them. Text inside `in-the-wild` replaces the frontmatter
examples. Children of `preview-layout` appear in its toolbar, so a page can
add `<PresetSourceFiles targetTab="playground" />` where source buttons are
needed. Add `<PresetInspector />` alongside `<Workspace>` to show the
inspector. The pages can also use the individual JSX components directly.

Point the page at its HTML and CSS in frontmatter. These files provide the
initial canvas and the editable source tabs. Paths are filenames in the same
folder as the page.

```yaml
files:
  html: index.html
  css: styles.css
```

If either key is omitted, the registry uses that source group’s configured filename.

The registry exposes the configured HTML, CSS, and MDX files. Pages can export
a custom `sources` array to override that list.

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

## Layout Studio: explicit MDX composition

`App.tsx` mounts the shared editor state and supplies it to the active MDX page as
`props.studio`. Components receive their page data, options, and navigation
callbacks through props. The YAML frontmatter is exported as `frontmatter` by
`remark-mdx-frontmatter`, so the document can reference its own metadata.

```mdx
<StudioHeader
  title="Layout Studio"
  breadcrumbs={[frontmatter.editor?.category, frontmatter.title]}
  homeTab="overview"
  onNavigate={props.studio.setTab}
  actions={<StudioActions sources={sources} />}
/>

<LayoutLibrary
  groups={props.studio.groups}
  selectedId={props.studio.presetId}
  onSelect={props.studio.loadPreset}
  open={props.studio.libraryOpen}
/>

<WorkspaceTabs
  defaultValue="overview"
  value={props.studio.tab}
  onValueChange={props.studio.setTab}
  suffix={frontmatter.label}
>
  <WorkspacePanel id="overview" label="Overview">
    <InTheWild examples={frontmatter.inTheWild} />
    <SourceEditor sources={sources} mode="preview" targetTab="edit" />
  </WorkspacePanel>
  <WorkspacePanel id="edit" label="Edit files">
    <SourceEditor sources={sources.filter(file => file.language === 'css')} />
  </WorkspacePanel>
</WorkspaceTabs>
```

Tab IDs are independent of labels. `WorkspaceTabs` also supports local state by
omitting `value` and `onValueChange`; `defaultValue` chooses its initial panel.
Keyboard arrow keys, Home, and End navigate the authored panel order.

Header actions are an explicit slot. `StudioActions` accepts `library`, `theme`,
`copy`, and `download` flags, plus the source list to export. `InspectorSidebar`
accepts `title` and a `footer` slot; the about card is an optional `AboutLayout`
component with explicit `targetTab` and `onNavigate` props.

The component map is `src/mdx/mdx-components.ts`. Components and their styles live
together under `src/components/`. Shared document, selection, drafts, theme, and
editing actions live in `src/studio/` and `src/editor/useLayoutEditor.ts`.

## Page-owned source files

Each page imports its sources and exports their descriptors. Order, default
selection, and folder exports follow that list. Each SourceEditor receives the
list or subset to display explicitly:

```mdx
import markup from './index.html?raw';
import styles from './styles.css?raw';

export const sources = [
  { name: 'index.html', code: markup, language: 'html', edit: true },
  { name: 'styles.css', code: styles, language: 'css', edit: true, default: true },
];

<SourceEditor sources={sources} />
```

`edit` is boolean and defaults to false. HTML/CSS edits update the live preview;
other editable files keep session drafts for export. SourceEditor only uses the
files in its supplied list. `targetTab` or `onOpen` controls where the optional
preview's "Open source editor" action goes. There is no assumed Playground label.

## Preview options

```mdx
export const viewports = [
  { id: 'wide', label: 'Wide', width: 1024, icon: 'desktop' },
  { id: 'narrow', label: 'Narrow', width: 390, icon: 'phone' },
];

<LivePreview
  sources={sources}
  variants={props.studio.activeLayout.variants}
  selectedVariant={props.studio.presetId}
  onVariantChange={props.studio.loadPreset}
  viewports={viewports}
  defaultViewport="wide"
  height={480}
/>
```

Variant and viewport choices belong to the page; no list is read implicitly from
context. The live document, selection, and viewport state remain shared editor
mechanics. A preview can omit variant or viewport choices by passing empty lists.

## Source actions and examples

```mdx
<SourceFiles
  title="Source Files"
  sources={sources}
  onOpen={name => props.studio.showSource(name, 'edit')}
>

- [My HTML](./index.html)
- [CSS](./styles.css)

</SourceFiles>

<InTheWild title="In the wild" examples={frontmatter.inTheWild} />
```

The compiler scopes SourceLink rendering to the SourceFiles subtree, including
JSX scopes. Its explicit `sources` and `onOpen` props are passed to its child
links through a local compound-component scope, not the global studio context.
Outside the block, Markdown links remain ordinary anchors. Standalone SourceLink
components can receive `sources` and `onOpen` directly.

InTheWild never reads the active page implicitly. Pass frontmatter examples or
another array; authored children can override the list. An empty list renders
nothing.

## Preset frontmatter and discovery

There is no separate metadata JSON file. `page.mdx` frontmatter contains `id`,
`title`, `description`, `type`, `label`, `editor`, and optionally `inTheWild`.
`id` and `title` are required. IDs are unique; folder ordering determines
navigation order. Invalid YAML, duplicate keys, and invalid layout types produce
errors with page paths. `files.page` in registry.config.ts overrides the page
filename. `src/studio/navigation.ts` only groups library navigation.

## MoyaForge custom blocks

The MoyaForge UI components were installed using:

```sh
npx shadcn@latest add moyarich/moyaforge/custom-block moyarich/moyaforge/page moyarich/moyaforge/code-group moyarich/moyaforge/copy-button --yes
```

They live under `src/components/ui/` with their license. The CustomBlock prop type
locally omits native HTML `title` so ReactNode titles compile. The compiler
conventions in `vite-plugins/mdx-pages-plugin/` follow MoyaForge's neutral custom
blocks and directive mappings. `src/studio/theme.css` maps MoyaForge's tokens.

Arbitrary `::: experimental My idea` blocks use CustomBlock, with nested Markdown
and code fences. `code-group` / `code-tab` directives use MoyaForge code components.
Use JSX for studio components that need explicit object props or callbacks.

## Source syntax highlighting

Read-only source views and compact previews use Shiki with each file's declared
`language`. TypeScript files ending in `.tsx` use the TSX grammar. Unsupported
languages fall back to plain text, and token colors follow the app's light/dark
theme. Source text is preserved exactly; tokens render as escaped React content.
Editable source files continue using Monaco.

## Editing-first page structure

Overview contains the document outline, live preview, documentation and examples.
Playground opens by default with one live preview, HTML/CSS source links and one
source editor limited to editable files. Read-only files remain available for
exports. There is no separate Outline tab or repeated source snippet.

`LivePreview` accepts an optional `actions` React node. Playground passes its
HTML/CSS `SourceFiles` links through this slot in the preview toolbar; Overview
omits actions. Use `title={null}` on `SourceFiles` for compact toolbar links.

### Portable preview shell

`LivePreview` is presentation-only: it accepts `children`, `actions`, `controls`,
`title`, `hint`, `status`, `width`, and `height`, without a Studio context dependency.
`StudioLivePreview` connects that shell to the editable document and selection.
Pages supply `PreviewVariantControls` through its `controls` prop, with explicit
option labels from preset metadata. `PreviewViewportControls` is separately usable
with a controlled value and change callback. Toolbar groups wrap according to
the card width, with larger controls and a dedicated source-action row on small cards.

Enable `resizable` on `LivePreview` (or `StudioLivePreview`) for four corner
handles on `.live-viewport`. Each handle adjusts both `--viewport-width` and
`--viewport-height`. Arrow keys move the focused corner by 10px; Shift uses 50px.
The shell accepts `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, and
`onSizeChange({ width, height })`. Wider content scrolls inside the viewport.
Choosing a different viewport resets sizing to that preset.
