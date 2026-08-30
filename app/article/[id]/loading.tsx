export default function ArticleLoading() {
  return (
    <main className="flex-1 bg-white">
      <article className="mx-auto max-w-2xl animate-pulse px-5 py-10 sm:py-16">
        {/* Brand */}
        <div className="mb-12 h-4 w-20 rounded bg-neutral-100" />

        {/* Header */}
        <header className="mb-10">
          <div className="h-9 w-full rounded bg-neutral-200 sm:h-11" />
          <div className="mt-3 h-9 w-2/3 rounded bg-neutral-200 sm:h-11" />

          <div className="mt-5 flex items-center gap-2">
            <div className="h-3 w-20 rounded bg-neutral-100" />
            <div className="h-3 w-16 rounded bg-neutral-100" />
          </div>
        </header>

        {/* Content */}
        <div className="space-y-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="h-3 rounded bg-neutral-100"
              style={{ width: index % 3 === 2 ? "70%" : "100%" }}
            />
          ))}
        </div>
      </article>
    </main>
  );
}
 