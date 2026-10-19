import { PresetSource } from "..";

/*
 * Visual structure
 *
 * +------------+---------------------------+----------+
 * | Media      | Content                   | Action   |
 * +------------+---------------------------+----------+
 */

const inTheWild: NonNullable<PresetSource["inTheWild"]> = [];

export const presets = [
  {
    id: "media-object-flex",
    name: "Media Object - Flex",
    description:
      "Thumbnail, flexible content, and trailing action using Flexbox.",
    type: "flex",
    inTheWild,
    html: `<div class="container">
  <section class="thumbnail">Thumbnail</section>
  <section class="content">Content</section>
  <section class="action">Action</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Flex makes the center content region absorb most available width. */
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.thumbnail,
.content,
.action {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.thumbnail {
  flex: 2 1 0;
  height: 130px;
  background: #e4dcf7;
}

.content {
  flex: 7 1 0;
  height: 130px;
  background: #cfe4f7;
}

.action {
  flex: 2 1 0;
  height: 70px;
  background: #f1dce5;
}`,
    editor: { category: "Content" },
  },
  {
    id: "media-object-grid",
    name: "Media Object - Grid",
    description:
      "Thumbnail, flexible content, and trailing action using CSS Grid.",
    type: "grid",
    inTheWild,
    html: `<div class="container">
  <section class="thumbnail">Thumbnail</section>
  <section class="content">Content</section>
  <section class="action">Action</section>
</div>`,
    css: `.container {
  box-sizing: border-box;

  /* Grid tracks mirror the 2/7/2 horizontal proportions. */
  display: grid;
  grid-template-columns: 2fr 7fr 2fr;
  align-items: center;
  gap: 20px;

  width: 100%;
  height: 100%;
  padding: 24px;
  margin: 0 auto;
}

.thumbnail,
.content,
.action {
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid #a8afb9;
  border-radius: 8px;
  padding: 16px;
}

.thumbnail {
  height: 130px;
  background: #e4dcf7;
}

.content {
  height: 130px;
  background: #cfe4f7;
}

.action {
  height: 70px;
  background: #f1dce5;
}`,
    editor: { category: "Content" },
  },
] satisfies PresetSource[];
