export default function DashboardLoading() {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-2xl animate-pulse px-5 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between sm:mb-10">
          <div className="h-4 w-20 rounded bg-neutral-200" />
          <div className="h-4 w-16 rounded bg-neutral-100" />
        </div>

        {/* Account + primary action */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-4 w-40 rounded bg-neutral-100" />
          <div className="h-11 w-28 rounded-xl bg-neutral-200 sm:self-auto" />
        </div>

        {/* Post list */}
        <ul className="divide-y divide-neutral-100">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="py-4 first:pt-0 sm:py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-3/4 rounded bg-neutral-200" />
                  <div className="mt-3 h-3 w-1/2 rounded bg-neutral-100" />
                </div>
                <div className="h-4 w-14 shrink-0 rounded bg-neutral-100" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
