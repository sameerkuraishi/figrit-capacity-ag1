const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

export type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    const data: unknown = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : `Request failed (${response.status})`;
      return { ok: false, error: message };
    }
    return { ok: true, data: data as T };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Backend unavailable",
    };
  }
}

export async function login(email: string, password: string) {
  return apiRequest<{ token: string; user: unknown }>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  role: "trainee" | "trainer";
  organization?: string;
  department?: string;
  designation?: string;
  qualification?: string;
  experience_years?: number;
  domain?: string;
  preferred_language?: string;
}) {
  return apiRequest<{ registered: boolean; pendingApproval?: boolean; token?: string; user: unknown }>("/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
