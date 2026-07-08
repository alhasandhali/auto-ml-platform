let globalAccessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

export const setGlobalAccessToken = (token: string | null) => {
  globalAccessToken = token;
};

export const getGlobalAccessToken = () => globalAccessToken;

const onRefreshed = (token: string | null) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string | null) => void) => {
  refreshSubscribers.push(callback);
};

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : (input as Request).url;
  
  // Attach token
  const headers = new Headers(init?.headers);
  if (globalAccessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${globalAccessToken}`);
  }
  
  // Always include credentials for cookies (e.g. HttpOnly refresh token)
  const fetchOptions: RequestInit = {
    ...init,
    headers,
    credentials: "include",
  };

  let response = await fetch(input, fetchOptions);

  // If 401, handle token refresh
  if (response.status === 401 && !url.includes("/api/auth/login") && !url.includes("/api/auth/refresh") && !url.includes("/api/auth/logout") && !url.includes("/api/auth/register")) {
    if (isRefreshing) {
      // Wait for the ongoing refresh to complete
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          if (newToken) {
            // Retry the request with the new token
            const newHeaders = new Headers(init?.headers);
            newHeaders.set("Authorization", `Bearer ${newToken}`);
            resolve(fetch(input, { ...fetchOptions, headers: newHeaders }));
          } else {
            // If refresh failed, just return the 401 response
            resolve(response);
          }
        });
      });
    }

    isRefreshing = true;
    try {
      const refreshResponse = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setGlobalAccessToken(data.access_token);
        
        // Retry the original request
        const newHeaders = new Headers(init?.headers);
        newHeaders.set("Authorization", `Bearer ${data.access_token}`);
        
        onRefreshed(data.access_token);
        return await fetch(input, { ...fetchOptions, headers: newHeaders });
      } else {
        // Refresh failed (e.g., cookie expired or missing)
        setGlobalAccessToken(null);
        onRefreshed(null);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event("auth:logout"));
        }
        return response;
      }
    } catch (err) {
      setGlobalAccessToken(null);
      onRefreshed(null);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event("auth:logout"));
      }
      return response;
    } finally {
      isRefreshing = false;
    }
  }

  return response;
}
