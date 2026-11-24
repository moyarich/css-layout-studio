import type { ComponentProps } from "react";
import { FileCode2, ArrowUpRight } from "lucide-react";
import { useSourceActions, type SourceActions } from "./SourceFiles";
import "./SourceFiles.css";

export function SourceLink({
  href,
  children,
  sources,
  onOpen,
  ...props
}: ComponentProps<"a"> & Partial<SourceActions>) {
  const scoped = useSourceActions();
  const files = sources ?? scoped?.sources ?? [];
  const open = onOpen ?? scoped?.onOpen;
  const file = href?.replace(/^\.\//, "") ?? "";
  return open && files.some((source) => source.name === file) ? (
    <button
      className={["doc-source-link", props.className].filter(Boolean).join(" ")}
      title={props.title}
      aria-label={props["aria-label"]}
      onClick={() => open(file)}
    >
      {children}
      <FileCode2 size={13} />
    </button>
  ) : (
    <a {...props} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowUpRight size={13} />
    </a>
  );
}
