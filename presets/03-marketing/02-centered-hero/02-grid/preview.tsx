import { useContext } from "react";
import { DocumentationPreviewContext } from "../../../../src/components/Preview/DocumentationPreview";
import html from './index.html?raw';
import css from './styles.css?raw';
/** An isolated viewport keeps preset selectors out of the documentation shell. */
export default function Preview() {
    const livePreview = useContext(DocumentationPreviewContext);
    if (livePreview) return livePreview;
    return <iframe title="Centered Hero - Grid" style={{ width: '100%', height: 720, border: 0 }} srcDoc={`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1" /><style>html,body{margin:0;width:100%;height:100%}${css}</style></head><body>${html}</body></html>`}/>;
}
