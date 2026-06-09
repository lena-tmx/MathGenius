import { createAuthToken, hashPassword, toSafeAccount } from "@/lib/server/api-auth";
import {
  isReasonableEmail,
  isReasonablePassword,
  sanitizeDisplayName,
  sanitizeEmail,
  sanitizeGradeBand,
} from "@/src/security/sanitize";
import { getApiStore, jsonError } from "@/lib/server/api-store";

export async function POST(request: Request) {
  const store = getApiStore();

  try {
    const body = await request.json();
    const email = sanitizeEmail(String(body?.email ?? ""));
    const password = String(body?.password ?? "");
    const rawDisplayName = sanitizeDisplayName(String(body?.displayName ?? ""));
    const displayName =
      rawDisplayName ||
      email
        .split("@")[0]
        ?.replace(/[._-]+/g, " ")
        .trim()
        .slice(0, 40) ||
      "Learner";
    const gradeBand = sanitizeGradeBand(String(body?.gradeBand ?? "")) || "5-6";

    if (!isReasonableEmail(email) || !isReasonablePassword(password)) {
      return jsonError("Please enter a valid email and a password with at least 8 characters.", 400);
    }

    const existingAccount = await store.getAccountByEmail(email);

    if (existingAccount) {
      return jsonError("An account with this email already exists.", 409);
    }

    const account = await store.createAccount({
      email,
      displayName,
      gradeBand,
      passwordHash: hashPassword(password),
    });

    await store.addActivity({
      studentId: account.id,
      activityType: "auth.register",
      metadata: { gradeBand: account.grade_band },
    });

    return Response.json(
      {
        token: createAuthToken(account),
        account: toSafeAccount(account),
      },
      { status: 201 },
    );
  } catch {
    return jsonError("Create account failed. Please check your details and try again.", 500);
  }
}
