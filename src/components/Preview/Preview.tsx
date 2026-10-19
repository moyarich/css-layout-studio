import { useEffect, useRef } from "react";

import previewCss from "./preview.css?raw";
import {
  EditorNodeId,
  EditorTheme,
  ElementLayoutInfo,
  LayoutKind,
  LayoutRole,
} from "../../types";

export type SelectedPreviewElement = {
  id: EditorNodeId;
  element: HTMLElement;
  layout: ElementLayoutInfo;
};

type Props = {
  html: string;
  css: string;
  selectedId: EditorNodeId | null;
  theme: EditorTheme;

  onSelect: (id: EditorNodeId) => void;

  onSelectedElement: (selection: SelectedPreviewElement | null) => void;
};

const LAYOUT_DISPLAYS = new Set(["flex", "inline-flex", "grid", "inline-grid"]);

function getComputedStyleForElement(
  element: HTMLElement | null,
): CSSStyleDeclaration | null {
  if (!element) return null;

  const ownerWindow = element.ownerDocument.defaultView;

  if (!ownerWindow) return null;

  return ownerWindow.getComputedStyle(element);
}

function getLayoutKind(element: HTMLElement | null): LayoutKind {
  const style = getComputedStyleForElement(element);

  if (!style) return null;

  const display = style.display;

  if (!LAYOUT_DISPLAYS.has(display)) {
    return null;
  }

  return display as Exclude<LayoutKind, null>;
}

/**
 * display: contents does not create its own box.
 *
 * For layout purposes, move upward until an actual
 * layout box is found.
 */
function getLayoutParent(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement;

  while (parent) {
    const style = getComputedStyleForElement(parent);

    if (!style) {
      return parent;
    }

    if (style.display !== "contents") {
      return parent;
    }

    parent = parent.parentElement;
  }

  return null;
}

function getElementLayoutInfo(element: HTMLElement): ElementLayoutInfo {
  const layoutParent = getLayoutParent(element);

  const elementStyle = getComputedStyleForElement(element);

  const containerKind = getLayoutKind(element);

  const parentContainerKind = getLayoutKind(layoutParent);

  const createsLayoutBox =
    elementStyle !== null &&
    elementStyle.display !== "none" &&
    elementStyle.display !== "contents";

  const participatesInParentLayout =
    createsLayoutBox &&
    elementStyle.position !== "absolute" &&
    elementStyle.position !== "fixed";

  const isContainer = createsLayoutBox && containerKind !== null;

  const isItem = participatesInParentLayout && parentContainerKind !== null;

  let role: LayoutRole = "none";

  if (isContainer && isItem) {
    role = "both";
  } else if (isContainer) {
    role = "container";
  } else if (isItem) {
    role = "item";
  }

  return {
    role,

    isContainer,
    isItem,

    containerKind,
    parentContainerKind,

    showLayoutUi: isContainer || isItem,

    showContainerUi: isContainer,

    showItemUi: isItem,
  };
}

function isDisplayContents(element: HTMLElement) {
  return getComputedStyleForElement(element)?.display === "contents";
}

function getLayoutItems(container: HTMLElement): HTMLElement[] {
  const items: HTMLElement[] = [];

  const visit = (parent: HTMLElement) => {
    Array.from(parent.children).forEach((child) => {
      if (!(child instanceof HTMLElement)) return;

      if (isDisplayContents(child)) {
        visit(child);
        return;
      }

      const style = getComputedStyleForElement(child);
      const participatesInLayout =
        style !== null &&
        style.display !== "none" &&
        style.position !== "absolute" &&
        style.position !== "fixed";

      if (participatesInLayout && child.hasAttribute("data-editor-id")) {
        items.push(child);
      }
    });
  };

  visit(container);
  return items;
}

function clearPreviewState(shadow: ShadowRoot) {
  shadow
    .querySelectorAll<HTMLElement>("[data-editor-id]")
    .forEach((element) => {
      element.classList.remove(
        "preview-selected",
        "preview-layout-container",
        "preview-layout-item",
        "preview-layout-both",
        "preview-layout-parent",
        "preview-related-item",
      );
    });
}

