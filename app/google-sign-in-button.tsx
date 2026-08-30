"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/app/components/spinner";
import { GoogleIcon } from "./icons";

export function GoogleSignInButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-2xl border border-[#E5DDF8] bg-white px-6 text-[15px] font-semibold text-[#111827] shadow-[0_8px_20px_rgba(30,20,80,0.06)] transition hover:bg-[#FBFAFF] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
    >
      {pending ? (
        <>
          <Spinner className="h-[18px] w-[18px] text-[#6D3FEA]" />
          Redirecting to Google...
        </>
      ) : (
        <>
          <GoogleIcon />
          Continue with Google
        </>
      )}
    </button>
  );
}
