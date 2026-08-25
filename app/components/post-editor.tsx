"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type PostEditorProps =
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      postId: string;
      initialContentJson: JSONContent;
    };

export function PostEditor(props: PostEditorProps) {
  const router = useRouter();

  const [shareUrl, setShareUrl] = useState("");
  const [shareTitle, setShareTitle] = useState("");
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

    content: props.mode === "edit" ? props.initialContentJson : "",

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[420px] outline-none text-[17px] leading-8 text-gray-800",
      },
    },

    onUpdate: () => {
      // If a published link is showing and the user starts writing a
      // new article, clear the old share card instead of leaving it
      // stuck at the top while a fresh draft is being written below.
      setShareUrl((current) => (current ? "" : current));
      setMessage((current) => (current ? "" : current));
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

    // Prefer the first paragraph or heading with actual text content,
    // but fall back to the first text-bearing node of any type so
    // articles that open with a heading (or list, quote, etc.) still
    // get a usable title instead of failing validation.
    const firstTextNode =
      json.content?.find(
        (node) =>
          (node.type === "paragraph" || node.type === "heading") &&
          Array.isArray(node.content) &&
          node.content.length > 0
      ) ??
      json.content?.find(
        (node) => Array.isArray(node.content) && node.content.length > 0
      );

    if (!firstTextNode || !Array.isArray(firstTextNode.content)) {
      return "";
    }

    return firstTextNode.content
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
      const endpoint =
        props.mode === "edit" ? `/api/posts/${props.postId}` : "/api/posts";
      const method = props.mode === "edit" ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,

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
          data.error ||
            (props.mode === "edit"
              ? "Something went wrong while saving."
              : "Something went wrong while publishing.")
        );
      }

      if (props.mode === "edit") {
        setMessage("Changes saved.");
        router.push(`/article/${props.postId}`);
        return;
      }

      const postUrl = `${window.location.origin}/article/${data.post.id}`;

      editor.commands.clearContent();

      setShareUrl(postUrl);
      setShareTitle(title);
      setMessage("Article published successfully 🎉");
    } catch (error) {
      console.error("Save error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const shareLink = async () => {
    if (!shareUrl) return;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
        return;
      } catch {
        // User cancelled the native share sheet — nothing to do.
        return;
      }
    }

    await copyLink();
  };

  const copyLink = async () => {
    if (!shareUrl) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setMessage("Link copied!");
    } catch {
      setMessage("Unable to copy link.");
    }
  };

  if (!editor) {
    return (
      <main className="flex-1 bg-white">
        <div className="mx-auto w-full max-w-2xl px-5 py-6">
          <p className="text-sm text-gray-400">Loading editor...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-white">
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

          <Link href="/" className="text-sm font-semibold text-gray-900">
            LocaPost
          </Link>

          <button
            type="button"
            onClick={savePost}
            disabled={saving}
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? props.mode === "edit"
                ? "Saving..."
                : "Publishing..."
              : props.mode === "edit"
                ? "Save changes"
                : "Publish"}
          </button>
        </header>

        {/* Writing area */}
        <section>
          <p className="mb-5 text-sm text-gray-400">Start writing...</p>

          <EditorContent editor={editor} />
        </section>

        {/* Formatting toolbar */}
        <div className="sticky bottom-4 mt-8 flex gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
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
            onClick={() => editor.chain().focus().toggleItalic().run()}
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
              editor.chain().focus().toggleHeading({ level: 2 }).run()
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
            onClick={() => editor.chain().focus().toggleBulletList().run()}
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
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
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
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
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
          <p className="mt-4 text-center text-sm text-gray-500">{message}</p>
        )}

        {/* Share card — publish flow only */}
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

            <p className="mb-2 mt-4 text-xs font-medium text-gray-500">
              Share your article
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={shareLink}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Share
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${shareTitle} ${shareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                WhatsApp
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  shareTitle
                )}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                X
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
