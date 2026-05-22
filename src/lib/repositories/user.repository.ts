import type { EntityStatus, Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { student: true, presidentClub: true },
    });
  }

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { student: true, presidentClub: true },
    });
  }

  findAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { student: true, presidentClub: true },
    });
  }

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data, include: { student: true, presidentClub: true } });
  }

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      include: { student: true, presidentClub: true },
    });
  }

  updateStatus(id: string, status: EntityStatus) {
    return prisma.user.update({ where: { id }, data: { status } });
  }

  createStudentProfile(userId: string, studentNo: string, department: string) {
    return prisma.student.create({
      data: { userId, studentNo, department },
    });
  }
}

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  studentNo?: string;
  department?: string;
};
