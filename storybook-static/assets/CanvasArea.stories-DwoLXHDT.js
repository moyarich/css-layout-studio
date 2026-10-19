import{j as l}from"./jsx-runtime-u17CrQMm.js";import{r as p}from"./iframe-OrOvq44r.js";import{c as E}from"./createLucideIcon-B4chvBw6.js";import"./preload-helper-PPVm8Dsz.js";const S=E("Boxes",[["path",{d:"M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",key:"lc1i9w"}],["path",{d:"m7 16.5-4.74-2.85",key:"1o9zyk"}],["path",{d:"m7 16.5 5-3",key:"va8pkn"}],["path",{d:"M7 16.5v5.17",key:"jnp8gn"}],["path",{d:"M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",key:"8zsnat"}],["path",{d:"m17 16.5-5-3",key:"8arw3v"}],["path",{d:"m17 16.5 4.74-2.85",key:"8rfmw"}],["path",{d:"M17 16.5v5.17",key:"k6z78m"}],["path",{d:"M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",key:"1xygjf"}],["path",{d:"M12 8 7.26 5.15",key:"1vbdud"}],["path",{d:"m12 8 4.74-2.85",key:"3rx089"}],["path",{d:"M12 13.5V8",key:"1io7kd"}]]),I=`:host {
  --preview-background: #f4f7fb;
  --preview-foreground: #172033;
  --preview-muted: #657089;
  --layout-container-background: #ffffff;
  --layout-item-background: #f8fafc;
  --layout-border: #d7deea;
  --layout-shadow: 0 8px 24px rgb(30 41 59 / 8%);
  --layout-item-shadow: 0 2px 8px rgb(30 41 59 / 6%);
  --layout-fallback-violet: #ede9fe;
  --layout-fallback-emerald: #d1fae5;
  --layout-fallback-amber: #fef3c7;
  --layout-fallback-sky: #e0f2fe;
  --layout-fallback-rose: #ffe4e6;
  --selection: #6d5dfc;
  --selection-rgb: 109 93 252;
  --container-accent: #0284c7;
  --container-accent-rgb: 2 132 199;
  --item-accent: #d97706;
  --item-accent-rgb: 217 119 6;
  --both-accent: #9333ea;
  --both-accent-rgb: 147 51 234;
  --badge-foreground: #ffffff;
  --badge-border: rgb(255 255 255 / 22%);
  --badge-background: linear-gradient(135deg, #4f46e5, #7c3aed);
  --badge-shadow: 0 6px 18px rgb(49 46 129 / 28%);
  display: block;
  width: 100%;
  min-width: 0;
  height: 100%;
}

:host([data-theme="dark"]) {
  --preview-background: #11151e;
  --preview-foreground: #eef2ff;
  --preview-muted: #939caf;
  --layout-container-background: #1a1f2a;
  --layout-item-background: #202633;
  --layout-border: #353d4d;
  --layout-shadow: 0 12px 32px rgb(0 0 0 / 24%);
  --layout-item-shadow: 0 3px 10px rgb(0 0 0 / 18%);
  --layout-fallback-violet: #292342;
  --layout-fallback-emerald: #17392f;
  --layout-fallback-amber: #3c3018;
  --layout-fallback-sky: #173549;
  --layout-fallback-rose: #41242e;
  --selection: #9b8cff;
  --selection-rgb: 155 140 255;
  --container-accent: #38bdf8;
  --container-accent-rgb: 56 189 248;
  --item-accent: #fbbf24;
  --item-accent-rgb: 251 191 36;
  --both-accent: #c084fc;
  --both-accent-rgb: 192 132 252;
}

#preview-root {
  position: relative;
  width: 100%;
  min-width: 0;
  height: 100%;
  box-sizing: border-box;
  background: var(--preview-background);
  color: var(--preview-foreground);
}

#preview-root *,
#preview-root *::before,
#preview-root *::after {
  box-sizing: border-box;
}

/*
 * Every editor-managed element can be selected.
 *
 * Don't give every element a permanent outline because
 * that makes the preview impossible to read.
 */
[data-editor-id] {
  position: relative;
  transition:
    outline-color 140ms ease,
    box-shadow 140ms ease,
    filter 140ms ease;
}

/*
 * Theme defaults apply only after dynamic role metadata is attached.
 * Preset CSS is injected after this stylesheet, so authored background,
 * border, color and shadow declarations naturally override these values.
 */
:where([data-layout-role="container"]) {
  border: 1px solid var(--layout-border);
  color: var(--preview-foreground);
  box-shadow: var(--layout-shadow);
}

:where([data-layout-role="item"]),
:where([data-layout-role="both"]) {
  border: 1px solid var(--layout-border);
  color: var(--preview-foreground);
  box-shadow: var(--layout-item-shadow);
}

/* Deterministic fallbacks are added only when computed background-color is transparent. */
:where([data-layout-fallback-color="violet"]) {
  background-color: var(--layout-fallback-violet);
}
:where([data-layout-fallback-color="emerald"]) {
  background-color: var(--layout-fallback-emerald);
}
:where([data-layout-fallback-color="amber"]) {
  background-color: var(--layout-fallback-amber);
}
:where([data-layout-fallback-color="sky"]) {
  background-color: var(--layout-fallback-sky);
}
:where([data-layout-fallback-color="rose"]) {
  background-color: var(--layout-fallback-rose);
}

[data-editor-id]:not(.preview-selected):hover {
  outline: 1px solid rgb(var(--container-accent-rgb) / 75%) !important;
  outline-offset: -1px;
  box-shadow: inset 0 0 0 9999px rgb(var(--container-accent-rgb) / 5%);
  cursor: pointer;
}

/*
 * Selected element.
 */
[data-editor-id].preview-selected {
  outline: 2px solid var(--selection) !important;
  outline-offset: 2px;
  box-shadow:
    0 0 0 1px rgb(var(--selection-rgb) / 26%),
    0 0 22px rgb(var(--selection-rgb) / 32%) !important;
}

/* Role title pill overlay */
[data-editor-id].preview-selected::after {
  content: attr(data-layout-role);
  position: absolute;
  z-index: 2147483647;
  top: -15px;
  right: 8px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid var(--badge-border);
  background: var(--badge-background);
  color: var(--badge-foreground);
  box-shadow:
    var(--badge-shadow),
    inset 0 1px 0 rgb(255 255 255 / 18%);
  font:
    700 9px/1.4 ui-sans-serif,
    system-ui,
    sans-serif;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  pointer-events: none;
}

[data-editor-id][data-layout-role="none"].preview-selected::after {
  display: none;
}

/*
 * Selected element establishes layout for children.
 */
[data-editor-id].preview-layout-container {
  outline-color: var(--container-accent) !important;
  box-shadow:
    0 0 0 1px rgb(var(--container-accent-rgb) / 25%),
    0 0 24px rgb(var(--container-accent-rgb) / 26%) !important;
}

/*
 * Selected element participates in its parent's
 * flex/grid layout.
 */
[data-editor-id].preview-layout-item {
  outline-color: var(--item-accent) !important;
  box-shadow:
    0 0 0 1px rgb(var(--item-accent-rgb) / 25%),
    0 0 24px rgb(var(--item-accent-rgb) / 25%) !important;
}

/*
 * The element is both:
 *
 * - a flex/grid item
 * - a flex/grid container
 */
[data-editor-id].preview-layout-both {
  outline-color: var(--both-accent) !important;
  box-shadow:
    0 0 0 1px rgb(var(--both-accent-rgb) / 28%),
    0 0 26px rgb(var(--both-accent-rgb) / 30%) !important;
}

.preview-layout-parent {
  outline: 1px dashed rgb(var(--item-accent-rgb) / 85%) !important;
  outline-offset: 6px;
}

[data-editor-id].preview-related-item {
  box-shadow: inset 0 0 0 1px rgb(var(--container-accent-rgb) / 55%);
}

[data-editor-id].preview-related-item::before {
  content: "";
  position: absolute;
  z-index: 2147483646;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgb(var(--container-accent-rgb) / 8%),
    rgb(var(--selection-rgb) / 5%)
  );
  pointer-events: none;
}

/*
 * Subtle visual indication of the children belonging
 * to the currently selected layout container.
 */
[data-layout-container="flex"] > [data-editor-id],
[data-layout-container="inline-flex"] > [data-editor-id] {
  box-shadow: inset 0 0 0 1px rgb(var(--container-accent-rgb) / 18%);
}

[data-layout-container="grid"] > [data-editor-id],
[data-layout-container="inline-grid"] > [data-editor-id] {
  box-shadow: inset 0 0 0 1px rgb(var(--both-accent-rgb) / 18%);
}
`,_=new Set(["flex","inline-flex","grid","inline-grid"]),h=["violet","emerald","amber","sky","rose"];function K(a){if(!a)return!1;const n=a.backgroundColor.replace(/\s+/g,"").toLowerCase();return n!=="transparent"&&n!=="rgba(0,0,0,0)"}function m(a){if(!a)return null;const n=a.ownerDocument.defaultView;return n?n.getComputedStyle(a):null}function w(a){const n=m(a);if(!n)return null;const e=n.display;return _.has(e)?e:null}function k(a){let n=a.parentElement;for(;n;){const e=m(n);if(!e||e.display!=="contents")return n;n=n.parentElement}return null}function L(a){const n=k(a),e=m(a),t=w(a),o=w(n),i=e!==null&&e.display!=="none"&&e.display!=="contents",s=i&&e.position!=="absolute"&&e.position!=="fixed",d=i&&t!==null,r=s&&o!==null;let u="none";return d&&r?u="both":d?u="container":r&&(u="item"),{role:u,isContainer:d,isItem:r,containerKind:t,parentContainerKind:o,showLayoutUi:d||r,showContainerUi:d,showItemUi:r}}function T(a){return m(a)?.display==="contents"}function x(a){const n=[],e=t=>{Array.from(t.children).forEach(o=>{if(!(o instanceof HTMLElement))return;if(T(o)){e(o);return}const i=m(o);i!==null&&i.display!=="none"&&i.position!=="absolute"&&i.position!=="fixed"&&o.hasAttribute("data-editor-id")&&n.push(o)})};return e(a),n}function j(a){a.querySelectorAll("[data-editor-id]").forEach(n=>{n.classList.remove("preview-selected","preview-layout-container","preview-layout-item","preview-layout-both","preview-layout-parent","preview-related-item")})}function U(a){let n=0;a.querySelectorAll("[data-editor-id]").forEach(e=>{const t=L(e);if(e.dataset.layoutRole=t.role,t.containerKind?e.dataset.layoutContainer=t.containerKind:delete e.dataset.layoutContainer,t.parentContainerKind?e.dataset.layoutItem=t.parentContainerKind:delete e.dataset.layoutItem,t.showLayoutUi){const o=m(e);K(o)?delete e.dataset.layoutFallbackColor:e.dataset.layoutFallbackColor=h[n%h.length],n+=1}else delete e.dataset.layoutFallbackColor})}function N(a,n){if(n.isContainer&&x(a).forEach(e=>{e.classList.add("preview-related-item"),e.dataset.layoutItem=n.containerKind??void 0}),n.isItem){const e=k(a);if(!e)return;e.classList.add("preview-layout-parent"),e.dataset.layoutContainer=n.parentContainerKind??void 0,x(e).forEach(t=>{t!==a&&t.classList.add("preview-related-item")})}}function M(a,n){switch(a.classList.add("preview-selected"),a.dataset.layoutRole=n.role,n.containerKind&&(a.dataset.layoutContainer=n.containerKind),n.parentContainerKind&&(a.dataset.layoutItem=n.parentContainerKind),n.role){case"container":a.classList.add("preview-layout-container");break;case"item":a.classList.add("preview-layout-item");break;case"both":a.classList.add("preview-layout-both");break}}function A(a){return a.composedPath().find(e=>e instanceof HTMLElement&&e.hasAttribute("data-editor-id"))??null}function C({html:a,css:n,selectedId:e,theme:t,onSelect:o,onSelectedElement:i}){const s=p.useRef(null);return p.useEffect(()=>{const d=s.current;if(!d)return;d.dataset.theme=t;const r=d.shadowRoot??d.attachShadow({mode:"open"});r.innerHTML=`
      <style>
        ${I}

        ${n}
      </style>

      <div id="preview-root" data-theme="${t}">
        ${a}
      </div>
      
    `,j(r),U(r);const u=e?r.querySelector(`[data-editor-id="${CSS.escape(e)}"]`):null;if(u&&e){const c=L(u);M(u,c),N(u,c),i({id:e,element:u,layout:c})}else i(null);const v=c=>{const g=A(c);if(!g)return;const f=g.getAttribute("data-editor-id");f&&(c.preventDefault(),c.stopPropagation(),o(f))};return r.addEventListener("click",v),()=>{r.removeEventListener("click",v)}},[a,n,e,t,o,i]),l.jsx("div",{ref:s,className:"preview-shadow-host"})}C.__docgenInfo={description:"",methods:[],displayName:"Preview",props:{html:{required:!0,tsType:{name:"string"},description:""},css:{required:!0,tsType:{name:"string"},description:""},selectedId:{required:!0,tsType:{name:"union",raw:"EditorNodeId | null",elements:[{name:"literal",value:"`node_${string}`"},{name:"null"}]},description:""},theme:{required:!0,tsType:{name:"union",raw:'"light" | "dark"',elements:[{name:"literal",value:'"light"'},{name:"literal",value:'"dark"'}]},description:""},onSelect:{required:!0,tsType:{name:"signature",type:"function",raw:"(id: EditorNodeId) => void",signature:{arguments:[{type:{name:"literal",value:"`node_${string}`"},name:"id"}],return:{name:"void"}}},description:""},onSelectedElement:{required:!0,tsType:{name:"signature",type:"function",raw:"(selection: SelectedPreviewElement | null) => void",signature:{arguments:[{type:{name:"union",raw:"SelectedPreviewElement | null",elements:[{name:"signature",type:"object",raw:`{
  id: EditorNodeId;
  element: HTMLElement;
  layout: ElementLayoutInfo;
}`,signature:{properties:[{key:"id",value:{name:"literal",value:"`node_${string}`",required:!0}},{key:"element",value:{name:"HTMLElement",required:!0}},{key:"layout",value:{name:"signature",type:"object",raw:`{
  role: LayoutRole;

  isContainer: boolean;
  isItem: boolean;

  containerKind: LayoutKind;
  parentContainerKind: LayoutKind;

  showLayoutUi: boolean;
  showContainerUi: boolean;
  showItemUi: boolean;
}`,signature:{properties:[{key:"role",value:{name:"union",raw:'"none" | "container" | "item" | "both"',elements:[{name:"literal",value:'"none"'},{name:"literal",value:'"container"'},{name:"literal",value:'"item"'},{name:"literal",value:'"both"'}],required:!0}},{key:"isContainer",value:{name:"boolean",required:!0}},{key:"isItem",value:{name:"boolean",required:!0}},{key:"containerKind",value:{name:"union",raw:'"flex" | "inline-flex" | "grid" | "inline-grid" | null',elements:[{name:"literal",value:'"flex"'},{name:"literal",value:'"inline-flex"'},{name:"literal",value:'"grid"'},{name:"literal",value:'"inline-grid"'},{name:"null"}],required:!0}},{key:"parentContainerKind",value:{name:"union",raw:'"flex" | "inline-flex" | "grid" | "inline-grid" | null',elements:[{name:"literal",value:'"flex"'},{name:"literal",value:'"inline-flex"'},{name:"literal",value:'"grid"'},{name:"literal",value:'"inline-grid"'},{name:"null"}],required:!0}},{key:"showLayoutUi",value:{name:"boolean",required:!0}},{key:"showContainerUi",value:{name:"boolean",required:!0}},{key:"showItemUi",value:{name:"boolean",required:!0}}]},required:!0}}]}},{name:"null"}]},name:"selection"}],return:{name:"void"}}},description:""}}};function q({html:a,css:n,selectedId:e,selectedLabel:t,selection:o,theme:i,onSelect:s,onSelectedElement:d}){const r=o?.layout;return l.jsxs("section",{className:"canvas-area",children:[l.jsxs("div",{className:"canvas-toolbar",children:[l.jsxs("div",{className:"preview-title",children:[l.jsx("span",{className:"status-dot"}),l.jsx(S,{size:14}),"Live preview"]}),l.jsxs("div",{className:"selection-crumb",children:[l.jsx("span",{children:"Selected"}),l.jsx("code",{children:t??"None"})]}),r?.showLayoutUi?l.jsx("span",{className:`layout-role layout-role-${r.role}`,children:r.role==="both"?"Layout item + container":`Layout ${r.role}`}):null]}),l.jsx("div",{className:"canvas-scroll",children:l.jsx("div",{className:"canvas-frame",children:l.jsx(C,{html:a,css:n,selectedId:e,theme:i,onSelect:s,onSelectedElement:d})})})]})}q.__docgenInfo={description:"",methods:[],displayName:"CanvasArea",props:{html:{required:!0,tsType:{name:"string"},description:""},css:{required:!0,tsType:{name:"string"},description:""},selectedId:{required:!0,tsType:{name:"union",raw:"EditorNodeId | null",elements:[{name:"literal",value:"`node_${string}`"},{name:"null"}]},description:""},selectedLabel:{required:!0,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:""},selection:{required:!0,tsType:{name:"union",raw:"SelectedPreviewElement | null",elements:[{name:"signature",type:"object",raw:`{
  id: EditorNodeId;
  element: HTMLElement;
  layout: ElementLayoutInfo;
}`,signature:{properties:[{key:"id",value:{name:"literal",value:"`node_${string}`",required:!0}},{key:"element",value:{name:"HTMLElement",required:!0}},{key:"layout",value:{name:"signature",type:"object",raw:`{
  role: LayoutRole;

  isContainer: boolean;
  isItem: boolean;

  containerKind: LayoutKind;
  parentContainerKind: LayoutKind;

  showLayoutUi: boolean;
  showContainerUi: boolean;
  showItemUi: boolean;
}`,signature:{properties:[{key:"role",value:{name:"union",raw:'"none" | "container" | "item" | "both"',elements:[{name:"literal",value:'"none"'},{name:"literal",value:'"container"'},{name:"literal",value:'"item"'},{name:"literal",value:'"both"'}],required:!0}},{key:"isContainer",value:{name:"boolean",required:!0}},{key:"isItem",value:{name:"boolean",required:!0}},{key:"containerKind",value:{name:"union",raw:'"flex" | "inline-flex" | "grid" | "inline-grid" | null',elements:[{name:"literal",value:'"flex"'},{name:"literal",value:'"inline-flex"'},{name:"literal",value:'"grid"'},{name:"literal",value:'"inline-grid"'},{name:"null"}],required:!0}},{key:"parentContainerKind",value:{name:"union",raw:'"flex" | "inline-flex" | "grid" | "inline-grid" | null',elements:[{name:"literal",value:'"flex"'},{name:"literal",value:'"inline-flex"'},{name:"literal",value:'"grid"'},{name:"literal",value:'"inline-grid"'},{name:"null"}],required:!0}},{key:"showLayoutUi",value:{name:"boolean",required:!0}},{key:"showContainerUi",value:{name:"boolean",required:!0}},{key:"showItemUi",value:{name:"boolean",required:!0}}]},required:!0}}]}},{name:"null"}]},description:""},theme:{required:!0,tsType:{name:"union",raw:'"light" | "dark"',elements:[{name:"literal",value:'"light"'},{name:"literal",value:'"dark"'}]},description:""},onSelect:{required:!0,tsType:{name:"signature",type:"function",raw:"(id: EditorNodeId) => void",signature:{arguments:[{type:{name:"literal",value:"`node_${string}`"},name:"id"}],return:{name:"void"}}},description:""},onSelectedElement:{required:!0,tsType:{name:"signature",type:"function",raw:"(selection: SelectedPreviewElement | null) => void",signature:{arguments:[{type:{name:"union",raw:"SelectedPreviewElement | null",elements:[{name:"signature",type:"object",raw:`{
  id: EditorNodeId;
  element: HTMLElement;
  layout: ElementLayoutInfo;
}`,signature:{properties:[{key:"id",value:{name:"literal",value:"`node_${string}`",required:!0}},{key:"element",value:{name:"HTMLElement",required:!0}},{key:"layout",value:{name:"signature",type:"object",raw:`{
  role: LayoutRole;

  isContainer: boolean;
  isItem: boolean;

  containerKind: LayoutKind;
  parentContainerKind: LayoutKind;

  showLayoutUi: boolean;
  showContainerUi: boolean;
  showItemUi: boolean;
}`,signature:{properties:[{key:"role",value:{name:"union",raw:'"none" | "container" | "item" | "both"',elements:[{name:"literal",value:'"none"'},{name:"literal",value:'"container"'},{name:"literal",value:'"item"'},{name:"literal",value:'"both"'}],required:!0}},{key:"isContainer",value:{name:"boolean",required:!0}},{key:"isItem",value:{name:"boolean",required:!0}},{key:"containerKind",value:{name:"union",raw:'"flex" | "inline-flex" | "grid" | "inline-grid" | null',elements:[{name:"literal",value:'"flex"'},{name:"literal",value:'"inline-flex"'},{name:"literal",value:'"grid"'},{name:"literal",value:'"inline-grid"'},{name:"null"}],required:!0}},{key:"parentContainerKind",value:{name:"union",raw:'"flex" | "inline-flex" | "grid" | "inline-grid" | null',elements:[{name:"literal",value:'"flex"'},{name:"literal",value:'"inline-flex"'},{name:"literal",value:'"grid"'},{name:"literal",value:'"inline-grid"'},{name:"null"}],required:!0}},{key:"showLayoutUi",value:{name:"boolean",required:!0}},{key:"showContainerUi",value:{name:"boolean",required:!0}},{key:"showItemUi",value:{name:"boolean",required:!0}}]},required:!0}}]}},{name:"null"}]},name:"selection"}],return:{name:"void"}}},description:""}}};const P=`
  <main class="dashboard" data-editor-id="node_dashboard">
    <aside class="sidebar" data-editor-id="node_sidebar">Navigation</aside>
    <section class="content" data-editor-id="node_content">
      <article data-editor-id="node_card_1">Revenue</article>
      <article data-editor-id="node_card_2">Customers</article>
      <article data-editor-id="node_card_3">Conversion</article>
    </section>
  </main>`,R=`
  .dashboard { display: grid; grid-template-columns: 180px 1fr; gap: 18px; min-height: 540px; padding: 24px; background: #111827; color: #f8fafc; }
  .sidebar { padding: 20px; border-radius: 14px; background: #1f2937; }
  .content { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  article { min-height: 160px; padding: 18px; border: 1px solid #334155; border-radius: 14px; background: #182234; }
`,$={node_dashboard:".dashboard",node_sidebar:".sidebar",node_content:".content",node_card_1:"article:first-child",node_card_2:"article:nth-child(2)",node_card_3:"article:nth-child(3)"};function H({html:a,css:n,initialSelectedId:e,selectedLabel:t,theme:o}){const[i,s]=p.useState(e),[d,r]=p.useState(null);return p.useEffect(()=>s(e),[e]),l.jsx("div",{style:{height:760,display:"grid"},children:l.jsx(q,{html:a,css:n,selectedId:i,selectedLabel:t||$[i]||null,selection:d,theme:o,onSelect:s,onSelectedElement:r})})}const O={title:"CSS Generator/CanvasArea",component:H,parameters:{layout:"fullscreen"},argTypes:{html:{control:"text"},css:{control:"text"},initialSelectedId:{control:"text"},selectedLabel:{control:"text"},theme:{control:"inline-radio",options:["light","dark"]}},args:{html:P,css:R,initialSelectedId:"node_content",selectedLabel:"",theme:"dark"}},b={},y={args:{initialSelectedId:"node_dashboard"}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:"{}",...b.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    initialSelectedId: "node_dashboard"
  }
}`,...y.parameters?.docs?.source}}};const V=["NestedGridContainer","DashboardRoot"];export{y as DashboardRoot,b as NestedGridContainer,V as __namedExportsOrder,O as default};
