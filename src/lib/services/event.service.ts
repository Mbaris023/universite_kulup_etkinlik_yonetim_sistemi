import { AppError } from "@/lib/errors";
import { EnrollmentRepository } from "@/lib/repositories/enrollment.repository";
import { EventRepository } from "@/lib/repositories/event.repository";
import { FavoriteRepository } from "@/lib/repositories/favorite.repository";
import { NotificationFactory } from "@/lib/patterns/notification.factory";
import { NotificationRepository } from "@/lib/repositories/notification.repository";
import { mapEventToListItem } from "@/lib/utils/event-mapper";
import { eventCreateSchema, eventUpdateSchema } from "@/lib/validation/schemas";
import type { EventListItem, SessionUser } from "@/types";

export class EventService {
  constructor(
    private eventRepo = new EventRepository(),
    private notificationRepo = new NotificationRepository(),
    private favoriteRepo = new FavoriteRepository(),
    private enrollmentRepo = new EnrollmentRepository(),
  ) {}

  private async enrichForStudent(events: EventListItem[], studentId: string) {
    const [favorites, enrollments] = await Promise.all([
      this.favoriteRepo.findEventIdsByStudent(studentId),
      this.enrollmentRepo.findActiveEventIdsByStudent(studentId),
    ]);
    const favSet = new Set(favorites.map((f) => f.eventId));
    const enrollSet = new Set(enrollments.map((e) => e.eventId));
    return events.map((e) => ({
      ...e,
      isFavorited: favSet.has(e.id),
      isEnrolled: enrollSet.has(e.id),
    }));
  }

  async listUpcoming(user?: SessionUser | null) {
    const events = await this.eventRepo.findUpcoming();
    const mapped = events.map(mapEventToListItem);
    if (user?.role === "STUDENT" && user.studentId) {
      return this.enrichForStudent(mapped, user.studentId);
    }
    return mapped;
  }

  async listEnrolled(user: SessionUser) {
    if (!user.studentId) {
      throw new AppError("Öğrenci profili bulunamadı.", 403);
    }
    const enrollments = await this.enrollmentRepo.findActiveEventIdsByStudent(user.studentId);
    const events = await Promise.all(
      enrollments.map((e) => this.eventRepo.findById(e.eventId)),
    );
    const mapped = events
      .filter(Boolean)
      .map((ev) => mapEventToListItem(ev!));
    return this.enrichForStudent(mapped, user.studentId);
  }

  async getById(id: string, user?: SessionUser | null) {
    const event = await this.eventRepo.findById(id);
    if (!event) {
      throw new AppError("Etkinlik bulunamadı.", 404, "EVENT_NOT_FOUND");
    }
    let base: EventListItem = mapEventToListItem(event);
    if (user?.role === "STUDENT" && user.studentId) {
      const [enriched] = await this.enrichForStudent([base], user.studentId);
      base = enriched as EventListItem;
    }
    return {
      ...base,
      participants: event.enrollments.map((e) => ({
        enrollmentId: e.id,
        studentId: e.studentId,
        studentNo: e.student.studentNo,
        name: e.student.user.name,
        department: e.student.department,
        enrolledAt: e.createdAt.toISOString(),
      })),
    };
  }

  async create(raw: unknown, user: SessionUser) {
    if (user.role !== "CLUB_PRESIDENT" || !user.clubId) {
      throw new AppError("Yalnızca kulüp başkanı etkinlik oluşturabilir.", 403);
    }

    const parsed = eventCreateSchema.safeParse(raw);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0]?.message ?? "Geçersiz veri.", 400);
    }

    const startTime =
      parsed.data.startTime instanceof Date
        ? parsed.data.startTime
        : new Date(parsed.data.startTime);
    if (startTime <= new Date()) {
      throw new AppError("Etkinlik tarihi gelecekte olmalıdır.", 400);
    }

    const event = await this.eventRepo.create({
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location,
      category: parsed.data.category ?? "Atölye",
      coverKey: parsed.data.coverKey ?? "aurora",
      startTime,
      quota: parsed.data.quota,
      club: { connect: { id: user.clubId } },
    });

    const message = NotificationFactory.create("EVENT_CREATED", {
      eventTitle: event.title,
    });
    await this.notificationRepo.create(user.id, message);

    return mapEventToListItem({
      ...event,
      enrollments: [],
    });
  }

  async update(eventId: string, raw: unknown, user: SessionUser) {
    if (user.role !== "CLUB_PRESIDENT" || !user.clubId) {
      throw new AppError("Yalnızca kulüp başkanı etkinlik güncelleyebilir.", 403);
    }

    const existing = await this.eventRepo.findById(eventId);
    if (!existing) {
      throw new AppError("Etkinlik bulunamadı.", 404);
    }
    if (existing.clubId !== user.clubId) {
      throw new AppError("Başka kulübün etkinliğini düzenleyemezsiniz.", 403, "CLUB_MISMATCH");
    }

    const parsed = eventUpdateSchema.safeParse(raw);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0]?.message ?? "Geçersiz veri.", 400);
    }

    const data = parsed.data;
    if (data.startTime) {
      const startTime =
        data.startTime instanceof Date ? data.startTime : new Date(data.startTime);
      if (startTime <= new Date()) {
        throw new AppError("Etkinlik tarihi gelecekte olmalıdır.", 400);
      }
    }

    const updated = await this.eventRepo.update(eventId, {
      title: data.title,
      description: data.description,
      location: data.location,
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      quota: data.quota,
      status: data.status,
    });

    return mapEventToListItem(updated);
  }

  async listForPresident(user: SessionUser) {
    if (!user.clubId) return [];
    const events = await this.eventRepo.findByClub(user.clubId);
    return events.map(mapEventToListItem);
  }
}
