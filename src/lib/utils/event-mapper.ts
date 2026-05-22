import type { Event, Enrollment } from "@prisma/client";

type EventWithRelations = Event & {
  club: { name: string };
  enrollments: Enrollment[];
};

export function mapEventToListItem(event: EventWithRelations) {
  const activeEnrollmentCount = event.enrollments.filter((e) => e.status === "ACTIVE").length;
  const now = new Date();
  const isPast = event.startTime <= now;

  const spotsLeft = Math.max(0, event.quota - activeEnrollmentCount);
  const occupancyPercent =
    event.quota > 0 ? Math.round((activeEnrollmentCount / event.quota) * 100) : 0;

  return {
    id: event.id,
    clubId: event.clubId,
    title: event.title,
    description: event.description,
    location: event.location,
    category: event.category ?? "Genel",
    coverKey: event.coverKey ?? "aurora",
    startTime: event.startTime.toISOString(),
    quota: event.quota,
    status: event.status,
    clubName: event.club.name,
    activeEnrollmentCount,
    isFull: activeEnrollmentCount >= event.quota,
    isPast,
    spotsLeft,
    occupancyPercent,
  };
}
