import { handleApiError, jsonOk } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/api/with-auth";
import { requireStudent } from "@/lib/auth/guards";
import { EnrollmentService } from "@/lib/services/enrollment.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await getAuthenticatedUser(request);
    requireStudent(user);
    const { id } = await params;
    const enrollmentService = new EnrollmentService();
    const result = await enrollmentService.enroll(id, user);
    return jsonOk(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
