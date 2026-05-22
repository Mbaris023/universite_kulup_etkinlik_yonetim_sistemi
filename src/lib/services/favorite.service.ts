import { AppError } from "@/lib/errors";
import { FavoriteRepository } from "@/lib/repositories/favorite.repository";
import { EventRepository } from "@/lib/repositories/event.repository";
import { mapEventToListItem } from "@/lib/utils/event-mapper";
import type { SessionUser } from "@/types";

export class FavoriteService {
  constructor(
    private favoriteRepo = new FavoriteRepository(),
    private eventRepo = new EventRepository(),
  ) {}

  private requireStudent(user: SessionUser) {
    if (user.role !== "STUDENT" || !user.studentId) {
      throw new AppError("Favoriler yalnızca öğrenciler içindir.", 403);
    }
    return user.studentId;
  }

  async list(user: SessionUser) {
    const studentId = this.requireStudent(user);
    const favorites = await this.favoriteRepo.listByStudent(studentId);
    return favorites.map((f) => ({
      favoriteId: f.id,
      favoritedAt: f.createdAt.toISOString(),
      event: mapEventToListItem(f.event),
    }));
  }

  async add(eventId: string, user: SessionUser) {
    const studentId = this.requireStudent(user);
    const event = await this.eventRepo.findById(eventId);
    if (!event || event.status !== "ACTIVE") {
      throw new AppError("Etkinlik bulunamadı.", 404);
    }

    const existing = await this.favoriteRepo.findByStudentAndEvent(studentId, eventId);
    if (existing) {
      return { favorited: true, message: "Zaten favorilerinizde." };
    }

    await this.favoriteRepo.add(studentId, eventId);
    return { favorited: true, message: "Favorilere eklendi." };
  }

  async remove(eventId: string, user: SessionUser) {
    const studentId = this.requireStudent(user);
    const existing = await this.favoriteRepo.findByStudentAndEvent(studentId, eventId);
    if (!existing) {
      return { favorited: false, message: "Favorilerde değil." };
    }

    await this.favoriteRepo.remove(studentId, eventId);
    return { favorited: false, message: "Favorilerden çıkarıldı." };
  }
}
