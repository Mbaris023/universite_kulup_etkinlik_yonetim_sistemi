import { getSessionFromRequest } from "@/lib/auth/session";
import { requireAuth } from "@/lib/auth/guards";
import type { SessionUser } from "@/types";

export async function getAuthenticatedUser(request: Request): Promise<SessionUser> {
  const session = await getSessionFromRequest(request);
  return requireAuth(session);
}
