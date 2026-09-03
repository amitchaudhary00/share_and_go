// utils/sanitizeNoteContent.mjs
import sanitizeHtml from "sanitize-html";

export function sanitizeNoteContent(html) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "h1",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "a",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https"],
  });
}
