import { getApiStore, jsonError, resolveAccountFromRequest } from "@/lib/server/api-store";

export async function GET(request: Request) {
  const store = getApiStore();
  const account = await resolveAccountFromRequest(request);

  if (!account) {
    return jsonError("Please log in again.", 401);
  }

  return Response.json(
    (await store.getStudyPlan(account.id)) ?? {
      student_id: account.id,
      goal: "gymi",
      grade_band: account.grade_band,
      intensity: "steady",
      topic_slugs: [],
    },
  );
}
