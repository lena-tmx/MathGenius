import { getApiStore, jsonError, resolveAccountFromRequest } from "@/lib/server/api-store";
import { sanitizeTopicSlug } from "@/src/security/sanitize";
import type { ProgressStatus } from "@/src/types/domain";

const allowedStatuses: ProgressStatus[] = ["started", "practicing", "completed"];

export async function GET(request: Request) {
  const store = getApiStore();
  const account = await resolveAccountFromRequest(request);

  if (!account) {
    return jsonError("Please log in again.", 401);
  }

  return Response.json(await store.listProgress(account.id));
}

export async function POST(request: Request) {
  const store = getApiStore();
  const account = await resolveAccountFromRequest(request);

  if (!account) {
    return jsonError("Please log in again.", 401);
  }

  try {
    const body = await request.json();
    const topicSlug = sanitizeTopicSlug(String(body?.topicSlug ?? ""));
    const status = body?.status as ProgressStatus | undefined;
    const scoreValue = body?.score === undefined || body?.score === null ? undefined : Number(body.score);

    if (!topicSlug || !status || !allowedStatuses.includes(status)) {
      return jsonError("Progress could not be saved. Please select a valid topic and status.", 400);
    }

    const entry = await store.addProgress({
      studentId: account.id,
      topicSlug,
      status,
      ...(Number.isFinite(scoreValue) ? { score: scoreValue } : {}),
    });

    await store.addActivity({
      studentId: account.id,
      activityType: status === "completed" ? "topic.completed" : "progress.recorded",
      topicSlug,
      metadata: {
        status,
        ...(Number.isFinite(scoreValue) ? { score: scoreValue } : {}),
      },
    });

    return Response.json(entry, { status: 201 });
  } catch {
    return jsonError("Progress could not be saved. Please try again.", 500);
  }
}
