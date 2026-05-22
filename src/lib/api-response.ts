import { NextResponse } from "next/server";
import { AppError, isAppError } from "@/lib/errors";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400, code?: string) {
  return NextResponse.json({ message, code }, { status });
}

export function handleApiError(error: unknown) {
  if (isAppError(error)) {
    return jsonError(error.message, error.statusCode, error.code);
  }
  console.error(error);
  return jsonError("Beklenmeyen bir sunucu hatası oluştu.", 500, "INTERNAL_ERROR");
}
