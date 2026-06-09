import { randomUUID } from "node:crypto";
import { verifyAuthToken } from "@/lib/server/api-auth";
import type { Account, ActivityEvent, ProgressEntry, StudyPlan } from "@/src/types/domain";

interface DemoApiStore {
  createAccount(input: {
    email: string;
    displayName: string;
    gradeBand: string;
    passwordHash: string;
  }): Promise<Account>;
  getAccountByEmail(email: string): Promise<Account | null>;
  getAccountById(accountId: string): Promise<Account | null>;
  getStudyPlan(studentId: string): Promise<StudyPlan | null>;
  addProgress(input: {
    studentId: string;
    topicSlug: string;
    status: ProgressEntry["status"];
    score?: number | null;
  }): Promise<ProgressEntry>;
  listProgress(studentId: string): Promise<ProgressEntry[]>;
  addActivity(input: {
    studentId: string;
    activityType: string;
    topicSlug?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ActivityEvent>;
}

function createDemoApiStore(): DemoApiStore {
  const accounts = new Map<string, Account>();
  const studyPlans = new Map<string, StudyPlan>();
  const progressEntries: ProgressEntry[] = [];
  const activityEvents: ActivityEvent[] = [];

  return {
    async createAccount(input) {
      const account: Account = {
        id: randomUUID(),
        email: input.email,
        display_name: input.displayName,
        grade_band: input.gradeBand,
        password_hash: input.passwordHash,
        created_at: new Date().toISOString(),
      };

      accounts.set(account.id, account);
      return account;
    },

    async getAccountByEmail(email) {
      return [...accounts.values()].find((account) => account.email === email) ?? null;
    },

    async getAccountById(accountId) {
      return accounts.get(accountId) ?? null;
    },

    async getStudyPlan(studentId) {
      return studyPlans.get(studentId) ?? null;
    },

    async addProgress(input) {
      const entry: ProgressEntry = {
        student_id: input.studentId,
        topic_slug: input.topicSlug,
        status: input.status,
        score: input.score ?? null,
        completed_at: new Date().toISOString(),
      };

      progressEntries.push(entry);
      return entry;
    },

    async listProgress(studentId) {
      return progressEntries.filter((entry) => entry.student_id === studentId);
    },

    async addActivity(input) {
      const event: ActivityEvent = {
        id: randomUUID(),
        student_id: input.studentId,
        activity_type: input.activityType,
        topic_slug: input.topicSlug ?? null,
        metadata: input.metadata ?? {},
        created_at: new Date().toISOString(),
      };

      activityEvents.push(event);
      return event;
    },
  };
}

const globalForStore = globalThis as typeof globalThis & {
  mathGeniusStore?: DemoApiStore;
};

export function getApiStore() {
  globalForStore.mathGeniusStore ??= createDemoApiStore();
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
