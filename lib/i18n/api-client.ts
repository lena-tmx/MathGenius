import type {
  ActivityResponse,
  AddProgressRequest,
  AuthResponse,
  CurrentAccountResponse,
  GymiTracksResponse,
  HealthResponse,
  LoginRequest,
  MockExamsResponse,
  ProgressResponse,
  RegisterRequest,
  StudyPlanResponse,
  TopicResponse,
  TopicsResponse,
  UpsertStudyPlanRequest,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type RequestOptions = Omit<RequestInit, "body"> & {
  token?: string;
  body?: unknown;
};

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as { error?: string };
      if (errorBody.error) {
        message = errorBody.error;
      }
    } catch {
      // Keep fallback error message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  health(): Promise<HealthResponse> {
    return request<HealthResponse>("/api/health");
  },

  listTopics(): Promise<TopicsResponse> {
    return request<TopicsResponse>("/api/topics");
  },

  getTopic(slug: string): Promise<TopicResponse> {
    return request<TopicResponse>(`/api/topics/${encodeURIComponent(slug)}`);
  },

  listGymiTracks(): Promise<GymiTracksResponse> {
    return request<GymiTracksResponse>("/api/gymi/tracks");
  },

  listMockExams(): Promise<MockExamsResponse> {
    return request<MockExamsResponse>("/api/gymi/mock-exams");
  },

  register(input: RegisterRequest): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: input,
    });
  },

  login(input: LoginRequest): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: input,
    });
  },

  me(token: string): Promise<CurrentAccountResponse> {
    return request<CurrentAccountResponse>("/api/auth/me", { token });
  },

  getStudyPlan(token: string): Promise<StudyPlanResponse> {
    return request<StudyPlanResponse>("/api/me/plan", { token });
  },

  upsertStudyPlan(
    token: string,
    input: UpsertStudyPlanRequest,
  ): Promise<StudyPlanResponse> {
    return request<StudyPlanResponse>("/api/me/plan", {
      method: "POST",
      token,
      body: input,
    });
  },

  listProgress(token: string): Promise<ProgressResponse> {
    return request<ProgressResponse>("/api/me/progress", { token });
  },

  addProgress(
    token: string,
    input: AddProgressRequest,
  ): Promise<ProgressResponse[number]> {
    return request<ProgressResponse[number]>("/api/me/progress", {
      method: "POST",
      token,
      body: input,
    });
  },

  listActivity(token: string): Promise<ActivityResponse> {
    return request<ActivityResponse>("/api/me/activity", { token });
  },
};
