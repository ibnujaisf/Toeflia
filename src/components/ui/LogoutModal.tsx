"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LogoutModal({ open, onClose }: LogoutModalProps) {
  const router = useRouter();
  const { clearUser } = useUser();

  /* Lock body scroll while modal is open */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  function handleSaveExit() {
    onClose();
    router.push("/");
  }

  function handleWipeExit() {
    clearUser();
    localStorage.clear();
    onClose();
    router.push("/");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="logout-modal-title"
    >
      {/* Backdrop — lighter tint in light mode, dark in dark mode */}
      <div
        className="absolute inset-0 bg-zinc-200/70 dark:bg-zinc-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl animate-fade-in-up">
        <div className="flex items-center gap-4 mb-5">
          {/* Icon */}
          <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="text-zinc-500 dark:text-zinc-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
              />
            </svg>
          </div>

          {/* Title */}
          <h2
            id="logout-modal-title"
            className="font-urbanist font-extrabold text-xl text-zinc-900 dark:text-zinc-50"
          >
            Leaving so soon?
          </h2>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-inter leading-relaxed mb-7">
          You can save your current progress, or wipe your data completely from
          this device.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {/* Save & Exit — outline/secondary */}
          <button
            id="logout-save-exit"
            onClick={handleSaveExit}
            className="w-full py-3 px-6 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 font-urbanist font-bold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 active:scale-[0.98] transition-all duration-150"
          >
            Save &amp; Exit
          </button>

          {/* Wipe Data & Exit — high-contrast primary */}
          <button
            id="logout-wipe-exit"
            onClick={handleWipeExit}
            className="w-full py-3 px-6 rounded-full bg-red-600 text-white font-urbanist font-bold text-sm hover:bg-red-700 active:scale-[0.98] transition-all duration-150"
          >
            Wipe Data &amp; Exit
          </button>

          {/* Cancel */}
          <button
            id="logout-cancel"
            onClick={onClose}
            className="w-full py-2.5 px-6 rounded-full text-zinc-400 dark:text-zinc-600 font-inter text-sm hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-150"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
