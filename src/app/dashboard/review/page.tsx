import { prisma } from "@/lib/prisma";
import ReviewList from "@/components/features/ReviewList";

export const revalidate = 0; // Disable caching so it always fetches fresh data

export default async function ReviewDashboard() {
  // Fetch from database
  const PREVIOUS_SESSIONS = await prisma.testSession.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <ReviewList initialSessions={PREVIOUS_SESSIONS} />;
}
