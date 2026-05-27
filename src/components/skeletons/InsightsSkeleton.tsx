export function InsightsSkeleton() {
  return (
    <div className="px-6 md:px-10 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <div className="h-3 w-16 rounded bg-zinc-200/70 dark:bg-zinc-700/50 mb-3" />
        <div className="h-9 w-60 rounded-lg bg-zinc-200/70 dark:bg-zinc-700/50 mb-3" />
        <div className="space-y-2 max-w-2xl">
          <div className="h-3.5 w-full rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
          <div className="h-3.5 w-4/5 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
        </div>
      </div>

      {/* Insight cards */}
      <div className="flex flex-col gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-[32px] p-6 md:p-8"
          >
            {/* Card Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-6 border-b border-zinc-200/30 dark:border-zinc-700/30">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="h-5 w-48 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                  <div className="h-5 w-20 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-20 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                  <div className="h-3 w-1 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                  <div className="h-3 w-28 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                </div>
              </div>
              <div className="shrink-0 h-9 w-32 rounded-full bg-zinc-200/70 dark:bg-zinc-700/50" />
            </div>

            {/* AI Summary Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-3 w-36 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
              </div>
              <div className="p-4 md:p-5 rounded-2xl border border-zinc-200/30 dark:border-zinc-700/30 border-l-2 border-l-zinc-300/50 dark:border-l-zinc-600/50 space-y-2">
                <div className="h-3.5 w-full rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-3.5 w-full rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-3.5 w-5/6 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-3.5 w-3/4 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
              </div>
            </div>

            {/* Actionable Tips Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-3 w-28 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    className="border border-zinc-200/30 dark:border-zinc-700/30 p-3.5 rounded-2xl flex items-start gap-3"
                  >
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-zinc-200/70 dark:bg-zinc-700/50 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-full rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                      <div className="h-3 w-4/5 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InsightsSkeletonCard() {
  return (
      <div className="flex flex-col gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-[32px] p-6 md:p-8"
          >
            {/* Card Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-6 border-b border-zinc-200/30 dark:border-zinc-700/30">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="h-5 w-48 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                  <div className="h-5 w-20 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-20 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                  <div className="h-3 w-1 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                  <div className="h-3 w-28 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                </div>
              </div>
              <div className="shrink-0 h-9 w-32 rounded-full bg-zinc-200/70 dark:bg-zinc-700/50" />
            </div>

            {/* AI Summary Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-3 w-36 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
              </div>
              <div className="p-4 md:p-5 rounded-2xl border border-zinc-200/30 dark:border-zinc-700/30 border-l-2 border-l-zinc-300/50 dark:border-l-zinc-600/50 space-y-2">
                <div className="h-3.5 w-full rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-3.5 w-full rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-3.5 w-5/6 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-3.5 w-3/4 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
              </div>
            </div>

            {/* Actionable Tips Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-3 w-28 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    className="border border-zinc-200/30 dark:border-zinc-700/30 p-3.5 rounded-2xl flex items-start gap-3"
                  >
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-zinc-200/70 dark:bg-zinc-700/50 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-full rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                      <div className="h-3 w-4/5 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
  );
}


