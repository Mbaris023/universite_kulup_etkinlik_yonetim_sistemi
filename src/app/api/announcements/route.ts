import { handleApiError, jsonOk } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/api/with-auth";
import { requirePresident } from "@/lib/auth/guards";
import { AnnouncementService } from "@/lib/services/announcement.service";

export async function GET() {
  try {
    const announcementService = new AnnouncementService();
    const announcements = await announcementService.listActive();
    return jsonOk({ announcements });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    requirePresident(user);
    const body = await request.json();
    const announcementService = new AnnouncementService();
    const announcement = await announcementService.create(body, user);
    return jsonOk({ announcement }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
