import type { Event, UserRole } from "@prisma/client";
import { AppError } from "@/lib/errors";

export interface EnrollmentValidationContext {
  userRole: UserRole;
  event: Event;
  activeEnrollmentCount: number;
  hasActiveEnrollment: boolean;
  now?: Date;
}

export interface EnrollmentValidationStrategy {
  validate(context: EnrollmentValidationContext): void;
}

export class CheckStudentRoleStrategy implements EnrollmentValidationStrategy {
  validate(context: EnrollmentValidationContext) {
    if (context.userRole !== "STUDENT") {
      throw new AppError("Yalnızca öğrenciler etkinliğe kayıt olabilir.", 403, "NOT_STUDENT");
    }
  }
}

export class CheckEventIsActiveStrategy implements EnrollmentValidationStrategy {
  validate(context: EnrollmentValidationContext) {
    if (context.event.status === "CANCELLED") {
      throw new AppError("İptal edilmiş etkinliğe kayıt yapılamaz.", 400, "EVENT_CANCELLED");
    }
  }
}

export class CheckEventDateStrategy implements EnrollmentValidationStrategy {
  validate(context: EnrollmentValidationContext) {
    const now = context.now ?? new Date();
    if (context.event.startTime <= now) {
      throw new AppError("Geçmiş tarihli etkinliğe kayıt yapılamaz.", 400, "EVENT_PAST");
    }
  }
}

export class CheckCapacityStrategy implements EnrollmentValidationStrategy {
  validate(context: EnrollmentValidationContext) {
    if (context.activeEnrollmentCount >= context.event.quota) {
      throw new AppError("Etkinlik kontenjanı dolu.", 400, "CAPACITY_FULL");
    }
  }
}

export class CheckDuplicateEnrollmentStrategy implements EnrollmentValidationStrategy {
  validate(context: EnrollmentValidationContext) {
    if (context.hasActiveEnrollment) {
      throw new AppError("Bu etkinliğe zaten kayıtlısınız.", 400, "DUPLICATE_ENROLLMENT");
    }
  }
}

export class EnrollmentValidator {
  private strategies: EnrollmentValidationStrategy[];

  constructor(strategies?: EnrollmentValidationStrategy[]) {
    this.strategies = strategies ?? [
      new CheckStudentRoleStrategy(),
      new CheckEventIsActiveStrategy(),
      new CheckEventDateStrategy(),
      new CheckCapacityStrategy(),
      new CheckDuplicateEnrollmentStrategy(),
    ];
  }

  validate(context: EnrollmentValidationContext) {
    for (const strategy of this.strategies) {
      strategy.validate(context);
    }
  }
}
