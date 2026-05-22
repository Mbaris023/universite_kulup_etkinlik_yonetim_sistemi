import { handleApiError, jsonOk } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/api/with-auth";
import { requireStudent } from "@/lib/auth/guards";
import { FavoriteService } from "@/lib/services/favorite.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await getAuthenticatedUser(request);
    requireStudent(user);
    const { id } = await params;
    const service = new FavoriteService();
    const result = await service.add(id, user);
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const user = await getAuthenticatedUser(request);
    requireStudent(user);
    const { id } = await params;
    const service = new FavoriteService();
    const result = await service.remove(id, user);
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
