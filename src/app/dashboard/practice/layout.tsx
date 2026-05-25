import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice Modules — Toeflia",
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
