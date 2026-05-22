import { handleApiError, jsonOk } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/api/with-auth";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminService } from "@/lib/services/admin.service";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    requireAdmin(user);
    const adminService = new AdminService();
    const users = await adminService.listUsers();
    return jsonOk({ users });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    requireAdmin(user);
    const body = await request.json();
    const adminService = new AdminService();
    const created = await adminService.createUser(body);
    return jsonOk({ user: created }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
