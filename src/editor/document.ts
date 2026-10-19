import type { EditorDocument, PresetSource } from './types'
import { firstElementId, parseHtmlSource } from './html'
import { parseCssSource } from './css'

export function createEditorDocument(preset: PresetSource): EditorDocument {
  const htmlAst = parseHtmlSource(preset.html)
  return {
    htmlAst,
    cssAst: parseCssSource(preset.css),
    selectedNodeId: preset.editor?.selectedNodeId ?? firstElementId(htmlAst),
    revision: 0,
  }
}
