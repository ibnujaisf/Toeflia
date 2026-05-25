import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice Session — Toeflia",
};

export default function PracticeSessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
