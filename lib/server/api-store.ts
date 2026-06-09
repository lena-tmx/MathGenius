import { createInMemoryStore } from "@/src/store/in-memory-store";
import { verifyAuthToken } from "@/src/security/auth";
import type { Account } from "@/src/types/domain";

const globalForStore = globalThis as typeof globalThis & {
  mathGeniusStore?: ReturnType<typeof createInMemoryStore>;
};

export function getApiStore() {
  globalForStore.mathGeniusStore ??= createInMemoryStore();
  return globalForStore.mathGeniusStore;
}

export async function resolveAccountFromRequest(request: Request): Promise<Account | null> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const payload = verifyAuthToken(token);

  if (!payload) {
    return null;
  }

  return getApiStore().getAccountById(payload.sub);
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
