export default function EditLoading() {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-2xl animate-pulse px-5 py-5">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="h-4 w-12 rounded bg-neutral-100" />
          <div className="h-4 w-20 rounded bg-neutral-200" />
          <div className="h-11 w-28 rounded-full bg-neutral-200" />
        </header>

        {/* Writing area */}
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-neutral-200" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-3 rounded bg-neutral-100"
              style={{ width: index % 4 === 3 ? "60%" : "100%" }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
