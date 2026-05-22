import { handleApiError, jsonOk } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/api/with-auth";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminService } from "@/lib/services/admin.service";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    requireAdmin(user);
    const adminService = new AdminService();
    const summary = await adminService.getReportSummary();
    return jsonOk({ summary });
  } catch (error) {
    return handleApiError(error);
  }
}
