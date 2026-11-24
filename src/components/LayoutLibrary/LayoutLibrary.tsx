import { useState } from "react";
import {
  Search,
  BookOpen,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Layers,
} from "lucide-react";
import type { layoutGroups } from "../../studio/navigation";
import "./LayoutLibrary.css";
export function LayoutLibrary({
  groups,
  selectedId,
  onSelect,
  open = false,
}: {
  groups: typeof layoutGroups;
  selectedId: string;
  onSelect: (id: string) => void;
  open?: boolean;
}) {
  const activeLayout = groups
    .flatMap((group) => group.layouts)
    .find((layout) =>
      layout.variants.some((variant) => variant.id === selectedId),
    );
  const activePreset = activeLayout?.variants.find(
    (variant) => variant.id === selectedId,
  );
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState(
    () =>
      new Set(
        groups
          .filter(
            (group) =>
              !group.layouts.some((layout) => layout.key === activeLayout?.key),
          )
          .map((group) => group.key),
      ),
  );
  return (
    <aside
      className={`library ${open ? "is-open" : ""}`}
      aria-label="Layout library"
    >
      <div className="library-search">
        <Search size={16} />
        <input
          aria-label="Search layouts"
          placeholder="Search layouts…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <kbd>⌕</kbd>
      </div>
      <p className="eyebrow">Layout library</p>
      <nav className="library-nav">
        {groups.map((group) => {
          const layouts = group.layouts.filter((layout) =>
            `${group.label} ${layout.name}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          );
          if (!layouts.length) return null;
          const open = query.length > 0 || !collapsed.has(group.key);
          return (
            <section key={group.key} className="library-group">
              <button
                className="category-button"
                aria-expanded={open}
                onClick={() =>
                  setCollapsed((current) => {
                    const next = new Set(current);
                    next.has(group.key)
                      ? next.delete(group.key)
                      : next.add(group.key);
                    return next;
                  })
                }
              >
                <BookOpen size={17} />
                <span>{group.label}</span>
                <span className="category-count">{group.layouts.length}</span>
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {open && (
                <div className="library-items">
                  {layouts.map((layout) => (
                    <button
                      key={layout.key}
                      className={
                        layout.key === activeLayout?.key ? "selected" : ""
                      }
                      aria-current={
                        layout.key === activeLayout?.key ? "page" : undefined
                      }
                      onClick={() =>
                        onSelect(
                          (
                            layout.variants.find(
                              (variant) => variant.type === activePreset?.type,
                            ) ?? layout.variants[0]
                          ).id,
                        )
                      }
                    >
                      <LayoutGrid size={15} />
                      <span>{layout.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          );
        })}
        {!groups.some((group) =>
          group.layouts.some((layout) =>
            `${group.label} ${layout.name}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          ),
        ) && (
          <p className="empty-search">No layouts found. Try another name.</p>
        )}
      </nav>
      <footer className="library-footer">
        <span>
          {groups.reduce(
            (count, group) =>
              count +
              group.layouts.reduce(
                (n, layout) => n + layout.variants.length,
                0,
              ),
            0,
          )}{" "}
          presets ·{" "}
          {groups.reduce((sum, group) => sum + group.layouts.length, 0)} layouts
        </span>
        <Layers size={15} />
      </footer>
    </aside>
  );
}
