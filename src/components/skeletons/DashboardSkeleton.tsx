export default function DashboardSkeleton() {
  return (
    <>
      {/* ── Top bar (Mobile only) ── */}
      <div className="lg:hidden sticky top-0 z-20 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/60 px-6 py-4 flex items-center justify-end">
        <div className="w-4 h-4 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
      </div>

      <div className="px-6 md:px-10 py-8 max-w-5xl">
        {/* Page header */}
        <div className="mb-8">
          <div className="h-3 w-20 rounded bg-zinc-200/70 dark:bg-zinc-700/50 mb-3" />
          <div className="h-8 w-72 rounded-lg bg-zinc-200/70 dark:bg-zinc-700/50 mb-2" />
          <div className="h-4 w-80 rounded bg-zinc-200/70 dark:bg-zinc-700/50 mt-2" />
        </div>

        {/* Welcome banner */}
        <div className="animate-pulse bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-7 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="h-3 w-24 rounded bg-zinc-200/70 dark:bg-zinc-700/50 mb-3" />
              <div className="h-7 w-56 rounded-lg bg-zinc-200/70 dark:bg-zinc-700/50 mb-2" />
              <div className="space-y-2 mt-2 max-w-lg">
                <div className="h-3.5 w-full rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-3.5 w-3/4 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
              </div>
            </div>

            {/* Overall Accuracy placeholder */}
            <div className="shrink-0 flex flex-col items-center mt-6 md:mt-0 md:pl-6">
              <div className="h-3 w-24 rounded bg-zinc-200/70 dark:bg-zinc-700/50 mb-3" />
              <div className="h-16 w-24 rounded-2xl bg-zinc-200/70 dark:bg-zinc-700/50" />
            </div>
          </div>
        </div>

        {/* Performance Overview grid */}
        <div className="mb-6">
          <div className="h-5 w-44 rounded bg-zinc-200/70 dark:bg-zinc-700/50 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 shrink-0 rounded-2xl bg-zinc-200/70 dark:bg-zinc-700/50" />
                  <div className="h-4 w-32 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                </div>
                <div className="pt-4 border-t border-zinc-200/30 dark:border-zinc-700/30 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <div className="h-4 w-10 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                    <div className="h-3 w-12 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                  </div>
                  <div className="h-5 w-10 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity + AI preview (2-col) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent activity */}
          <div className="animate-pulse bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-zinc-200/70 dark:bg-zinc-700/50" />
              <div className="h-4 w-28 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
            </div>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-zinc-200/30 dark:border-zinc-700/30 last:border-0 px-2 -mx-2 rounded-xl"
                >
                  <div>
                    <div className="h-3.5 w-36 rounded bg-zinc-200/70 dark:bg-zinc-700/50 mb-1.5" />
                    <div className="h-3 w-44 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                  </div>
                  <div className="h-5 w-8 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                </div>
              ))}
            </div>
          </div>

          {/* AI Review teaser */}
          <div className="animate-pulse bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-zinc-200/70 dark:bg-zinc-700/50" />
              <div className="h-4 w-28 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
            </div>

            {/* AI summary skeleton */}
            <div className="mb-2">
              <div className="flex items-baseline gap-2 mb-2">
                <div className="h-5 w-28 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-3 w-16 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
              </div>
            </div>

            {/* Blockquote-style summary */}
            <div className="mb-4 relative">
              <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-zinc-200/70 dark:bg-zinc-700/50" />
              <div className="pl-4 space-y-2">
                <div className="h-3.5 w-full rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-3.5 w-5/6 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-3.5 w-3/4 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
              </div>
            </div>

            {/* Tips skeleton */}
            <div className="space-y-3 mb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-zinc-200/70 dark:bg-zinc-700/50 shrink-0" />
                  <div className="h-3 w-full rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                </div>
              ))}
            </div>

            {/* CTA button skeleton */}
            <div className="mt-auto pt-2">
              <div className="w-full h-[46px] rounded-full bg-zinc-200/70 dark:bg-zinc-700/50" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
