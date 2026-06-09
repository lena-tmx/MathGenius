import { toSafeAccount } from "@/src/security/auth";
import { jsonError, resolveAccountFromRequest } from "@/lib/server/api-store";

export async function GET(request: Request) {
  const account = await resolveAccountFromRequest(request);

  if (!account) {
    return jsonError("Please log in again.", 401);
  }

  return Response.json({
    account: toSafeAccount(account),
  });
}
