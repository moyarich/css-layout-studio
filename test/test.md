```js
import { expand } from "b_short";

// Basic expansion
const { result } = expand("gap:34px");
// Output: "margin-top: 10px;\nmargin-right: 20px;\nmargin-bottom: 10px;\nmargin-left: 20px;"
console.log("Basic expansion --- ");
console.dir(result, { depth: null });
console.log("\n\n");

// JavaScript object format
const { result: obj } = expand("background: url(bg.png) no-repeat center;", {
  format: "js",
});
console.log(obj);
// Output: {
//   backgroundImage: 'url(bg.png)',
//   backgroundRepeat: 'no-repeat',
//   backgroundPosition: 'center',
//   backgroundSize: 'auto auto',
//   backgroundAttachment: 'scroll',
//   backgroundOrigin: 'padding-box',
//   backgroundClip: 'border-box'
// }

/*
import { collapse } from 'b_short';

// Expand: shorthand → longhand
expand('margin: 10px 20px');
// → "margin-top: 10px;\nmargin-right: 20px;\nmargin-bottom: 10px;\nmargin-left: 20px;"

// Collapse: longhand → shorthand
const res = collapse(`
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-left: 20px;
`);

console.log("\n\n");

console.log(res);
*/
```

```js {"terminalRows":"33"}
import * as csstree from 'css-tree';


// parse CSS to AST as a declaration value
const ast = csstree.parse('.example { gap: "2px";column-gap: "6px" }');

console.log("\n\n");

console.dir(ast, { depth: null });


const result = csstree.generate(ast)
console.log("\n\n");

console.dir(result, { depth: null });

```

```js
import { parseDeclaration } from "@b/declarations";

const css1 = 'background-image: url("stars.png"), linear-gradient(to right, #f00, oklch(50% 0.25 20));';

const result5 = parseDeclaration(css1);
console.log(result5)
```
