const host = "http://localhost:3000";

export const api = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(host + url, {
      method: "GET",
    });
    return (await response.json()) as T;
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await fetch(host + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return (await response.json()) as T;
  },
};
