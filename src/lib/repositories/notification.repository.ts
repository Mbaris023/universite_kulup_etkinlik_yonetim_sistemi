import { prisma } from "@/lib/db";

export class NotificationRepository {
  create(userId: string, message: string) {
    return prisma.notification.create({
      data: { userId, message },
    });
  }

  findByUser(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }
}
