import { handleApiError, jsonOk } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/api/with-auth";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminService } from "@/lib/services/admin.service";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const user = await getAuthenticatedUser(request);
    requireAdmin(user);
    const { id } = await params;
    const body = await request.json();
    const adminService = new AdminService();
    const club = await adminService.updateClub(id, body);
    return jsonOk({ club });
  } catch (error) {
    return handleApiError(error);
  }
}
