import { describe, it, expect, vi, beforeEach } from "vitest";
import { EnrollmentService } from "@/lib/services/enrollment.service";
import { AppError } from "@/lib/errors";
import type { SessionUser } from "@/types";

const studentUser: SessionUser = {
  id: "user-1",
  name: "Öğrenci",
  email: "student@uni.edu",
  role: "STUDENT",
  studentId: "student-1",
};

function futureEvent(overrides: Partial<Record<string, unknown>> = {}) {
  const future = new Date();
  future.setDate(future.getDate() + 10);
  return {
    id: "event-1",
    clubId: "club-1",
    title: "Test Etkinlik",
    description: "Açıklama",
    location: "Salon",
    startTime: future,
    quota: 2,
    status: "ACTIVE" as const,
    createdAt: new Date(),
    club: { name: "Kulüp" },
    enrollments: [],
    ...overrides,
  };
}

describe("EnrollmentService", () => {
  const enrollmentRepo = {
    findActiveByEventAndStudent: vi.fn(),
    findByEventAndStudent: vi.fn(),
    create: vi.fn(),
    reactivate: vi.fn(),
    cancel: vi.fn(),
    countActiveByEvent: vi.fn(),
  };
  const eventRepo = {
    findById: vi.fn(),
  };
  const notificationRepo = {
    create: vi.fn(),
  };

  let service: EnrollmentService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new EnrollmentService(
      enrollmentRepo as never,
      eventRepo as never,
      notificationRepo as never,
    );
  });

  it("başarılı kayıt oluşturur", async () => {
    eventRepo.findById.mockResolvedValue(futureEvent());
    enrollmentRepo.countActiveByEvent.mockResolvedValue(0);
    enrollmentRepo.findActiveByEventAndStudent.mockResolvedValue(null);
    enrollmentRepo.findByEventAndStudent.mockResolvedValue(null);
    enrollmentRepo.create.mockResolvedValue({ id: "enroll-1" });

    const result = await service.enroll("event-1", studentUser);
    expect(result.message).toBe("Kayıt başarılı.");
    expect(enrollmentRepo.create).toHaveBeenCalledWith("event-1", "student-1");
  });

  it("kontenjan doluysa kayıt reddeder", async () => {
    eventRepo.findById.mockResolvedValue(futureEvent({ quota: 1 }));
    enrollmentRepo.countActiveByEvent.mockResolvedValue(1);
    enrollmentRepo.findActiveByEventAndStudent.mockResolvedValue(null);

    await expect(service.enroll("event-1", studentUser)).rejects.toThrow(AppError);
    await expect(service.enroll("event-1", studentUser)).rejects.toMatchObject({
      code: "CAPACITY_FULL",
    });
  });

  it("aynı öğrencinin ikinci kaydını reddeder", async () => {
    eventRepo.findById.mockResolvedValue(futureEvent());
    enrollmentRepo.countActiveByEvent.mockResolvedValue(1);
    enrollmentRepo.findActiveByEventAndStudent.mockResolvedValue({ id: "existing" });

    await expect(service.enroll("event-1", studentUser)).rejects.toMatchObject({
      code: "DUPLICATE_ENROLLMENT",
    });
  });

  it("geçmiş tarihli etkinliğe kayıt reddeder", async () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    eventRepo.findById.mockResolvedValue(futureEvent({ startTime: past }));
    enrollmentRepo.countActiveByEvent.mockResolvedValue(0);
    enrollmentRepo.findActiveByEventAndStudent.mockResolvedValue(null);

    await expect(service.enroll("event-1", studentUser)).rejects.toMatchObject({
      code: "EVENT_PAST",
    });
  });
});
