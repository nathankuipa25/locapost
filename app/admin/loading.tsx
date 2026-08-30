export default function AdminLoading() {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-2xl animate-pulse px-5 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between sm:mb-10">
          <div className="h-4 w-20 rounded bg-neutral-100" />
          <div className="h-4 w-12 rounded bg-neutral-200" />
          <div className="h-4 w-[92px]" />
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-[72px] rounded-2xl border border-neutral-100 bg-neutral-50"
            />
          ))}
        </div>

        {/* Users */}
        <div className="mb-4 h-3 w-14 rounded bg-neutral-100" />
        <ul className="mb-12 divide-y divide-neutral-100">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="py-4 first:pt-0">
              <div className="h-4 w-1/2 rounded bg-neutral-200" />
              <div className="mt-3 h-3 w-1/3 rounded bg-neutral-100" />
            </li>
          ))}
        </ul>

        {/* Posts */}
        <div className="mb-4 h-3 w-20 rounded bg-neutral-100" />
        <ul className="divide-y divide-neutral-100">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="py-4 first:pt-0">
              <div className="h-4 w-3/4 rounded bg-neutral-200" />
              <div className="mt-3 h-3 w-1/2 rounded bg-neutral-100" />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
