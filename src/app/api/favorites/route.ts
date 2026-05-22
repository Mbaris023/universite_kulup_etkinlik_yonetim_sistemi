import { handleApiError, jsonOk } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/api/with-auth";
import { requireStudent } from "@/lib/auth/guards";
import { FavoriteService } from "@/lib/services/favorite.service";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    requireStudent(user);
    const service = new FavoriteService();
    const favorites = await service.list(user);
    return jsonOk({ favorites });
  } catch (error) {
    return handleApiError(error);
  }
}
