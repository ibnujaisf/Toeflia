import type { Metadata } from "next";
import { UserProvider } from "@/context/UserContext";
import Sidebar from "@/components/features/Sidebar";

export const metadata: Metadata = {
  title: "Dashboard — Toeflia",
  description: "Your personalized TOEFL learning hub with Focus Mode and AI Review.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-inter">
        <Sidebar />
        <main className="lg:ml-60 min-h-screen">{children}</main>
      </div>
    </UserProvider>
  );
}
