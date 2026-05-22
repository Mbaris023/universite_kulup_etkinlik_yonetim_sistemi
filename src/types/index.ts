import type { EntityStatus, EventStatus, UserRole } from "@prisma/client";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  clubId?: string;
};

export type ApiError = {
  message: string;
  code?: string;
};

export type EventListItem = {
  id: string;
  clubId: string;
  title: string;
  description: string;
  location: string;
  category: string;
  coverKey: string;
  startTime: string;
  quota: number;
  status: EventStatus;
  clubName: string;
  activeEnrollmentCount: number;
  isFull: boolean;
  isPast: boolean;
  isFavorited?: boolean;
  isEnrolled?: boolean;
  spotsLeft?: number;
  occupancyPercent?: number;
};

export type ReportSummary = {
  totalEvents: number;
  totalActiveEnrollments: number;
  averageOccupancyRate: number;
  eventsByClub: Array<{
    clubName: string;
    eventCount: number;
    enrollmentCount: number;
    occupancyRate: number;
  }>;
};

export { EntityStatus, EventStatus, UserRole };
