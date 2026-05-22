import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta giriniz."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
});

export const eventCreateSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır."),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır."),
  location: z.string().min(2, "Konum giriniz."),
  category: z.string().min(2).optional(),
  coverKey: z.string().min(2).optional(),
  startTime: z.union([z.string().datetime(), z.coerce.date()], {
    errorMap: () => ({ message: "Geçerli bir tarih giriniz." }),
  }),
  quota: z.number().int().positive("Kontenjan pozitif olmalıdır."),
});

export const eventUpdateSchema = eventCreateSchema.partial().extend({
  status: z.enum(["ACTIVE", "CANCELLED"]).optional(),
});

export const announcementSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

export const adminUserCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "CLUB_PRESIDENT", "ADMIN"]),
  studentNo: z.string().optional(),
  department: z.string().optional(),
});

export const adminUserUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["STUDENT", "CLUB_PRESIDENT", "ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  studentNo: z.string().optional(),
  department: z.string().optional(),
});

export const adminClubCreateSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  presidentUserId: z.string().min(1),
});

export const adminClubUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  presidentUserId: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
