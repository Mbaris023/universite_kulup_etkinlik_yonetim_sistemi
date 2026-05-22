import { handleApiError, jsonOk } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/api/with-auth";
import { requirePresident } from "@/lib/auth/guards";
import { EventService } from "@/lib/services/event.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { getSessionFromRequest } = await import("@/lib/auth/session");
    const user = await getSessionFromRequest(request);
    const eventService = new EventService();
    const event = await eventService.getById(id, user);
    return jsonOk({ event });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const user = await getAuthenticatedUser(request);
    requirePresident(user);
    const { id } = await params;
    const body = await request.json();
    const eventService = new EventService();
    const event = await eventService.update(id, body, user);
    return jsonOk({ event });
  } catch (error) {
    return handleApiError(error);
  }
}
