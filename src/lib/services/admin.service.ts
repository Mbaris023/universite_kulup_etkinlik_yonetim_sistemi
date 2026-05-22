import bcrypt from "bcryptjs";
import { AppError } from "@/lib/errors";
import { prisma } from "@/lib/db";
import { ClubRepository } from "@/lib/repositories/club.repository";
import { EnrollmentRepository } from "@/lib/repositories/enrollment.repository";
import { EventRepository } from "@/lib/repositories/event.repository";
import { UserRepository } from "@/lib/repositories/user.repository";
import {
  adminClubCreateSchema,
  adminClubUpdateSchema,
  adminUserCreateSchema,
  adminUserUpdateSchema,
} from "@/lib/validation/schemas";
import type { ReportSummary } from "@/types";

export class AdminService {
  constructor(
    private userRepo = new UserRepository(),
    private clubRepo = new ClubRepository(),
    private eventRepo = new EventRepository(),
    private enrollmentRepo = new EnrollmentRepository(),
  ) {}

  async listUsers() {
    const users = await this.userRepo.findAll();
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      studentNo: u.student?.studentNo,
      department: u.student?.department,
      clubName: u.presidentClub?.name,
      createdAt: u.createdAt.toISOString(),
    }));
  }

  async createUser(raw: unknown) {
    const parsed = adminUserCreateSchema.safeParse(raw);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0]?.message ?? "Geçersiz veri.", 400);
    }

    const data = parsed.data;
    const existing = await this.userRepo.findByEmail(data.email.toLowerCase());
    if (existing) {
      throw new AppError("Bu e-posta zaten kayıtlı.", 400);
    }

    if (data.role === "STUDENT" && (!data.studentNo || !data.department)) {
      throw new AppError("Öğrenci için numara ve bölüm zorunludur.", 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.userRepo.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
    });

    if (data.role === "STUDENT") {
      await this.userRepo.createStudentProfile(
        user.id,
        data.studentNo!,
        data.department!,
      );
    }

    return this.userRepo.findById(user.id);
  }

  async updateUser(userId: string, raw: unknown) {
    const parsed = adminUserUpdateSchema.safeParse(raw);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0]?.message ?? "Geçersiz veri.", 400);
    }

    const data = parsed.data;
    const updateData: Record<string, unknown> = {};

    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email.toLowerCase();
    if (data.role) updateData.role = data.role;
    if (data.status) updateData.status = data.status;
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    const user = await this.userRepo.update(userId, updateData);

    if (data.studentNo || data.department) {
      if (user.student) {
        await prisma.student.update({
          where: { id: user.student.id },
          data: {
            studentNo: data.studentNo ?? user.student.studentNo,
            department: data.department ?? user.student.department,
          },
        });
      }
    }

    return this.userRepo.findById(userId);
  }

  async listClubs() {
    return this.clubRepo.findAll();
  }

  async createClub(raw: unknown) {
    const parsed = adminClubCreateSchema.safeParse(raw);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0]?.message ?? "Geçersiz veri.", 400);
    }

    const president = await this.userRepo.findById(parsed.data.presidentUserId);
    if (!president || president.role !== "CLUB_PRESIDENT") {
      throw new AppError("Kulüp başkanı rolündeki bir kullanıcı seçilmelidir.", 400);
    }

    const existingClub = await this.clubRepo.findByPresidentUserId(president.id);
    if (existingClub) {
      throw new AppError("Bu kullanıcı zaten bir kulübe başkan.", 400);
    }

    return this.clubRepo.create({
      name: parsed.data.name,
      description: parsed.data.description,
      president: { connect: { id: president.id } },
    });
  }

  async updateClub(clubId: string, raw: unknown) {
    const parsed = adminClubUpdateSchema.safeParse(raw);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0]?.message ?? "Geçersiz veri.", 400);
    }

    const data = parsed.data;
    if (data.status === "INACTIVE") {
      return this.clubRepo.updateStatus(clubId, "INACTIVE");
    }

    return this.clubRepo.update(clubId, {
      name: data.name,
      description: data.description,
      president: data.presidentUserId
        ? { connect: { id: data.presidentUserId } }
        : undefined,
      status: data.status,
    });
  }

  async getReportSummary(): Promise<ReportSummary> {
    const events = await prisma.event.findMany({
      where: { status: "ACTIVE" },
      include: {
        club: true,
        enrollments: { where: { status: "ACTIVE" } },
      },
    });

    const totalEvents = events.length;
    const totalActiveEnrollments = await this.enrollmentRepo.countAllActive();

    let occupancySum = 0;
    const clubMap = new Map<
      string,
      { clubName: string; eventCount: number; enrollmentCount: number; quotaSum: number }
    >();

    for (const event of events) {
      const count = event.enrollments.length;
      occupancySum += event.quota > 0 ? count / event.quota : 0;

      const entry = clubMap.get(event.clubId) ?? {
        clubName: event.club.name,
        eventCount: 0,
        enrollmentCount: 0,
        quotaSum: 0,
      };
      entry.eventCount += 1;
      entry.enrollmentCount += count;
      entry.quotaSum += event.quota;
      clubMap.set(event.clubId, entry);
    }

    const eventsByClub = Array.from(clubMap.values()).map((c) => ({
      clubName: c.clubName,
      eventCount: c.eventCount,
      enrollmentCount: c.enrollmentCount,
      occupancyRate:
        c.quotaSum > 0 ? Math.round((c.enrollmentCount / c.quotaSum) * 10000) / 100 : 0,
    }));

    return {
      totalEvents,
      totalActiveEnrollments,
      averageOccupancyRate:
        totalEvents > 0 ? Math.round((occupancySum / totalEvents) * 10000) / 100 : 0,
      eventsByClub,
    };
  }
}
