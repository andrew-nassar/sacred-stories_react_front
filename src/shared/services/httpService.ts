const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7131';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // تأكد من دمج الـ Base URL مع المسار
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  const token = typeof window !== "undefined" ? localStorage.getItem("sacred_stories_access_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // التحقق من نوع المحتوى المراجع قبل محاولة تحويله إلى JSON
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Non-JSON Response Received:", text);
    throw new Error(`Server returned non-JSON response (${response.status} ${response.statusText}). Check API URL or Server logs.`);
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}