import { prisma } from "@/lib/db";

export class FavoriteRepository {
  findByStudentAndEvent(studentId: string, eventId: string) {
    return prisma.favorite.findUnique({
      where: { studentId_eventId: { studentId, eventId } },
    });
  }

  findEventIdsByStudent(studentId: string) {
    return prisma.favorite.findMany({
      where: { studentId },
      select: { eventId: true },
    });
  }

  listByStudent(studentId: string) {
    return prisma.favorite.findMany({
      where: { studentId },
      include: {
        event: {
          include: {
            club: true,
            enrollments: { where: { status: "ACTIVE" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  add(studentId: string, eventId: string) {
    return prisma.favorite.create({
      data: { studentId, eventId },
    });
  }

  remove(studentId: string, eventId: string) {
    return prisma.favorite.delete({
      where: { studentId_eventId: { studentId, eventId } },
    });
  }
}
