import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "@/lib/services/auth.service";
import { AppError } from "@/lib/errors";

vi.mock("@/lib/auth/session", () => ({
  setSessionCookie: vi.fn(),
  clearSessionCookie: vi.fn(),
}));

describe("AuthService", () => {
  const userRepo = { findByEmail: vi.fn() };
  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AuthService(userRepo as never);
  });

  it("pasif kullanıcı giriş yapamaz", async () => {
    userRepo.findByEmail.mockResolvedValue({
      id: "1",
      email: "x@uni.edu",
      passwordHash: "$2a$10$mock",
      status: "INACTIVE",
      role: "STUDENT",
    });

    await expect(
      service.login({ email: "x@uni.edu", password: "123456" }),
    ).rejects.toMatchObject({ code: "USER_INACTIVE" });
  });
});
