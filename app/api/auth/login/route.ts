import { createAuthToken, toSafeAccount, verifyPassword } from "@/src/security/auth";
import { isReasonableEmail, sanitizeEmail } from "@/src/security/sanitize";
import { getApiStore, jsonError } from "@/lib/server/api-store";

export async function POST(request: Request) {
  const store = getApiStore();

  try {
    const body = await request.json();
    const email = sanitizeEmail(String(body?.email ?? ""));
    const password = String(body?.password ?? "");

    if (!isReasonableEmail(email) || !password) {
      return jsonError("Login failed. Please check your email and password.", 400);
    }

    const account = await store.getAccountByEmail(email);

    if (!account || !verifyPassword(password, account.password_hash)) {
      return jsonError("Login failed. Please check your email and password.", 401);
    }

    await store.addActivity({
      studentId: account.id,
      activityType: "auth.login",
      metadata: { success: true },
    });

    return Response.json({
      token: createAuthToken(account),
      account: toSafeAccount(account),
    });
  } catch {
    return jsonError("Login failed. Please try again.", 500);
  }
}
