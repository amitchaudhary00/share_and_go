console.log("📝 Quill editor loading...");

const initialContentElement = document.getElementById("initial-content");
const contentInput = document.getElementById("content-input");
const form = document.getElementById("note-form");

const initialContent = initialContentElement?.value?.trim() || "";

const quill = new Quill("#editor", {
  theme: "",
  placeholder: "Start writing your note...",
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link"],
    ],
  },
});

// Load initial content (e.g. re-showing a form after a validation error)
if (initialContent) {
  quill.clipboard.dangerouslyPasteHTML(initialContent);
}

function updateContent() {
  contentInput.value = quill.root.innerHTML;
}

quill.on("text-change", updateContent);

form.addEventListener("submit", (event) => {
  updateContent();

  if (quill.getText().trim().length === 0) {
    event.preventDefault();
    alert("Note content cannot be empty");
    quill.focus();
  }
});

console.log("Quill ready");
