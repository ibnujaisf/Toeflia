"use client";

import React, { useEffect, useState } from "react";
import ReviewList from "@/components/features/ReviewList";
import { useUser } from "@/context/UserContext";

export default function ReviewDashboard() {
  const { user } = useUser();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const fetchSessions = async () => {
        try {
          const res = await fetch(`/api/review?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setSessions(data);
          } else {
            setSessions([]);
          }
        } catch (error) {
          console.error("Failed to load review sessions:", error);
          setSessions([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSessions();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-2 border-zinc-700"
          style={{
            borderTopColor: "#fafafa",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <ReviewList initialSessions={sessions} />;
}
