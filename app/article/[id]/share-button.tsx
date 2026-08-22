"use client";

import { useState } from "react";

type ArticleShareButtonProps = {
  url: string;
  title: string;
};

export function ArticleShareButton({ url, title }: ArticleShareButtonProps) {
  const [status, setStatus] = useState("");

  const showStatus = (text: string) => {
    setStatus(text);
    setTimeout(() => setStatus(""), 2000);
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled the native share sheet — nothing to do.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      showStatus("Link copied");
    } catch {
      showStatus("Unable to copy link.");
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
      >
        Share
      </button>

      {status && <span className="text-xs text-gray-400">{status}</span>}
    </span>
  );
}
