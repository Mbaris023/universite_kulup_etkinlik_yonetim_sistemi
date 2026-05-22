import { handleApiError, jsonOk } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/api/with-auth";
import { requireStudent } from "@/lib/auth/guards";
import { EventService } from "@/lib/services/event.service";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    requireStudent(user);
    const service = new EventService();
    const events = await service.listEnrolled(user);
    return jsonOk({ events });
  } catch (error) {
    return handleApiError(error);
  }
}
