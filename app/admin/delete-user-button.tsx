"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/components/spinner";
import { deleteUserAction } from "./actions";

type DeleteUserButtonProps = {
  userId: string;
  userLabel: string;
};

export function DeleteUserButton({ userId, userLabel }: DeleteUserButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete ${userLabel}? This removes their account and all of their posts. This can't be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const result = await deleteUserAction(userId);

      if ("error" in result) {
        window.alert(result.error);
        setDeleting(false);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Delete user error:", error);
      window.alert("Something went wrong while deleting this user.");
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting && <Spinner className="h-3.5 w-3.5" />}
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
