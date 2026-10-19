import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +----------------------------------------------+
 * | Pastel section: small + large placeholder    |
 * +----------------------------------------------+
 * | Sparse dark statement band                   |
 * +~~~~~~~~~~~~ lower elliptical arc ~~~~~~~~~~~~+
 * | Large white content placeholder              |
 * +----------------------------------------------+
 * | Sparse dark metrics band                     |
 * +----------------------------------------------+
 * | White content placeholder                    |
 * +----------------------------------------------+
 * | Sparse dark CTA + lower arc                  |
 * +----------------------------------------------+
 * | Final white placeholder                      |
 * +----------------------------------------------+
 */

const inTheWild: NonNullable<PresetSource["inTheWild"]> = [];

const html = `<div class="container">
  <main>
    <section class="hero-section">
      <div class="placeholder placeholder-small">Intro</div>
      <div class="placeholder placeholder-hero">Hero media</div>
    </section>

    <section class="dark-band statement-band"><h2>Turn ideas into coordinated action.</h2></section>
    <div class="arc-lower" aria-hidden="true"></div>

    <section class="content-section content-large">
      <div class="placeholder placeholder-large">Primary content</div>
    </section>

    <section class="dark-band metrics-band"><h2>Make progress visible.</h2></section>

    <section class="content-section">
      <div class="placeholder placeholder-medium">Supporting content</div>
    </section>

    <section class="dark-band cta-band"><h2>Build a workspace around your team.</h2></section>
    <section class="content-section content-final">
      <div class="placeholder placeholder-medium">Final content</div>
    </section>
  </main>
</div>`;

const sharedCss = `

/* Neutral content placeholders */
.placeholder {
  box-sizing: border-box;
  display: grid;
  place-items: center;
  border: 1px solid #c7cbbf;
  background: #ececec;
  color: #777b73;
  font-size: 11px;
}

.placeholder-small { width: min(42%, 420px); min-height: 44px; }
.placeholder-hero { width: min(42%, 420px); min-height: 290px; }
.placeholder-large { width: min(52%, 620px); min-height: 540px; }
.placeholder-medium { width: min(52%, 620px); min-height: 360px; }

/* Pastel opening section */
.hero-section {
  box-sizing: border-box;
  align-items: center;
  gap: 14px;
  min-height: 560px;
  padding: 36px 8% 0;
  background:
    radial-gradient(circle at 16% 62%, #f8dce8, transparent 36%),
    radial-gradient(circle at 50% 58%, #dce8ff, transparent 42%),
    radial-gradient(circle at 82% 56%, #dcf9e8, transparent 36%),
    #fffbea;
}

/* Sparse dark bands */
.dark-band {
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 44px 10%;
  background-color: #4a154b;
  color: #fff;
  text-align: center;
}

.dark-band h2 {
  max-width: 520px;
  margin: 0;
  color: #fff;
  font-size: clamp(22px, 3vw, 34px);
  line-height: 1.05;
}

.statement-band { min-height: 270px; align-items: start; }
.metrics-band { min-height: 220px; }
.cta-band { min-height: 170px;   clip-path: ellipse(75% 100% at top);}

/* Empty white layer rises into the preceding dark section. */
.arc-lower {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 8rem;
  min-height: 8rem;
  flex: 0 0 8rem;
  clip-path: ellipse(60% 200% at 50% 200%);
  margin-top: -8rem;
  background-color: #fff;
}

/* Spacious white sections */
.content-section {
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  min-height: 620px;
  padding: 10px 8% 64px;
  background: #fff;
}

.content-large { min-height: 780px; }
.content-final { min-height: 520px; padding-top: 0; }
`;

export const presets = [
  {
    id: "clipped-workspace-flex",
    name: "Clipped Workspace - Flex",
    description:
      "Sparse campaign shell with repeated clipped transitions using Flexbox.",
    type: "flex",
    inTheWild,
    html,
    css: `.container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #fff;
}

/* Flex section flow */
.container > main,
.hero-section,
.dark-band,
.content-section {
  display: flex;
  flex-direction: column;
}
${sharedCss}`,
    editor: { category: "Marketing" },
  },
  {
    id: "clipped-workspace-grid",
    name: "Clipped Workspace - Grid",
    description:
      "Sparse campaign shell with repeated clipped transitions using CSS Grid.",
    type: "grid",
    inTheWild,
    html,
    css: `.container {
  box-sizing: border-box;
  display: grid;
  grid-auto-rows: max-content;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #fff;
}

/* Grid section flow */
.container > main,
.hero-section,
.dark-band,
.content-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
}
${sharedCss}`,
    editor: { category: "Marketing" },
  },
] satisfies PresetSource[];
