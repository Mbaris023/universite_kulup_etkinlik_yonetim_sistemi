import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventService } from "@/lib/services/event.service";
import { AppError } from "@/lib/errors";
import type { SessionUser } from "@/types";

describe("EventService", () => {
  const eventRepo = {
    findUpcoming: vi.fn(),
    findById: vi.fn(),
    findByClub: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };
  const notificationRepo = { create: vi.fn() };

  let service: EventService;

  const president: SessionUser = {
    id: "pres-1",
    name: "Başkan",
    email: "president@uni.edu",
    role: "CLUB_PRESIDENT",
    clubId: "club-1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new EventService(eventRepo as never, notificationRepo as never);
  });

  it("etkinlik listeleme upcoming döner", async () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    eventRepo.findUpcoming.mockResolvedValue([
      {
        id: "e1",
        title: "Atölye",
        description: "Desc",
        location: "A101",
        startTime: future,
        quota: 10,
        status: "ACTIVE",
        club: { name: "Yazılım" },
        enrollments: [],
      },
    ]);

    const events = await service.listUpcoming();
    expect(events).toHaveLength(1);
    expect(events[0].title).toBe("Atölye");
    expect(events[0].clubName).toBe("Yazılım");
  });

  it("kulüp başkanı başka kulübün etkinliğini güncelleyemez", async () => {
    eventRepo.findById.mockResolvedValue({
      id: "e1",
      clubId: "club-OTHER",
      title: "X",
      enrollments: [],
    });

    await expect(
      service.update("e1", { title: "Yeni" }, president),
    ).rejects.toMatchObject({ code: "CLUB_MISMATCH" });
  });

  it("kulüp başkanı kendi etkinliğini güncelleyebilir", async () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    eventRepo.findById.mockResolvedValue({
      id: "e1",
      clubId: "club-1",
      title: "Eski",
      enrollments: [],
    });
    eventRepo.update.mockResolvedValue({
      id: "e1",
      clubId: "club-1",
      title: "Yeni",
      description: "D",
      location: "L",
      startTime: future,
      quota: 5,
      status: "ACTIVE",
      club: { name: "Kulüp" },
      enrollments: [],
    });

    const result = await service.update("e1", { title: "Yeni" }, president);
    expect(result.title).toBe("Yeni");
  });
});
