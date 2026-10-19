import html from './index.html?raw';
import css from './styles.css?raw';
/** An isolated viewport keeps preset selectors out of the documentation shell. */
export default function Preview() {
    return <iframe title="Editorial Article - Flex" style={{ width: '100%', height: 720, border: 0 }} srcDoc={`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1" /><style>html,body{margin:0;width:100%;height:100%}${css}</style></head><body>${html}</body></html>`}/>;
}
