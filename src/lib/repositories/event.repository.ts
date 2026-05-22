import type { EventStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export class EventRepository {
  findUpcoming() {
    return prisma.event.findMany({
      where: { status: "ACTIVE" },
      include: {
        club: true,
        enrollments: { where: { status: "ACTIVE" } },
      },
      orderBy: { startTime: "asc" },
    });
  }

  findById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        club: true,
        enrollments: {
          where: { status: "ACTIVE" },
          include: { student: { include: { user: true } } },
        },
      },
    });
  }

  findByClub(clubId: string) {
    return prisma.event.findMany({
      where: { clubId },
      include: {
        club: true,
        enrollments: { where: { status: "ACTIVE" } },
      },
      orderBy: { startTime: "asc" },
    });
  }

  create(data: Prisma.EventCreateInput) {
    return prisma.event.create({
      data,
      include: { club: true, enrollments: true },
    });
  }

  update(id: string, data: Prisma.EventUpdateInput) {
    return prisma.event.update({
      where: { id },
      data,
      include: { club: true, enrollments: { where: { status: "ACTIVE" } } },
    });
  }

  updateStatus(id: string, status: EventStatus) {
    return prisma.event.update({ where: { id }, data: { status } });
  }

  countActiveEnrollments(eventId: string) {
    return prisma.enrollment.count({
      where: { eventId, status: "ACTIVE" },
    });
  }
}
