# AST Layout Editor

A React + TypeScript visual layout editor whose working document is **actual syntax trees**:

```text
PresetSource
├─ html: string
├─ css: string
└─ optional editor metadata
        ↓
EditorDocument
├─ htmlAst: HAST Root
├─ cssAst: CSS Tree StyleSheet
├─ selectedNodeId
└─ revision
```

There is no `MarkupNode`, `LayoutItem`, `LayoutConfig`, or `StyleRule` working model.

## Run

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Architecture

### HTML

- `hast-util-from-html` parses editable HTML source into a real HAST `Root`.
- Editor IDs live only in `Element.data.editorId`.
- `hast-util-to-html` serializes exported HTML; HAST `data` metadata is not emitted as attributes.
- Preview rendering clones the HAST and materializes the internal ID as temporary `data-editor-id` attributes **only in the preview clone**.
- The left markup tree directly renders the HAST.

### CSS

- `css-tree` parses source into a real `StyleSheet`.
- Inspector changes use CSS Tree AST nodes and mutate matching `Rule.block.children` declarations directly.
- Reset removes a declaration node from the CSS Tree `List`; it does not insert a default value.
- CSS is always regenerated from the current CSS AST with `css-tree.generate()`.
- The source panel reparses edited CSS back into the stylesheet AST.

### Computed styles

Browser-computed values are read from `getComputedStyle()` on the selected preview element and kept in a separate `ComputedSnapshot`. They are display/reference values only and are never copied into the preset CSS AST automatically.

### Preview isolation

The preview is rendered into an open `ShadowRoot`, keeping preset selectors and styles isolated from the editor chrome. The preview-only `data-editor-id` attribute connects DOM selection back to HAST metadata.

### Inspector targeting

The visual inspector edits top-level matching preset rules. This intentionally avoids accidentally selecting a matching rule nested in an inactive `@media` block. Nested/advanced rules remain directly editable through the CSS source panel.

## Key files

```text
src/
├─ editor/
│  ├─ types.ts       # PresetSource + EditorDocument + real AST types
│  ├─ html.ts        # HAST parse/serialize/IDs/preview clone
│  ├─ css.ts         # CSS Tree parse/walk/mutate/generate
│  └─ document.ts    # PresetSource -> EditorDocument
├─ components/
│  ├─ MarkupTree.tsx
│  ├─ Preview.tsx
│  ├─ Inspector.tsx
│  └─ SourcePanel.tsx
├─ presets.ts
├─ App.tsx
└─ styles.css
```
