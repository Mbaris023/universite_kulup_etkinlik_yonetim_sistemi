import type { EnrollmentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export class EnrollmentRepository {
  findActiveByEventAndStudent(eventId: string, studentId: string) {
    return prisma.enrollment.findFirst({
      where: { eventId, studentId, status: "ACTIVE" },
    });
  }

  findByEventAndStudent(eventId: string, studentId: string) {
    return prisma.enrollment.findUnique({
      where: { eventId_studentId: { eventId, studentId } },
    });
  }

  findByEvent(eventId: string) {
    return prisma.enrollment.findMany({
      where: { eventId, status: "ACTIVE" },
      include: { student: { include: { user: true } } },
      orderBy: { createdAt: "asc" },
    });
  }

  create(eventId: string, studentId: string) {
    return prisma.enrollment.create({
      data: { eventId, studentId, status: "ACTIVE" },
      include: { student: { include: { user: true } }, event: true },
    });
  }

  reactivate(id: string) {
    return prisma.enrollment.update({
      where: { id },
      data: { status: "ACTIVE" as EnrollmentStatus },
      include: { student: { include: { user: true } }, event: true },
    });
  }

  cancel(id: string) {
    return prisma.enrollment.update({
      where: { id },
      data: { status: "CANCELLED" as EnrollmentStatus },
    });
  }

  countActiveByEvent(eventId: string) {
    return prisma.enrollment.count({
      where: { eventId, status: "ACTIVE" },
    });
  }

  countAllActive() {
    return prisma.enrollment.count({ where: { status: "ACTIVE" } });
  }

  findActiveEventIdsByStudent(studentId: string) {
    return prisma.enrollment.findMany({
      where: { studentId, status: "ACTIVE" },
      select: { eventId: true },
    });
  }
}
