export default function ReviewSkeleton() {
  return (
    <div className="px-6 md:px-10 py-8 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="h-3 w-14 rounded bg-zinc-200/70 dark:bg-zinc-700/50 mb-3" />
          <div className="h-8 w-52 rounded-lg bg-zinc-200/70 dark:bg-zinc-700/50 mb-2" />
          <div className="space-y-2 mt-2 max-w-xl">
            <div className="h-3.5 w-full rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
            <div className="h-3.5 w-4/5 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
          </div>
        </div>

        {/* 3-column Kanban board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3].map((col) => (
            <div key={col} className="flex flex-col gap-5">
              {/* Column header */}
              <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="h-5 w-48 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
              </div>

              {/* Session cards */}
              {[1, 2].map((card) => (
                <div
                  key={card}
                  className="animate-pulse bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-[1.5rem] p-5 flex flex-col"
                >
                  {/* Top section: title + score */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1.5">
                      <div className="h-5 w-32 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                      <div className="h-3 w-28 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <div className="h-7 w-8 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                      <div className="h-5 w-8 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                    </div>
                  </div>

                  {/* Bottom section: view results + action */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-200/30 dark:border-zinc-700/30">
                    <div className="h-3.5 w-24 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                    <div className="w-[18px] h-[18px] rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
