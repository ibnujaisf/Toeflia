export default function PracticeSkeleton() {
  return (
    <div className="px-6 md:px-10 py-8 min-h-screen">
      <div className="max-w-5xl">

        {/* Page Header */}
        <div className="mb-10">
          <div className="h-3 w-16 rounded bg-zinc-200/70 dark:bg-zinc-700/50 mb-3" />
          <div className="h-9 w-72 rounded-lg bg-zinc-200/70 dark:bg-zinc-700/50 mb-2" />
          <div className="h-4 w-80 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-7 flex flex-col"
            >
              {/* Icon + title */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="flex-1 pt-1">
                  <div className="h-5 w-full rounded bg-zinc-200/70 dark:bg-zinc-700/50 mb-1.5" />
                  <div className="h-5 w-3/5 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                </div>
              </div>

              {/* Questions & time info */}
              <div className="flex-1">
                <div className="space-y-1.5 mb-8">
                  <div className="h-3.5 w-28 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                  <div className="h-3.5 w-40 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                </div>
              </div>

              {/* CTA button */}
              <div className="w-full mt-auto h-[42px] rounded-2xl bg-zinc-200/70 dark:bg-zinc-700/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