function initializeLayoutMetadata(shadow: ShadowRoot) {
  shadow
    .querySelectorAll<HTMLElement>("[data-editor-id]")
    .forEach((element) => {
      const layout = getElementLayoutInfo(element);
      element.dataset.layoutRole = layout.role;

      if (layout.containerKind)
        element.dataset.layoutContainer = layout.containerKind;
      else delete element.dataset.layoutContainer;

      if (layout.parentContainerKind)
        element.dataset.layoutItem = layout.parentContainerKind;
      else delete element.dataset.layoutItem;

    });
}

function applyRelatedLayoutState(
  element: HTMLElement,
  layout: ElementLayoutInfo,
) {
  if (layout.isContainer) {
    getLayoutItems(element).forEach((item) => {
      item.classList.add("preview-related-item");
      item.dataset.layoutItem = layout.containerKind ?? undefined;
    });
  }

  if (layout.isItem) {
    const parent = getLayoutParent(element);
    if (!parent) return;

    parent.classList.add("preview-layout-parent");
    parent.dataset.layoutContainer = layout.parentContainerKind ?? undefined;
    getLayoutItems(parent).forEach((item) => {
      if (item !== element) item.classList.add("preview-related-item");
    });
  }
}

function applyLayoutPreviewState(
  element: HTMLElement,
  layout: ElementLayoutInfo,
) {
  element.classList.add("preview-selected");

  element.dataset.layoutRole = layout.role;

  if (layout.containerKind) {
    element.dataset.layoutContainer = layout.containerKind;
  }

  if (layout.parentContainerKind) {
    element.dataset.layoutItem = layout.parentContainerKind;
  }

  switch (layout.role) {
    case "container":
      element.classList.add("preview-layout-container");
      break;

    case "item":
      element.classList.add("preview-layout-item");
      break;

    case "both":
      element.classList.add("preview-layout-both");
      break;
  }
}

function findEditorElementFromEvent(event: Event): HTMLElement | null {
  const path = event.composedPath();

  return (
    path.find(
      (item): item is HTMLElement =>
        item instanceof HTMLElement && item.hasAttribute("data-editor-id"),
    ) ?? null
  );
}

export function Preview({
  html,
  css,
  selectedId,
  theme,
  onSelect,
  onSelectedElement,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const renderedHtmlRef = useRef<string | null>(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) return;
    host.dataset.theme = theme;

    const shadow =
      host.shadowRoot ??
      host.attachShadow({
        mode: "open",
      });

    let styleElement =
      shadow.querySelector<HTMLStyleElement>("#preview-styles");
    let previewRoot = shadow.querySelector<HTMLDivElement>("#preview-root");

    if (!styleElement || !previewRoot) {
      shadow.innerHTML = `
        <style id="preview-styles"></style>
        <div id="preview-root"></div>
      `;
      styleElement = shadow.querySelector<HTMLStyleElement>("#preview-styles");
      previewRoot = shadow.querySelector<HTMLDivElement>("#preview-root");
    }

    if (!styleElement || !previewRoot) return;

    // CSS edits should not recreate the preview document. Keeping these nodes
    // mounted preserves the selected HTMLElement and prevents the inspector's
    // RJSF tree from remounting (and dropping input focus) on every commit.
    styleElement.textContent = `${previewCss}\n${css}`;
    previewRoot.dataset.theme = theme;
    if (renderedHtmlRef.current !== html) {
      previewRoot.innerHTML = html;
      renderedHtmlRef.current = html;
    }

    clearPreviewState(shadow);
    initializeLayoutMetadata(shadow);

    const selected = selectedId
      ? shadow.querySelector<HTMLElement>(
          `[data-editor-id="${CSS.escape(selectedId)}"]`,
        )
      : null;

    if (selected && selectedId) {
      const layout = getElementLayoutInfo(selected);

      applyLayoutPreviewState(selected, layout);
      applyRelatedLayoutState(selected, layout);

      onSelectedElement({
        id: selectedId,
        element: selected,
        layout,
      });
    } else {
      onSelectedElement(null);
    }

    const clickHandler = (event: Event) => {
      const target = findEditorElementFromEvent(event);

      if (!target) return;

      const id = target.getAttribute("data-editor-id") as EditorNodeId | null;

      if (!id) return;

      event.preventDefault();
      event.stopPropagation();

      onSelect(id);
    };

    shadow.addEventListener("click", clickHandler);

    return () => {
      shadow.removeEventListener("click", clickHandler);
    };
  }, [html, css, selectedId, theme, onSelect, onSelectedElement]);

  return <div ref={hostRef} className="preview-shadow-host" />;
}
