import { describe, it, expect } from "vitest";
import { requireAdmin, requireRoles } from "@/lib/auth/guards";
import { AppError } from "@/lib/errors";
import type { SessionUser } from "@/types";

const student: SessionUser = {
  id: "1",
  name: "Öğrenci",
  email: "s@uni.edu",
  role: "STUDENT",
  studentId: "st-1",
};

describe("Auth guards", () => {
  it("öğrenci admin yetkisine erişemez", () => {
    expect(() => requireAdmin(student)).toThrow(AppError);
    try {
      requireAdmin(student);
    } catch (e) {
      expect((e as AppError).statusCode).toBe(403);
    }
  });

  it("admin rolü admin işlemlerine erişir", () => {
    const admin: SessionUser = {
      id: "2",
      name: "Admin",
      email: "a@uni.edu",
      role: "ADMIN",
    };
    expect(() => requireAdmin(admin)).not.toThrow();
  });

  it("requireRoles yanlış rolde hata verir", () => {
    expect(() => requireRoles(student, ["ADMIN"])).toThrow(AppError);
  });
});
