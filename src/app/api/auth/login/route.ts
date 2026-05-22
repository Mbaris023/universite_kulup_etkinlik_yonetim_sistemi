import { handleApiError, jsonOk } from "@/lib/api-response";
import { AuthService } from "@/lib/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authService = new AuthService();
    const result = await authService.login(body);
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
