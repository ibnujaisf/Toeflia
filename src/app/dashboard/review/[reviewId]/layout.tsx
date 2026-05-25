import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Review — Toeflia",
};

export default function ReviewDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
