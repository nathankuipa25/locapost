"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[60vh] outline-none text-base leading-7 text-neutral-800",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const savePost = async () => {
    setMessage("");

    if (!title.trim()) {
      setMessage("Please add a title.");
      return;
    }

    if (!editor.getText().trim()) {
      setMessage("Please write something first.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
          content: editor.getHTML(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save post.");
      }

      setMessage("Post saved successfully.");

      console.log("Saved post:", data.post);
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <a
            href="/"
            className="text-sm text-neutral-500 hover:text-black"
          >
            ← Back
          </a>

          <span className="text-sm font-medium">
            New post
          </span>

          <button
            onClick={savePost}
            disabled={saving}
            className="text-sm font-medium text-black disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </header>

        {/* Editor */}
        <section className="flex-1 px-5 py-8 sm:px-8 sm:py-10">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            className="w-full border-0 bg-transparent text-3xl font-semibold tracking-tight text-neutral-900 outline-none placeholder:text-neutral-300 sm:text-4xl"
          />

          {/* Toolbar */}
          <div className="sticky top-0 z-10 my-6 flex gap-1 overflow-x-auto border-y border-neutral-200 bg-[#fafafa] py-2">
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleBold().run()
              }
              className={`rounded-lg px-3 py-2 text-sm font-bold hover:bg-neutral-200 ${
                editor.isActive("bold")
                  ? "bg-neutral-200"
                  : ""
              }`}
            >
              B
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleItalic().run()
              }
              className={`rounded-lg px-3 py-2 text-sm italic hover:bg-neutral-200 ${
                editor.isActive("italic")
                  ? "bg-neutral-200"
                  : ""
              }`}
            >
              I
            </button>

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleBulletList()
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm hover:bg-neutral-200 ${
                editor.isActive("bulletList")
                  ? "bg-neutral-200"
                  : ""
              }`}
            >
              • List
            </button>

            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleOrderedList()
                  .run()
              }
              className={`rounded-lg px-3 py-2 text-sm hover:bg-neutral-200 ${
                editor.isActive("orderedList")
                  ? "bg-neutral-200"
                  : ""
              }`}
            >
              1. List
            </button>
          </div>

          {/* Content */}
          <EditorContent editor={editor} />

          {/* Status */}
          {message && (
            <p className="mt-6 text-sm text-neutral-500">
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}