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
    <main className="flex-1 bg-gradient-to-b from-violet-50 via-white to-white">
      <div className="mx-auto w-full max-w-sm px-5 pb-12 pt-8 sm:max-w-md sm:pt-12">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between sm:mb-10">
          <span className="text-base font-bold tracking-tight text-gray-950">
            LocaPost
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700">
            <ShieldIcon />
            Private by default
          </span>
        </div>

        {/* Hero copy */}
        <div className="text-center">
          <h1 className="text-[2.25rem] font-extrabold leading-[1.1] tracking-tight text-gray-950 sm:text-5xl">
            Write without limits.
            <br />
            Share with{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
              one link.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xs text-[15px] leading-6 text-neutral-500">
            LocaPost is your private space to write, publish, and share
            articles on your terms.
          </p>
        </div>

        {/* Hero illustration */}
        <div className="relative mx-auto mt-10 flex h-56 w-full max-w-[260px] items-center justify-center sm:h-64 sm:max-w-xs">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-violet-200/60 via-violet-100/40 to-transparent blur-2xl"
          />

          <svg
            viewBox="0 0 280 220"
            className="relative h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="badgeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>

              <filter
                id="cardShadow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feDropShadow
                  dx="0"
                  dy="10"
                  stdDeviation="10"
                  floodColor="#7c3aed"
                  floodOpacity="0.18"
                />
              </filter>
            </defs>

            {/* Dashed connector looping from the card to the link badge */}
            <path
              d="M95 172 C 55 192, 118 210, 160 192 S 208 168, 204 152"
              fill="none"
              stroke="#c4b5fd"
              strokeWidth="2"
              strokeDasharray="5 6"
              strokeLinecap="round"
            />

            {/* Document card */}
            <g transform="rotate(-4 140 108)" filter="url(#cardShadow)">
              <rect
                x="80"
                y="35"
                width="130"
                height="150"
                rx="18"
                fill="white"
                stroke="#ede9fe"
                strokeWidth="1.5"
              />

              {/* Image placeholder icon */}
              <rect x="98" y="53" width="32" height="32" rx="8" fill="#ede9fe" />
              <circle cx="107" cy="63" r="3.5" fill="#c4b5fd" />
              <path d="M100 79 L110 67 L117 74 L124 65 L128 79 Z" fill="#c4b5fd" />

              {/* Title lines beside the icon */}
              <rect x="138" y="58" width="52" height="5" rx="2.5" fill="#ede9fe" />
              <rect x="138" y="70" width="36" height="5" rx="2.5" fill="#ede9fe" />

              {/* Body text lines */}
              <rect x="98" y="102" width="94" height="5" rx="2.5" fill="#f3f4f6" />
              <rect x="98" y="114" width="94" height="5" rx="2.5" fill="#f3f4f6" />
              <rect x="98" y="126" width="66" height="5" rx="2.5" fill="#f3f4f6" />
            </g>

            {/* Sparkle accent */}
            <path
              d="M200 24 L202.5 30 L208 32.5 L202.5 35 L200 41 L197.5 35 L192 32.5 L197.5 30 Z"
              fill="#a78bfa"
            />

            {/* Link badge */}
            <g transform="rotate(8 208 170)">
              <rect
                x="188"
                y="150"
                width="40"
                height="40"
                rx="12"
                fill="url(#badgeGrad)"
              />

              <g
                transform="translate(198 160)"
                stroke="white"
                strokeWidth="2.2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 15H5a4.5 4.5 0 0 1 0-9h2" />
                <path d="M12 6h2a4.5 4.5 0 0 1 0 9h-2" />
                <line x1="7" y1="10.5" x2="13" y2="10.5" />
              </g>
            </g>
          </svg>
        </div>

        {/* Feature row */}
        <div className="mt-10 grid grid-cols-3 divide-x divide-neutral-200 text-center sm:mt-12">
          <div className="px-1">
            <Feature icon={<LockIcon />} label="Your content stays private" />
          </div>
          <div className="px-1">
            <Feature icon={<LinkIcon small />} label="Share with one simple link" />
          </div>
          <div className="px-1">
            <Feature icon={<SlidersIcon />} label="You're in full control" />
          </div>
        </div>

        {/* Sign in */}
        <form action={signInWithGoogle} className="mt-10">
          <button
            type="submit"
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white px-6 text-[15px] font-medium text-gray-900 shadow-sm transition hover:bg-neutral-50 active:scale-[0.98]"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-violet-600">
          <ShieldIcon />
          Secure, fast, and password-free
        </p>

        {/* New here card */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-violet-50 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100">
            <SparkleIcon />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">New here?</p>
            <p className="mt-0.5 text-sm leading-5 text-neutral-500">
              Signing in with Google creates your account automatically — no
              separate registration.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Feature({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
        {icon}
      </div>
      <p className="text-[11px] leading-4 text-neutral-500">{label}</p>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function LinkIcon({ small }: { small?: boolean }) {
  const size = small ? 18 : 20;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={small ? "" : "text-white"}
      aria-hidden="true"
    >
      <path d="M9 17H7a5 5 0 0 1 0-10h2" />
      <path d="M15 7h2a5 5 0 0 1 0 10h-2" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="11" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-violet-600"
      aria-hidden="true"
    >
      <path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6L12 2Z" />
      <path d="M19 15l.9 2.7L22 18.5l-2.1.8L19 22l-.9-2.7L16 18.5l2.1-.8L19 15Z" />
    </svg>
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
