import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Page } from "../ui/components/Page/Page";
import { useStudio } from "../../studio/StudioContext";
import "./StudioShell.css";
import "../../studio/theme.css";

export function StudioShell({ children }: { children: ReactNode }) {
  const { theme } = useStudio();
  return (
    <Page as="div" className="app-shell studio" data-theme={theme}>
      {children}
    </Page>
  );
}
export function StudioBody({ children }: { children: ReactNode }) {
  return <div className="studio-workspace">{children}</div>;
}
export function Workspace({ children }: { children: ReactNode }) {
  return <Page className="studio-main">{children}</Page>;
}
export function StudioToast() {
  const { notice } = useStudio();
  return notice ? (
    <div className="studio-toast" role="status">
      <Check size={16} />
      {notice}
    </div>
  ) : null;
}
