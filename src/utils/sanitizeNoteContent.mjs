
import sanitizeHtml from "sanitize-html";

export function sanitizeNoteContent(html) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "strong",
      "em",
      "u",
      "s",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "blockquote",
      "br",
      "a",
      "code",
      "pre",
      "hr",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https"],
  });
}
