import { fromHtml } from 'hast-util-from-html'
import { toHtml } from 'hast-util-to-html'
import type { Element, ElementContent, Root, RootContent } from 'hast'
import type { EditorElement, EditorNodeId } from './types'

let idSequence = 0

function createEditorId(): EditorNodeId {
  idSequence += 1
  return `node_${idSequence.toString(36)}`
}

export function isElement(node: RootContent): node is Element {
  return node.type === 'element'
}

export function getEditorId(node: Element): EditorNodeId | undefined {
  return (node as EditorElement).data?.editorId
}

export function ensureEditorIds(root: Root): Root {
  const visit = (node: RootContent) => {
    if (node.type !== 'element') return

    const editorNode = node as EditorElement
    editorNode.data ??= {}
    editorNode.data.editorId ??= createEditorId()

    for (const child of node.children) {
      if (child.type === 'element') visit(child)
    }
  }

  for (const child of root.children) {
    if (child.type === 'element') visit(child)
  }

  return root
}

export function parseHtmlSource(source: string): Root {
  return ensureEditorIds(fromHtml(source, { fragment: true }))
}

export function serializeHtml(root: Root): string {
  // HAST `data` is metadata, not an HTML attribute, so editor IDs never serialize.
  return toHtml(root, {
    allowDangerousHtml: false,
    quote: '"',
  })
}

function cloneContentForPreview(node: RootContent): RootContent {
  if (node.type === 'element') {
    const id = getEditorId(node)
    return {
      ...node,
      properties: {
        ...node.properties,
        ...(id ? { 'data-editor-id': id } : {}),
      },
      data: node.data ? { ...node.data } : undefined,
      children: node.children.map((child) => cloneContentForPreview(child as RootContent) as ElementContent),
    }
  }

  return { ...node } as RootContent
}

export function serializePreviewHtml(root: Root): string {
  const previewRoot: Root = {
    ...root,
    children: root.children.map((child) => cloneContentForPreview(child)),
  }

  return toHtml(previewRoot, {
    allowDangerousHtml: false,
    quote: '"',
  })
}

export function findElementByEditorId(root: Root, id: EditorNodeId | null): Element | null {
  if (!id) return null

  const search = (nodes: RootContent[]): Element | null => {
    for (const node of nodes) {
      if (node.type !== 'element') continue
      if (getEditorId(node) === id) return node
      const nested = search(node.children as RootContent[])
      if (nested) return nested
    }
    return null
  }

  return search(root.children)
}

export function firstElementId(root: Root): EditorNodeId | null {
  for (const child of root.children) {
    if (child.type === 'element') return getEditorId(child) ?? null
  }
  return null
}

export function getElementLabel(element: Element): string {
  const id = typeof element.properties.id === 'string' ? `#${element.properties.id}` : ''
  const classNames = Array.isArray(element.properties.className)
    ? element.properties.className.map(String)
    : []
  const classes = classNames.slice(0, 2).map((name: string) => `.${name}`).join('')
  return `${element.tagName}${id}${classes}`
}

function escapeIdentifier(value: string): string {
  if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(value)
  return value.replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
}

export function preferredSelector(element: Element): string {
  const id = element.properties.id
  if (typeof id === 'string' && id) return `#${escapeIdentifier(id)}`

  const classNames = Array.isArray(element.properties.className)
    ? element.properties.className.map(String)
    : []

  if (classNames.length) return `.${escapeIdentifier(classNames[0])}`
  return element.tagName
}
