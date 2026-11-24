import { StudioProvider, useStudio } from "./studio/StudioContext";
import { studioMdxComponents } from "./mdx/mdx-components";

function StudioDocument() {
  const studio = useStudio();
  const { activePreset } = studio;
  const Page = activePreset.Page;
  return <Page components={studioMdxComponents} studio={studio} />;
}

export default function App() {
  return (
    <StudioProvider>
      <StudioDocument />
    </StudioProvider>
  );
}
