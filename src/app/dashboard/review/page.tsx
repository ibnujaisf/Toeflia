"use client";

import React, { useEffect, useState } from "react";
import ReviewList from "@/components/features/ReviewList";
import ReviewSkeleton from "@/components/skeletons/ReviewSkeleton";
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
    return <ReviewSkeleton />;
  }

  return <ReviewList initialSessions={sessions} />;
}
