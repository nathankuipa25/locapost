import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import {
  ShieldIcon,
  LockIcon,
  LinkIcon,
  SlidersIcon,
  SparkleIcon,
} from "./icons";
import { GoogleSignInButton } from "./google-sign-in-button";

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
    <main className="flex-1 bg-[#FCFCFE]">
      <div className="mx-auto w-full max-w-[760px] px-6 pb-14 pt-8 sm:px-10 sm:pt-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-[#111827] sm:text-2xl">
            LocaPost
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5DDF8] bg-[#F4F0FF] px-3 py-1.5 text-xs font-medium text-[#6D3FEA]">
            <ShieldIcon />
            Private by default
          </span>
        </div>

        {/* Hero heading */}
        <div className="mt-10 text-center sm:mt-14">
          <h1 className="text-[2.25rem] font-extrabold leading-[1.08] tracking-tight text-[#111827] sm:text-[3.25rem]">
            Write without limits.
            <br />
            Share with{" "}
            <span className="bg-[linear-gradient(135deg,_#9B7BFF,_#5B2BD6)] bg-clip-text text-transparent">
              one link.
            </span>
          </h1>

          {/* Hero description */}
          <p className="mx-auto mt-6 max-w-[320px] text-[15px] leading-[1.6] text-[#626774] sm:max-w-[420px] sm:text-[17px]">
            LocaPost is your private space to write, publish, and share
            articles on your terms.
          </p>
        </div>

        {/* Illustration */}
        <div className="relative mx-auto mt-10 flex h-[260px] w-full max-w-[300px] items-center justify-center sm:h-[300px] sm:max-w-[340px]">
          {/* Soft lavender wave behind everything */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[85%] rounded-[3rem] bg-gradient-to-b from-[#F4F0FF] to-transparent"
          />

          <svg
            viewBox="0 0 240 280"
            className="relative h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="badgeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#9B7BFF" />
                <stop offset="100%" stopColor="#5B2BD6" />
              </linearGradient>

              <filter
                id="cardShadow"
                x="-40%"
                y="-40%"
                width="180%"
                height="180%"
              >
                <feDropShadow
                  dx="0"
                  dy="10"
                  stdDeviation="10"
                  floodColor="#1e1450"
                  floodOpacity="0.14"
                />
              </filter>
            </defs>

            {/* Decorative curved line entering from the left, behind the card */}
            <path
              d="M-10 130 C 25 108, 45 150, 70 138"
              fill="none"
              stroke="#E5DDF8"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Decorative curved line on the right, behind the card */}
            <path
              d="M195 55 C 222 72, 214 100, 245 92"
              fill="none"
              stroke="#E5DDF8"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Dashed curved path wrapping the lower-left of the card */}
            <path
              d="M35 205 C 0 235, 30 268, 85 258 S 150 235, 150 215"
              fill="none"
              stroke="#C4B5FD"
              strokeWidth="2"
              strokeDasharray="5 6"
              strokeLinecap="round"
            />

            {/* Article card */}
            <g transform="rotate(-3 120 130)" filter="url(#cardShadow)">
              <rect
                x="30"
                y="20"
                width="150"
                height="195"
                rx="22"
                fill="white"
                stroke="#F0EBFF"
                strokeWidth="1.5"
              />

              {/* Image placeholder icon, top-left */}
              <rect x="52" y="44" width="36" height="36" rx="10" fill="#F4F0FF" />
              <circle cx="62" cy="55" r="3.5" fill="#9B7BFF" />
              <path
                d="M55 73 L67 59 L75 68 L83 57 L88 73 Z"
                fill="#9B7BFF"
              />

              {/* Three short title lines beside the icon */}
              <rect x="98" y="50" width="58" height="5" rx="2.5" fill="#E9E7F2" />
              <rect x="98" y="62" width="46" height="5" rx="2.5" fill="#E9E7F2" />
              <rect x="98" y="74" width="38" height="5" rx="2.5" fill="#E9E7F2" />

              {/* Body content lines, varying widths */}
              <rect x="52" y="108" width="106" height="5" rx="2.5" fill="#EDEDF2" />
              <rect x="52" y="122" width="106" height="5" rx="2.5" fill="#EDEDF2" />
              <rect x="52" y="136" width="92" height="5" rx="2.5" fill="#EDEDF2" />
              <rect x="52" y="150" width="106" height="5" rx="2.5" fill="#EDEDF2" />
              <rect x="52" y="164" width="70" height="5" rx="2.5" fill="#EDEDF2" />
            </g>

            {/* Small purple decorative strokes near the top-right of the card */}
            <g stroke="#9B7BFF" strokeWidth="2" strokeLinecap="round">
              <line x1="196" y1="18" x2="204" y2="10" />
              <line x1="204" y1="22" x2="212" y2="18" />
              <line x1="198" y1="30" x2="203" y2="34" />
            </g>

            {/* Link badge, overlapping the card's lower-right corner */}
            <g transform="rotate(6 175 215)">
              <rect
                x="140"
                y="185"
                width="70"
                height="60"
                rx="18"
                fill="url(#badgeGrad)"
              />

              <g
                transform="translate(157 202)"
                stroke="white"
                strokeWidth="2.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 17H6a5 5 0 0 1 0-10h3" />
                <path d="M14 7h3a5 5 0 0 1 0 10h-3" />
                <line x1="8" y1="12" x2="15" y2="12" />
              </g>
            </g>
          </svg>
        </div>

        {/* Three product benefits */}
        <div className="mt-8 grid grid-cols-3 divide-x divide-[#E5DDF8] text-center sm:mt-10">
          <Feature icon={<LockIcon />} label="Your content stays private" />
          <Feature icon={<LinkIcon />} label="Share with one simple link" />
          <Feature icon={<SlidersIcon />} label="You're in full control" />
        </div>

        {/* Google authentication */}
        <form action={signInWithGoogle} className="mt-9 sm:mt-11">
          <GoogleSignInButton />
        </form>

        {/* Security reassurance */}
        <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-[#6D3FEA]">
          <ShieldIcon />
          Secure, fast, and password-free
        </p>

        {/* New user card */}
        <div className="mt-8 flex items-start gap-3.5 rounded-2xl border border-[#E5DDF8] bg-[#F9F7FF] p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4F0FF]">
            <SparkleIcon />
          </div>

          <div>
            <p className="text-base font-bold text-[#111827]">New here?</p>
            <p className="mt-1 text-[15px] leading-6 text-[#626774]">
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
    <div className="flex flex-col items-center gap-2.5 px-1">
      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#F4F0FF] text-[#6D3FEA] sm:h-14 sm:w-14">
        {icon}
      </div>
      <p className="text-[12px] font-semibold leading-4 text-[#111827] sm:text-[13px]">
        {label}
      </p>
    </div>
  );
}
