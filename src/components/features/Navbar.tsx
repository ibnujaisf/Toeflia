"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

interface NavbarProps {
  onStartLearning?: () => void;
}

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
];

export default function Navbar({ onStartLearning }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // FITUR BARU: Fungsi untuk Smooth Scrolling saat menu diklik
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? "px-0 pt-0" : "px-4 pt-4"
      }`}
    >
      <nav
        className={`transition-all duration-500 ${
          scrolled
            ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/60 rounded-none mx-0"
            : "bg-white/70 dark:bg-zinc-950/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-full mx-auto max-w-3xl"
        }`}
      >
        {/* Struktur asli dikembalikan */}
        <div className="flex items-center justify-between px-5 py-3">
          {/* Logo */}
          <Link
            href="/"
            id="nav-logo"
            className="flex items-center gap-2.5 group"
          >
            <Logo className="w-12 h-12 transition-transform group-hover:scale-105" />
            <h2 className="font-urbanist font-extrabold text-xl text-zinc-950 dark:text-zinc-50 tracking-tight">
              Toeflia
            </h2>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)} // <-- Event Smooth Scroll dipasang di sini
                className="px-4 py-2 text-sm font-inter text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <button
            id="nav-cta"
            onClick={onStartLearning}
            className="bg-zinc-950 dark:bg-white text-white dark:text-black font-urbanist font-bold text-sm px-5 py-2 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 transition-all duration-150"
          >
            Let&apos;s Start
          </button>
        </div>
      </nav>
    </header>
  );
}