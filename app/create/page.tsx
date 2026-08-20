"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function CreatePage() {
  const router = useRouter();

  const [shareUrl, setShareUrl] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],

    content: "",

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[420px] outline-none text-[17px] leading-8 text-gray-800",
      },
    },
  });

  /*
   * Use the first meaningful paragraph as the article title.
   * Tiptap's JSON nodes don't all have a `text` property,
   * so we cast after filtering by type.
   */
  const getTitle = () => {
    if (!editor) return "";

    const json = editor.getJSON();

    const firstParagraph = json.content?.find(
      (node) =>
        node.type === "paragraph" &&
        Array.isArray(node.content) &&
        node.content.length > 0
    );

    if (!firstParagraph || !Array.isArray(firstParagraph.content)) {
      return "";
    }

    return firstParagraph.content
      .filter((node) => node.type === "text")
      .map((node) => (node as { text: string }).text)
      .join("")
      .trim()
      .slice(0, 100);
  };

  const savePost = async () => {
    if (!editor) {
      setMessage("Editor is not ready.");
      return;
    }

    const content = editor.getText().trim();

    if (!content) {
      setMessage("Start writing your article first.");
      return;
    }

    const title = getTitle();

    if (!title) {
      setMessage("Start your article with some text.");
      return;
    }

    setSaving(true);
    setMessage("");
    setShareUrl("");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
          content,
          contentJson: editor.getJSON(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong while publishing."
        );
      }

      const postUrl = `\( {window.location.origin}/article/ \){data.post.id}`;

      setShareUrl(postUrl);
      setMessage("Article published successfully 🎉");

      editor.commands.clearContent();
    } catch (error) {
      console.error("Publish error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while publishing."
      );
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);

      setMessage("Link copied!");
    } catch {
      setMessage("Unable to copy link.");
    }
  };

  if (!editor) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto w-full max-w-2xl px-5 py-6">
          <p className="text-sm text-gray-400">
            Loading editor...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-2xl px-5 py-5">

        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-500 transition hover:text-gray-900"
          >
            ← Back
          </button>

          <span className="text-sm font-semibold text-gray-900">
            New article
          </span>

          <button
            type="button"
            onClick={savePost}
            disabled={saving}
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Publishing..." : "Publish"}
          </button>
        </header>

        {/* Writing area */}
        <section>
          <p className="mb-5 text-sm text-gray-400">
            Start writing...
          </p>

          <EditorContent editor={editor} />
        </section>

        {/* Formatting toolbar */}
        <div className="sticky bottom-4 mt-8 flex gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">

          {/* Bold */}
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleBold().run()
            }
            className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
              editor.isActive("bold")
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            B
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleItalic().run()
            }
            className={`rounded-lg px-3 py-2 text-sm italic transition ${
              editor.isActive("italic")
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            I
          </button>

          {/* Heading */}
          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 2 })
                .run()
            }
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              editor.isActive("heading", { level: 2 })
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            H2
          </button>

          {/* Bullet list */}
          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBulletList()
                .run()
            }
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
              editor.isActive("bulletList")
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            • List
          </button>

          {/* Ordered list */}
          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleOrderedList()
                .run()
            }
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
              editor.isActive("orderedList")
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            1. List
          </button>

          {/* Quote */}
          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBlockquote()
                .run()
            }
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
              editor.isActive("blockquote")
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Quote
          </button>
        </div>

        {/* Status message */}
        {message && (
          <p className="mt-4 text-center text-sm text-gray-500">
            {message}
          </p>
        )}

        {/* Share card */}
        {shareUrl && (
          <div className="mt-5 rounded-2xl border border-gray-200 p-4">
            <p className="mb-3 text-sm font-semibold text-gray-900">
              Your article is live 🎉
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="min-w-0 flex-1 rounded-xl bg-gray-100 px-3 py-2 text-xs text-gray-600 outline-none"
              />

              <button
                type="button"
                onClick={copyLink}
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}