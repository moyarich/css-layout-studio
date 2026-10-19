import { useEffect, useMemo, useState } from "react";

import ShadcnForm from "@rjsf/shadcn";
import validator from "@rjsf/validator-ajv8";

import { cssRulesToRjsf, type CssFormData } from "./cssRulesToRjsf";

import type { CssRule } from "../../../src/editor/declarations";

import { cssWidgets } from "./CssWidgets";

import "./CssRulesForm.css";

/*
const ShadcnForm = withTheme(ShadcnRjsfTheme);
import { withTheme } from "@rjsf/core";
import { Theme as ShadcnRjsfTheme } from "@rjsf/shadcn";
import "../../node_modules/@rjsf/shadcn/dist/default.css";
*/

type Props = {
  rules: CssRule[];
};

export function CssRulesForm({ rules }: Props) {
  const generated = useMemo(() => cssRulesToRjsf(rules), [rules]);

  const [formData, setFormData] = useState<CssFormData>(generated.formData);

  useEffect(() => {
    setFormData(generated.formData);
  }, [generated]);

  return (
    <div className="dark css-rules-form-shell">
      <div className="css-rules-form-header">
        <div>
          <span>Style inspector</span>
          <h2>CSS declarations</h2>
        </div>
        <span className="css-rules-count">
          {rules.length} {rules.length === 1 ? "rule" : "rules"}
        </span>
      </div>
      <ShadcnForm
        className="css-rules-form"
        schema={generated.schema}
        uiSchema={generated.uiSchema}
        formData={formData}
        validator={validator}
        widgets={cssWidgets}
        onChange={(event) => {
          setFormData(event.formData as CssFormData);
        }}
      >
        <></>
      </ShadcnForm>
    </div>
  );
}
