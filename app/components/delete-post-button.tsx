"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeletePostButtonProps = {
  postId: string;
  postTitle: string;
};

export function DeletePostButton({
  postId,
  postTitle,
}: DeletePostButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${postTitle}"? This can't be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete article.");
      }

      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting."
      );
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
