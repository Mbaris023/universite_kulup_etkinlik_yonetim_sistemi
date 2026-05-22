import { AppError } from "@/lib/errors";
import { AnnouncementRepository } from "@/lib/repositories/announcement.repository";
import { NotificationFactory } from "@/lib/patterns/notification.factory";
import { NotificationRepository } from "@/lib/repositories/notification.repository";
import { prisma } from "@/lib/db";
import { announcementSchema } from "@/lib/validation/schemas";
import type { SessionUser } from "@/types";

export class AnnouncementService {
  constructor(
    private announcementRepo = new AnnouncementRepository(),
    private notificationRepo = new NotificationRepository(),
  ) {}

  async listActive() {
    return this.announcementRepo.findActive();
  }

  async create(raw: unknown, user: SessionUser) {
    if (user.role !== "CLUB_PRESIDENT" || !user.clubId) {
      throw new AppError("Yalnızca kulüp başkanı duyuru paylaşabilir.", 403);
    }

    const parsed = announcementSchema.safeParse(raw);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0]?.message ?? "Geçersiz veri.", 400);
    }

    const announcement = await this.announcementRepo.create({
      title: parsed.data.title,
      content: parsed.data.content,
      club: { connect: { id: user.clubId } },
    });

    const students = await prisma.user.findMany({
      where: { role: "STUDENT", status: "ACTIVE" },
      select: { id: true },
    });

    const message = NotificationFactory.create("ANNOUNCEMENT_PUBLISHED", {
      announcementTitle: announcement.title,
    });

    await Promise.all(
      students.map((s) => this.notificationRepo.create(s.id, message)),
    );

    return announcement;
  }
}
