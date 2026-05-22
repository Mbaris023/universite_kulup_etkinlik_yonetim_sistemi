import type { UserRole } from "@prisma/client";
import { AppError } from "@/lib/errors";
import type { SessionUser } from "@/types";

export function requireAuth(user: SessionUser | null): SessionUser {
  if (!user) {
    throw new AppError("Oturum açmanız gerekiyor.", 401, "UNAUTHORIZED");
  }
  return user;
}

export function requireRoles(user: SessionUser, roles: UserRole[]) {
  if (!roles.includes(user.role)) {
    throw new AppError("Bu işlem için yetkiniz bulunmuyor.", 403, "FORBIDDEN");
  }
}

export function requireStudent(user: SessionUser) {
  requireRoles(user, ["STUDENT"]);
  if (!user.studentId) {
    throw new AppError("Öğrenci profili bulunamadı.", 403, "STUDENT_PROFILE_MISSING");
  }
}

export function requirePresident(user: SessionUser) {
  requireRoles(user, ["CLUB_PRESIDENT"]);
  if (!user.clubId) {
    throw new AppError("Kulüp başkanı kulüp bilgisi bulunamadı.", 403, "CLUB_MISSING");
  }
}

export function requireAdmin(user: SessionUser) {
  requireRoles(user, ["ADMIN"]);
}
