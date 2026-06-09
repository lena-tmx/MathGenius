import { TOPIC_CONFIGS, type TopicConfig } from "@/types/exercises";

export type ProgressStatus = "not-started" | "started" | "practicing" | "completed";

export interface TopicProgressSnapshot {
  slug: string;
  status: ProgressStatus;
  score: number | null;
}

export interface TopicRecommendation {
  slug: string;
  title: string;
  track: TopicConfig["track"];
  reason: string;
  priority: "high" | "medium" | "low";
}

const TRACK_LABELS: Record<TopicConfig["track"], string> = {
  kurz: "Kurzgymnasium",
  lang: "Langgymnasium",
};

export function getDemoProgress(): TopicProgressSnapshot[] {
  return TOPIC_CONFIGS.map((topic, index) => ({
    slug: topic.slug,
    status: index === 0 ? "completed" : index === 1 ? "practicing" : index === 2 ? "started" : "not-started",
    score: index === 0 ? 88 : index === 1 ? 62 : null,
  }));
}

export function getProgressForTopic(slug: string, progress = getDemoProgress()): TopicProgressSnapshot {
  return progress.find((entry) => entry.slug === slug) ?? { slug, status: "not-started", score: null };
}

export function getCompletionSummary(progress = getDemoProgress()) {
  const total = TOPIC_CONFIGS.length;
  const completed = progress.filter((entry) => entry.status === "completed").length;
  const active = progress.filter((entry) => entry.status === "started" || entry.status === "practicing").length;
  const averageScoreEntries = progress.filter((entry) => typeof entry.score === "number");
  const averageScore = averageScoreEntries.length === 0
    ? null
    : Math.round(averageScoreEntries.reduce((sum, entry) => sum + (entry.score ?? 0), 0) / averageScoreEntries.length);

  return {
    total,
    completed,
    active,
    remaining: Math.max(total - completed, 0),
    completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
    averageScore,
  };
}

export function getUserRecommendations(progress = getDemoProgress()): TopicRecommendation[] {
  const bySlug = new Map(progress.map((entry) => [entry.slug, entry]));

  return TOPIC_CONFIGS.map((topic) => {
    const topicProgress = bySlug.get(topic.slug);
    const score = topicProgress?.score ?? null;
    const status = topicProgress?.status ?? "not-started";

    if (status === "not-started") {
      return {
        slug: topic.slug,
        title: topic.title_de,
        track: topic.track,
        reason: `Start this ${TRACK_LABELS[topic.track]} topic to broaden exam coverage.`,
        priority: "high" as const,
      };
    }

    if (status === "practicing" || (typeof score === "number" && score < 75)) {
      return {
        slug: topic.slug,
        title: topic.title_de,
        track: topic.track,
        reason: "Continue practice here: the topic is active or the current score is below the target threshold.",
        priority: "medium" as const,
      };
    }

    return {
      slug: topic.slug,
      title: topic.title_de,
      track: topic.track,
      reason: "Keep this topic warm with a short mixed review before the next mock exam.",
      priority: "low" as const,
    };
  }).sort((a, b) => {
    const weight = { high: 0, medium: 1, low: 2 };
    return weight[a.priority] - weight[b.priority];
  }).slice(0, 3);
}

export function getTopicHref(topic: Pick<TopicConfig, "track" | "slug">) {
  return `/${topic.track}/${topic.slug}`;
}
