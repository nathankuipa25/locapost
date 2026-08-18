export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 sm:px-8">
      <div className="w-full max-w-md text-center sm:max-w-lg">
        <p className="mb-8 text-sm font-medium tracking-tight sm:mb-10">
          LocaPost
        </p>

        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Write without limits.
          <br />
          Share with one link.
        </h1>

        <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-neutral-500 sm:mt-6 sm:text-base sm:leading-7">
          Create rich content and share it anywhere with a single link.
        </p>

        <a
          href="/create"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-black px-6 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98] sm:mt-8"
        >
          Create a post
        </a>

        <p className="mt-5 text-xs text-neutral-400">
          Simple. Fast. Yours.
        </p>
      </div>
    </main>
  );
}