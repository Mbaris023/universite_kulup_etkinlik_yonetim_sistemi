import { handleApiError, jsonOk } from "@/lib/api-response";
import { AuthService } from "@/lib/services/auth.service";

export async function POST() {
  try {
    const authService = new AuthService();
    const result = await authService.logout();
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
