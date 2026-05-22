import type { EntityStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export class ClubRepository {
  findAll() {
    return prisma.club.findMany({
      include: { president: true, events: true },
      orderBy: { name: "asc" },
    });
  }

  findById(id: string) {
    return prisma.club.findUnique({
      where: { id },
      include: { president: true },
    });
  }

  findByPresidentUserId(presidentUserId: string) {
    return prisma.club.findUnique({
      where: { presidentUserId },
    });
  }

  create(data: Prisma.ClubCreateInput) {
    return prisma.club.create({ data, include: { president: true } });
  }

  update(id: string, data: Prisma.ClubUpdateInput) {
    return prisma.club.update({
      where: { id },
      data,
      include: { president: true },
    });
  }

  updateStatus(id: string, status: EntityStatus) {
    return prisma.club.update({ where: { id }, data: { status } });
  }
}
