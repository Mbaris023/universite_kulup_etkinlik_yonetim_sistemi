import { AppError } from "@/lib/errors";
import { EnrollmentValidator } from "@/lib/patterns/enrollment-validation";
import { NotificationFactory } from "@/lib/patterns/notification.factory";
import { EnrollmentRepository } from "@/lib/repositories/enrollment.repository";
import { EventRepository } from "@/lib/repositories/event.repository";
import { NotificationRepository } from "@/lib/repositories/notification.repository";
import type { SessionUser } from "@/types";

export class EnrollmentService {
  private validator = new EnrollmentValidator();

  constructor(
    private enrollmentRepo = new EnrollmentRepository(),
    private eventRepo = new EventRepository(),
    private notificationRepo = new NotificationRepository(),
  ) {}

  async enroll(eventId: string, user: SessionUser) {
    if (!user.studentId) {
      throw new AppError("Öğrenci profili bulunamadı.", 403);
    }

    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw new AppError("Etkinlik bulunamadı.", 404);
    }

    const activeCount = await this.enrollmentRepo.countActiveByEvent(eventId);
    const activeEnrollment = await this.enrollmentRepo.findActiveByEventAndStudent(
      eventId,
      user.studentId,
    );

    this.validator.validate({
      userRole: user.role,
      event,
      activeEnrollmentCount: activeCount,
      hasActiveEnrollment: !!activeEnrollment,
    });

    const existing = await this.enrollmentRepo.findByEventAndStudent(eventId, user.studentId);
    const enrollment =
      existing?.status === "CANCELLED"
        ? await this.enrollmentRepo.reactivate(existing.id)
        : await this.enrollmentRepo.create(eventId, user.studentId);
    const message = NotificationFactory.create("ENROLLMENT_SUCCESS", {
      eventTitle: event.title,
    });
    await this.notificationRepo.create(user.id, message);

    return {
      enrollmentId: enrollment.id,
      eventId,
      message: "Kayıt başarılı.",
    };
  }

  async cancel(eventId: string, user: SessionUser) {
    if (!user.studentId) {
      throw new AppError("Öğrenci profili bulunamadı.", 403);
    }

    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw new AppError("Etkinlik bulunamadı.", 404);
    }

    if (event.startTime <= new Date()) {
      throw new AppError("Başlamış etkinliğin kaydı iptal edilemez.", 400);
    }

    const enrollment = await this.enrollmentRepo.findActiveByEventAndStudent(
      eventId,
      user.studentId,
    );
    if (!enrollment) {
      throw new AppError("Aktif kayıt bulunamadı.", 404);
    }

    await this.enrollmentRepo.cancel(enrollment.id);
    const message = NotificationFactory.create("ENROLLMENT_CANCELLED", {
      eventTitle: event.title,
    });
    await this.notificationRepo.create(user.id, message);

    return { success: true, message: "Kayıt iptal edildi." };
  }
}
