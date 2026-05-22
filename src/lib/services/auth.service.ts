import bcrypt from "bcryptjs";
import { AppError } from "@/lib/errors";
import { UserRepository } from "@/lib/repositories/user.repository";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth/session";
import type { SessionUser } from "@/types";
import { loginSchema } from "@/lib/validation/schemas";

export class AuthService {
  constructor(private userRepo = new UserRepository()) {}

  async login(raw: unknown) {
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0]?.message ?? "Geçersiz giriş bilgileri.", 400);
    }

    const { email, password } = parsed.data;
    const user = await this.userRepo.findByEmail(email.toLowerCase());

    if (!user) {
      throw new AppError("E-posta veya şifre hatalı.", 401, "INVALID_CREDENTIALS");
    }

    if (user.status === "INACTIVE") {
      throw new AppError("Hesabınız pasifleştirilmiş. Giriş yapılamaz.", 403, "USER_INACTIVE");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError("E-posta veya şifre hatalı.", 401, "INVALID_CREDENTIALS");
    }

    const sessionUser: SessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.student?.id,
      clubId: user.presidentClub?.id,
    };

    await setSessionCookie(sessionUser);
    return { user: sessionUser };
  }

  async logout() {
    await clearSessionCookie();
    return { success: true };
  }

  async buildSessionForUserId(userId: string): Promise<SessionUser> {
    const user = await this.userRepo.findById(userId);
    if (!user || user.status === "INACTIVE") {
      throw new AppError("Kullanıcı bulunamadı.", 404);
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.student?.id,
      clubId: user.presidentClub?.id,
    };
  }
}
