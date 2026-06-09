import type {
  ActivityEvent,
  GymiTrack,
  MockExam,
  ProgressEntry,
  SafeAccount,
  StudyPlan,
  Topic,
} from "@/src/types/domain";

export interface ApiErrorResponse {
  error: string;
}

export interface HealthResponse {
  ok: boolean;
  database?: string;
  timestamp?: string;
  error?: string;
}

export interface AuthResponse {
  token: string;
  account: SafeAccount;
}

export interface CurrentAccountResponse {
  account: SafeAccount;
}

export interface TopicsResponse extends Array<Topic> {}

export interface TopicResponse extends Topic {}

export interface GymiTracksResponse extends Array<GymiTrack> {}

export interface MockExamsResponse extends Array<MockExam> {}

export interface StudyPlanResponse extends StudyPlan {}

export interface ProgressResponse extends Array<ProgressEntry> {}

export interface ActivityResponse extends Array<ActivityEvent> {}

export interface UpsertStudyPlanRequest {
  goal: string;
  gradeBand: string;
  intensity: string;
  topicSlugs: string[];
}

export interface AddProgressRequest {
  topicSlug: string;
  status: "started" | "practicing" | "completed";
  score?: number | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
  gradeBand?: string;
}
