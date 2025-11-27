const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`

    let token: string | null = null
    if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken")
    }

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || `API Error: ${response.status}`)
    }

    return response.json()
  },

  get(endpoint: string) {
    return this.request(endpoint, { method: "GET" })
  },

  post(endpoint: string, body: unknown) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    })
  },

  put(endpoint: string, body: unknown) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    })
  },

  delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" })
  },
}
