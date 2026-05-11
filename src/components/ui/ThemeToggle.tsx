"use client";

import { useTheme, type Theme } from "@/context/ThemeContext";

interface ThemeToggleProps {
  /**
   * "row"     = horizontal pill with icon + label  (landing page / footer)
   * "col"     = stacked vertical buttons with icon + label
   * "sidebar" = compact full-width horizontal pill, icon only (sr-only labels)
   */
  layout?: "row" | "col" | "sidebar";
}

const OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "Light",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
  },
];

export default function ThemeToggle({ layout = "row" }: ThemeToggleProps) {
  const { theme, setTheme, mounted } = useTheme();

  /* ── Sidebar: compact full-width pill, icon only ───────────────────────── */
  if (layout === "sidebar") {
    return (
      <div className="flex items-center gap-0.5 p-1 w-full bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-full">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => setTheme(o.value)}
            title={o.label}
            aria-label={o.label}
            className={`flex-1 flex items-center justify-center py-1.5 rounded-full transition-all duration-200 ${
              mounted && theme === o.value
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm"
                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {o.icon}
            <span className="sr-only">{o.label}</span>
          </button>
        ))}
      </div>
    );
  }

  /* ── Col: stacked vertical buttons with icon + label ───────────────────── */
  if (layout === "col") {
    return (
      <div className="flex flex-col gap-0.5 p-1 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-2xl">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => setTheme(o.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-inter font-medium transition-all duration-200 ${
              mounted && theme === o.value
                ? "bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <span className="w-4 flex items-center justify-center shrink-0">
              {o.icon}
            </span>
            {o.label}
          </button>
        ))}
      </div>
    );
  }

  /* ── Row (default): horizontal pill with icon + label ──────────────────── */
  return (
    <div className="inline-flex items-center gap-0.5 p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => setTheme(o.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-inter font-medium transition-all duration-200 ${
            mounted && theme === o.value
              ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <span className="w-3.5 flex items-center justify-center">{o.icon}</span>
          {o.label}
        </button>
      ))}
    </div>
  );
}
