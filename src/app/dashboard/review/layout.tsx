import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review History — Toeflia",
};

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
