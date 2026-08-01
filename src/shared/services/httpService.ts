export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || "";
  // Resolve URL: if it is already absolute, use it; otherwise combine with baseUrl
  const url = endpoint.startsWith("http://") || endpoint.startsWith("https://")
    ? endpoint
    : `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Network error while consulting the archives.");
  }
  return data as T;
}

