import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import "monaco-editor/languages/definitions/css/register";
import "monaco-editor/languages/definitions/html/register";
import "monaco-editor/language/css/monaco.contribution";
import "monaco-editor/language/html/monaco.contribution";
import EditorWorker from "monaco-editor/editor/editor.worker?worker";
import CssWorker from "monaco-editor/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/language/html/html.worker?worker";

// Serve the editor and its language workers with the app, including offline use.
self.MonacoEnvironment = {
  getWorker(_moduleId, label) {
    if (["css", "scss", "less"].includes(label)) return new CssWorker();
    if (["html", "handlebars", "razor"].includes(label))
      return new HtmlWorker();
    return new EditorWorker();
  },
};
loader.config({ monaco });
