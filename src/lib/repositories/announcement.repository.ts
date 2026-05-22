import type { EntityStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export class AnnouncementRepository {
  findActive() {
    return prisma.announcement.findMany({
      where: { status: "ACTIVE" },
      include: { club: true },
      orderBy: { createdAt: "desc" },
    });
  }

  findByClub(clubId: string) {
    return prisma.announcement.findMany({
      where: { clubId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });
  }

  create(data: Prisma.AnnouncementCreateInput) {
    return prisma.announcement.create({
      data,
      include: { club: true },
    });
  }

  updateStatus(id: string, status: EntityStatus) {
    return prisma.announcement.update({ where: { id }, data: { status } });
  }
}
