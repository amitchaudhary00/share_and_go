import { Editor } from "https://esm.sh/@tiptap/core@2.5.9";
import StarterKit from "https://esm.sh/@tiptap/starter-kit@2.5.9";
import Placeholder from "https://esm.sh/@tiptap/extension-placeholder@2.5.9";
import Underline from "https://esm.sh/@tiptap/extension-underline@2.5.9";
import Link from "https://esm.sh/@tiptap/extension-link@2.5.9";

console.log("🔥 Tiptap editor loading...");

const editorElement = document.getElementById("editor");
const contentInput = document.getElementById("content-input");
const form = document.getElementById("note-form");
const initialContentElement = document.getElementById("initial-content");
const toolbar = document.getElementById("toolbar");
const headingSelect = document.getElementById("heading-select");

if (!editorElement) throw new Error("Tiptap: #editor not found");
if (!contentInput) throw new Error("Tiptap: #content-input not found");
if (!form) throw new Error("Tiptap: #note-form not found");

const initialContent = initialContentElement?.value?.trim() || "<p></p>";

const editor = new Editor({
  element: editorElement,
  editable: true,

  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: "Start writing your note...",
    }),
    Underline,
    Link.configure({ openOnClick: false }),
  ],

  content: initialContent,

  onCreate({ editor }) {
    console.log("✅ Tiptap initialized");
    updateContent();
    updateToolbar();
  },

  onUpdate({ editor }) {
    updateContent();
    updateToolbar();
  },

  onSelectionUpdate() {
    updateToolbar();
  },
});

function updateContent() {
  contentInput.value = editor.getHTML();
}

/* ================= TOOLBAR ACTIONS ================= */

toolbar.querySelectorAll("[data-cmd]").forEach((button) => {
  button.addEventListener("mousedown", (event) => {
    event.preventDefault(); // don't steal focus/selection from editor
  });

  button.addEventListener("click", () => {
    const command = button.dataset.cmd;
    const chain = editor.chain().focus();

    switch (command) {
      case "undo":
        chain.undo().run();
        break;
      case "redo":
        chain.redo().run();
        break;
      case "bold":
        chain.toggleBold().run();
        break;
      case "italic":
        chain.toggleItalic().run();
        break;
      case "underline":
        chain.toggleUnderline().run();
        break;
      case "strike":
        chain.toggleStrike().run();
        break;
      case "code":
        chain.toggleCode().run();
        break;
      case "bulletList":
        chain.toggleBulletList().run();
        break;
      case "orderedList":
        chain.toggleOrderedList().run();
        break;
      case "blockquote":
        chain.toggleBlockquote().run();
        break;
      case "link":
        addLink();
        break;
    }

    updateContent();
    updateToolbar();
  });
});

/* ================= HEADING DROPDOWN ================= */

headingSelect.addEventListener("mousedown", (event) => {
  event.stopPropagation();
});

headingSelect.addEventListener("change", () => {
  const value = headingSelect.value;
  const chain = editor.chain().focus();

  if (value === "paragraph") {
    chain.setParagraph().run();
  } else {
    chain.setHeading({ level: Number(value) }).run();
  }

  updateContent();
  updateToolbar();
});

/* ================= ACTIVE STATE ================= */

function updateToolbar() {
  setActive("bold", editor.isActive("bold"));
  setActive("italic", editor.isActive("italic"));
  setActive("underline", editor.isActive("underline"));
  setActive("strike", editor.isActive("strike"));
  setActive("code", editor.isActive("code"));
  setActive("bulletList", editor.isActive("bulletList"));
  setActive("orderedList", editor.isActive("orderedList"));
  setActive("blockquote", editor.isActive("blockquote"));

  if (editor.isActive("heading", { level: 1 })) {
    headingSelect.value = "1";
  } else if (editor.isActive("heading", { level: 2 })) {
    headingSelect.value = "2";
  } else if (editor.isActive("heading", { level: 3 })) {
    headingSelect.value = "3";
  } else {
    headingSelect.value = "paragraph";
  }
}

function setActive(command, active) {
  const button = toolbar.querySelector(`[data-cmd="${command}"]`);
  if (!button) return;
  button.classList.toggle("active", active);
}

/* ================= LINK ================= */

function addLink() {
  const previousUrl = editor.getAttributes("link").href || "";
  const url = window.prompt("Enter URL", previousUrl);

  if (url === null) return;

  if (url === "") {
    editor.chain().focus().unsetLink().run();
    return;
  }

  editor.chain().focus().setLink({ href: url }).run();
}

/* ================= FORM SUBMIT ================= */

form.addEventListener("submit", (event) => {
  if (editor.isEmpty) {
    event.preventDefault();
    alert("Note content cannot be empty");
    editor.commands.focus();
    return;
  }

  updateContent();
});

console.log("Editor editable:", editor.isEditable);
