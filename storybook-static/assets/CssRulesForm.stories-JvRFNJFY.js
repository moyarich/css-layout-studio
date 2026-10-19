import{j as o}from"./jsx-runtime-u17CrQMm.js";import{F as O,v as q,g as d}from"./declarations-BkQEgsuD.js";import{r as v}from"./iframe-OrOvq44r.js";import"./index-BsgzcSIq.js";import"./index-g9KyisT_.js";import"./preload-helper-PPVm8Dsz.js";const F={display:["block","inline","inline-block","flex","inline-flex","grid","inline-grid","none"],"box-sizing":["content-box","border-box"],position:["static","relative","absolute","fixed","sticky"],"flex-direction":["row","row-reverse","column","column-reverse"],"flex-wrap":["nowrap","wrap","wrap-reverse"],"justify-content":["normal","start","end","flex-start","flex-end","center","left","right","space-between","space-around","space-evenly","stretch"],"align-items":["normal","stretch","start","end","flex-start","flex-end","center","baseline"],"align-content":["normal","stretch","start","end","flex-start","flex-end","center","space-between","space-around","space-evenly"],"align-self":["auto","normal","stretch","start","end","flex-start","flex-end","center","baseline"],overflow:["visible","hidden","clip","scroll","auto"],"overflow-x":["visible","hidden","clip","scroll","auto"],"overflow-y":["visible","hidden","clip","scroll","auto"],visibility:["visible","hidden","collapse"],"text-align":["start","end","left","right","center","justify"],"white-space":["normal","nowrap","pre","pre-wrap","pre-line","break-spaces"]},W=new Set(["color","background-color","border-top-color","border-right-color","border-bottom-color","border-left-color","outline-color"]),I=new Set(["width","height","min-width","min-height","max-width","max-height","top","right","bottom","left","margin-top","margin-right","margin-bottom","margin-left","padding-top","padding-right","padding-bottom","padding-left","row-gap","column-gap","border-top-width","border-right-width","border-bottom-width","border-left-width","border-top-left-radius","border-top-right-radius","border-bottom-right-radius","border-bottom-left-radius","font-size","line-height"]),L=new Set(["flex-grow","flex-shrink","order"]);function V(e){const r=F[e];return r?{type:"string",title:e,enum:r}:{type:"string",title:e}}function M(e,r){const t={"ui:options":{cssProperty:e,sourceProperty:r.sourceProperty,sourceValue:r.sourceValue,fromShorthand:r.fromShorthand,important:r.important}};return r.fromShorthand&&(t["ui:help"]=`From ${r.sourceProperty}: ${r.sourceValue}`),F[e]?(t["ui:widget"]="select",t):W.has(e)?(t["ui:widget"]="CssColorWidget",t):I.has(e)?(t["ui:widget"]="CssLengthWidget",t):L.has(e)?(t["ui:widget"]="CssNumberWidget",t):(t["ui:widget"]="text",t)}function T(e){const r={type:"object",title:"CSS",properties:{},additionalProperties:!1},t={"ui:submitButtonOptions":{norender:!0}},s={},a={},l=[];return e.forEach((i,u)=>{const n=`rule_${u}`;l.push(n);const R={},w={},j={},k={},P=[];for(const[c,p]of Object.entries(i.longhands))P.push(c),R[c]=V(c),w[c]=M(c,p),j[c]=p.value,k[c]={property:c,selector:i.selector,sourceProperty:p.sourceProperty,sourceValue:p.sourceValue,fromShorthand:p.fromShorthand,important:p.important};r.properties[n]={type:"object",title:i.selector,properties:R,additionalProperties:!1},w["ui:order"]=P,t[n]=w,s[n]=j,a[n]={selector:i.selector,fields:k}}),t["ui:order"]=l,{schema:r,uiSchema:t,formData:s,provenance:a}}function S(e){return typeof e=="string"?e:e==null?"":String(e)}const C="css-value-control border-input placeholder:text-muted-foreground bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50";function N({id:e,value:r,disabled:t,readonly:s,required:a,onChange:l,onBlur:i,onFocus:u}){return o.jsx("input",{id:e,type:"text",value:S(r),required:a,disabled:t,readOnly:s,placeholder:"#000000, rgb(...), var(...)",className:`${C} css-color-control`,onChange:n=>l(n.target.value),onBlur:n=>i(e,n.target.value),onFocus:n=>u(e,n.target.value)})}function E({id:e,value:r,disabled:t,readonly:s,required:a,onChange:l,onBlur:i,onFocus:u}){return o.jsx("input",{id:e,type:"text",inputMode:"decimal",value:S(r),required:a,disabled:t,readOnly:s,placeholder:"0, 16px, 100%, calc(...)",className:C,onChange:n=>l(n.target.value),onBlur:n=>i(e,n.target.value),onFocus:n=>u(e,n.target.value)})}function _({id:e,value:r,disabled:t,readonly:s,required:a,onChange:l,onBlur:i,onFocus:u}){return o.jsx("input",{id:e,type:"text",inputMode:"decimal",value:S(r),required:a,disabled:t,readOnly:s,placeholder:"0",className:C,onChange:n=>l(n.target.value),onBlur:n=>i(e,n.target.value),onFocus:n=>u(e,n.target.value)})}const z={CssColorWidget:N,CssLengthWidget:E,CssNumberWidget:_};N.__docgenInfo={description:"",methods:[],displayName:"CssColorWidget"};E.__docgenInfo={description:"",methods:[],displayName:"CssLengthWidget"};_.__docgenInfo={description:"",methods:[],displayName:"CssNumberWidget"};function D({rules:e}){const r=v.useMemo(()=>T(e),[e]),[t,s]=v.useState(r.formData);return v.useEffect(()=>{s(r.formData)},[r]),o.jsxs("div",{className:"dark css-rules-form-shell",children:[o.jsxs("div",{className:"css-rules-form-header",children:[o.jsxs("div",{children:[o.jsx("span",{children:"Style inspector"}),o.jsx("h2",{children:"CSS declarations"})]}),o.jsxs("span",{className:"css-rules-count",children:[e.length," ",e.length===1?"rule":"rules"]})]}),o.jsx(O,{className:"css-rules-form",schema:r.schema,uiSchema:r.uiSchema,formData:t,validator:q,widgets:z,onChange:a=>{s(a.formData)},children:o.jsx(o.Fragment,{})})]})}D.__docgenInfo={description:"",methods:[],displayName:"CssRulesForm",props:{rules:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  selector: string;
  authored: AuthoredDeclaration[];
  longhands: Record<string, LonghandDeclaration>;
}`,signature:{properties:[{key:"selector",value:{name:"string",required:!0}},{key:"authored",value:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ property: string; value: string; important: boolean }",signature:{properties:[{key:"property",value:{name:"string",required:!0}},{key:"value",value:{name:"string",required:!0}},{key:"important",value:{name:"boolean",required:!0}}]}}],raw:"AuthoredDeclaration[]",required:!0}},{key:"longhands",value:{name:"Record",elements:[{name:"string"},{name:"signature",type:"object",raw:`{
  value: string;
  important: boolean;
  sourceProperty: string;
  sourceValue: string;
  fromShorthand: boolean;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"important",value:{name:"boolean",required:!0}},{key:"sourceProperty",value:{name:"string",required:!0}},{key:"sourceValue",value:{name:"string",required:!0}},{key:"fromShorthand",value:{name:"boolean",required:!0}}]}}],raw:"Record<string, LonghandDeclaration>",required:!0}}]}}],raw:"CssRule[]"},description:""}}};const B=`.container {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  gap: 16px;
  padding: 24px;
  align-content: flex-start;
}

.item {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #1b1a31;
  padding: 10px;
  border-radius: 6px;
}

.item-1 {
  flex: 0 0 100%;
  height: 80px;
}

.item-2,
.item-3,
.item-4 {
  height: calc(100% - 192px);
  min-height: 0;
}

.item-2 {
  flex: 16 1 0;
}

.item-3 {
  flex: 62 1 0;
}

.item-4 {
  flex: 16 1 0;
}

.item-5 {
  flex: 0 0 100%;
  height: 80px;
}
`,A=d(B),K={title:"CSS Generator/CssRulesForm",component:D,parameters:{layout:"fullscreen",backgrounds:{default:"editor"}},decorators:[e=>o.jsx("div",{style:{minHeight:"100vh",padding:32,background:"#090b10"},children:o.jsx(e,{})})],args:{rules:A}},m={},g={args:{rules:d(`
      .item {
        flex: 16 1 0;
      }
    `)}},h={args:{rules:d(`
      .item {
        flex: 1 1 0;
        flex-grow: 4;
      }
    `)}},f={args:{rules:d(`
      .item-2,
      .item-3,
      .item-4 {
        height: calc(100% - 192px);
        min-height: 0;
      }

      .item-2 {
        flex: 16 1 0;
      }

      .item-3 {
        flex: 62 1 0;
      }

      .item-4 {
        flex: 16 1 0;
      }
    `)}},x={args:{rules:d(`
      .container {
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        gap: 16px;
        padding: 24px;
        align-content: flex-start;
      }
    `)}},b={args:{rules:d(`
      .item {
        flex: 1 1 0 !important;
        min-width: 0;
      }
    `)}},y={args:{rules:d(`
      .container {
        --layout-gap: 16px;
        --sidebar-width: 16%;

        display: flex;
        gap: var(--layout-gap);
      }
    `)}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:"{}",...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    rules: getCssRules(\`
      .item {
        flex: 16 1 0;
      }
    \`)
  }
}`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    rules: getCssRules(\`
      .item {
        flex: 1 1 0;
        flex-grow: 4;
      }
    \`)
  }
}`,...h.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    rules: getCssRules(\`
      .item-2,
      .item-3,
      .item-4 {
        height: calc(100% - 192px);
        min-height: 0;
      }

      .item-2 {
        flex: 16 1 0;
      }

      .item-3 {
        flex: 62 1 0;
      }

      .item-4 {
        flex: 16 1 0;
      }
    \`)
  }
}`,...f.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    rules: getCssRules(\`
      .container {
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        gap: 16px;
        padding: 24px;
        align-content: flex-start;
      }
    \`)
  }
}`,...x.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    rules: getCssRules(\`
      .item {
        flex: 1 1 0 !important;
        min-width: 0;
      }
    \`)
  }
}`,...b.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    rules: getCssRules(\`
      .container {
        --layout-gap: 16px;
        --sidebar-width: 16%;

        display: flex;
        gap: var(--layout-gap);
      }
    \`)
  }
}`,...y.parameters?.docs?.source}}};const Q=["Default","FlexShorthand","ShorthandWithLonghandOverride","MultipleSelectors","FlexContainer","ImportantDeclarations","CustomProperties"];export{y as CustomProperties,m as Default,x as FlexContainer,g as FlexShorthand,b as ImportantDeclarations,f as MultipleSelectors,h as ShorthandWithLonghandOverride,Q as __namedExportsOrder,K as default};
