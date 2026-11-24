import { StudioProvider, useStudio } from "./studio/StudioContext";
import { PresetPage } from "./components/StudioPage/PresetPage";
import { studioMdxComponents } from "./mdx/mdx-components";

function StudioDocument() {
  const studio = useStudio();
  const { activePreset } = studio;
  const Page = activePreset.Page;
  const document = <Page components={studioMdxComponents} studio={studio} />;
  return activePreset.layout === "preset" ? (
    <PresetPage>{document}</PresetPage>
  ) : (
    document
  );
}

export default function App() {
  return (
    <StudioProvider>
      <StudioDocument />
    </StudioProvider>
  );
}
