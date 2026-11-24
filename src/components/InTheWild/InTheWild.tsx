import { Children, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import type { InTheWildExample } from "../../../presets/types";
import "./InTheWild.css";

/** Examples are supplied explicitly; authored children override the list. */
export function InTheWild({
  title = "In the wild",
  examples = [],
  children,
}: {
  title?: string;
  examples?: InTheWildExample[];
  children?: ReactNode;
}) {
  const items = examples;
  const hasContent = Children.toArray(children).some(
    (child) => typeof child !== "string" || child.trim().length > 0,
  );
  if (!hasContent && !items.length) return null;
  return (
    <section className="in-the-wild">
      <h2>{title}</h2>
      {hasContent ? (
        children
      ) : (
        <ul>
          {items.map((example, index) => (
            <li key={`${example.name}-${index}`}>
              {example.url ? (
                <a href={example.url} target="_blank" rel="noopener noreferrer">
                  {example.name}
                  <ArrowUpRight size={13} />
                </a>
              ) : (
                <span>{example.name}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
