import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toeflia — TOEFL Intelligent Academy",
  description:
    "Next-generation TOEFL micro-learning simulator powered entirely by AI. Practice Listening, Structure, and Reading with personalized AI feedback.",
  keywords: [
    "TOEFL simulator",
    "TOEFL practice",
    "AI TOEFL",
    "micro-learning",
    "TOEFL ITP",
  ],
  openGraph: {
    title: "Toeflia — TOEFL Intelligent Academy",
    description: "Next-gen TOEFL micro-learning simulator, 100% AI-powered.",
    type: "website",
  },
  icons: {
    icon: "/Toeflia.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flash theme script — runs synchronously before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('toeflia_theme')||'dark';if(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain-overlay bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 antialiased transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
