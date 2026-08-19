"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function CreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
  });

  const savePost = async () => {
    if (!title.trim()) {
      setMessage("Please enter a title.");
      return;
    }

    if (!editor) {
      setMessage("Editor is not ready.");
      return;
    }

    const content = editor.getText().trim();

    if (!content) {
      setMessage("Please write something first.");
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
          title: title.trim(),
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong while saving the post."
        );
      }

      const postUrl = `${window.location.origin}/p/${data.post.id}`;

      setShareUrl(postUrl);
      setMessage("Post published successfully.");

      setTitle("");
      editor.commands.clearContent();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the post."
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

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-2xl px-5 py-6">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-500"
          >
            ← Back
          </button>

          <h1 className="text-base font-semibold text-gray-900">
            Create
          </h1>

          <div className="w-10" />
        </header>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Post title"
          className="w-full border-0 bg-transparent text-3xl font-bold tracking-tight text-gray-900 outline-none placeholder:text-gray-300"
        />

        {/* Editor */}
        <div className="mt-6 min-h-[300px]">
          <EditorContent
            editor={editor}
            className="prose prose-gray max-w-none text-gray-800 outline-none"
          />
        </div>

        {/* Status */}
        {message && (
          <p className="mt-4 text-sm text-gray-500">
            {message}
          </p>
        )}

        {/* Share card */}
        {shareUrl && (
          <div className="mt-6 rounded-xl border border-gray-200 p-4">
            <p className="mb-3 text-sm font-medium text-gray-900">
              Your LocaPost is live 🎉
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="min-w-0 flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600 outline-none"
              />

              <button
                type="button"
                onClick={copyLink}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Save */}
        <button
          type="button"
          onClick={savePost}
          disabled={saving}
          className="mt-8 w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Publishing..." : "Publish"}
        </button>
      </div>
    </main>
  );
}