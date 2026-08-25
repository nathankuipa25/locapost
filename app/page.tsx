import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  async function signInWithGoogle() {
    "use server";
    await signIn("google", { redirectTo: "/dashboard" });
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-white px-5">
      <div className="w-full max-w-sm text-center">
        <p className="mb-6 text-sm font-medium tracking-tight text-gray-900">
          LocaPost
        </p>

        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-gray-950">
          Write without limits.
          <br />
          Share with one link.
        </h1>

        <p className="mx-auto mt-5 max-w-xs text-sm leading-6 text-neutral-500">
          Sign in to write, publish, and manage your own articles.
        </p>

        <form action={signInWithGoogle} className="mt-8">
          <button
            type="submit"
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white px-6 text-sm font-medium text-gray-900 transition hover:bg-neutral-50 active:scale-[0.98]"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-xs leading-5 text-neutral-400">
          New here? Signing in with Google creates your account
          automatically — there&apos;s no separate registration step.
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}
