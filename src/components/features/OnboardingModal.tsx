"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, UserProfile } from "@/context/UserContext";

const STATUS_OPTIONS: { value: UserProfile["status"]; label: string }[] = [
  { value: "pelajar", label: "Student / Undergrad" },
  { value: "pekerja", label: "Working Professional" },
  { value: "freelancer", label: "Freelancer" },
  { value: "lainnya", label: "Other" },
];

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { setUser } = useUser();
  const router = useRouter();
  const [step, setStep] = useState<"form" | "loading">("form");
  const [form, setForm] = useState({
    name: "",
    status: "" as UserProfile["status"] | "",
    reason: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && step === "form") setTimeout(() => nameRef.current?.focus(), 100);
  }, [isOpen, step]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.status) return setError("Please select your current status.");
    if (!form.reason.trim()) return setError("Please tell us why you're learning TOEFL.");

    setStep("loading");
    setUser({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      status: form.status as UserProfile["status"],
      reason: form.reason.trim(),
    });
    setTimeout(() => router.push("/dashboard"), 1200);
  }

  if (!isOpen) return null;

  const selectedLabel = STATUS_OPTIONS.find((o) => o.value === form.status)?.label ?? "";

  /* ── Shared input base classes ─────────────────────────────────────────── */
  const inputCls =
    "w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm font-inter outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors";

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(20px)", backgroundColor: "rgba(9,9,11,0.6)" }}
    >
      <div className="animate-scale-in w-full max-w-md">
        {step === "loading" ? (
          /* Loading state — Kotak (card) yang sama dengan form */
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center gap-6 py-16 animate-fade-in">
            
            {/* 👇 INI DIA GANTINYA: 3 Bulat Naik Turun 👇 */}
            <div className="flex items-center gap-2 pb-1">
              {/* Bulat 1 (Delay paling lama) */}
              <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 dark:bg-zinc-50 animate-bounce [animation-delay:-0.3s]" />
              {/* Bulat 2 (Delay sedang) */}
              <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 dark:bg-zinc-50 animate-bounce [animation-delay:-0.15s]" />
              {/* Bulat 3 (Tanpa delay) */}
              <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 dark:bg-zinc-50 animate-bounce" />
            </div>
            {/* 👆 SAMPAI SINI 👆 */}
            
            <div className="text-center">
              {/* Teks responsif tetap sama */}
              <p className="font-urbanist font-bold text-xl text-zinc-950 dark:text-zinc-50">
                Setting up your workspace…
              </p>
              <p className="text-md text-zinc-500 mt-1 font-inter">
                Almost there 🎯
              </p>
            </div>
            
          </div>
        ) : (
          /* Form */
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-7">
              <h2 className="font-urbanist font-extrabold text-2xl text-zinc-950 dark:text-zinc-50 leading-tight">
                Let&apos;s get to know you 👋
              </h2>
              <p className="text-zinc-500 text-sm mt-1 font-inter">
               So Toeflia knows exactly where to start.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="onboard-name"
                  className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-inter"
                >
                  Your Name
                </label>
                <input
                  ref={nameRef}
                  id="onboard-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. John Wayne"
                  className={inputCls}
                  autoComplete="off"
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-inter">
                  Current Status
                </label>
                <div ref={dropdownRef} className="relative">
                  <button
                    id="onboard-status"
                    type="button"
                    onClick={() => setDropdownOpen((v) => !v)}
                    className={`${inputCls} flex items-center justify-between`}
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                  >
                    <span className={selectedLabel ? "text-zinc-950 dark:text-zinc-50" : "text-zinc-400 dark:text-zinc-600"}>
                      {selectedLabel || "Select your status…"}
                    </span>
                    <svg
                      className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <ul
                      role="listbox"
                      className="absolute z-10 top-full mt-2 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <li
                          key={opt.value}
                          role="option"
                          aria-selected={form.status === opt.value}
                          onClick={() => { setForm((p) => ({ ...p, status: opt.value })); setDropdownOpen(false); }}
                          className={`px-4 py-3 text-sm font-inter cursor-pointer transition-colors ${
                            form.status === opt.value
                              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50"
                              : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-950 dark:hover:text-zinc-200"
                          }`}
                        >
                          {opt.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="onboard-reason"
                  className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-inter"
                >
                  Reason for Learning TOEFL
                </label>
                <textarea
                  id="onboard-reason"
                  rows={3}
                  value={form.reason}
                  onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                  placeholder="e.g. Graduation requirement, CPNS exam, scholarship application…"
                  className={`${inputCls} resize-none leading-relaxed`}
                />
              </div>

              {error && <p className="text-xs text-red-500 dark:text-red-400 font-inter -mt-1">{error}</p>}

              <div className="flex items-center gap-3 mt-1">
               <button
                  id="onboard-submit"
                  type="submit"
                  className="group flex-1 flex items-center justify-center gap-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-urbanist font-bold text-sm py-3.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Enter Dashboard
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center justify-center text-sm font-urbanist font-bold text-zinc-900 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 px-7 py-3.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
