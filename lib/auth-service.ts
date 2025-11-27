import { apiClient } from "./api-client"

export const authService = {
  async register(name: string, email: string, password: string) {
    const response = await apiClient.post("/auth/register", {
      name,
      email,
      password,
    })
    if (response.token) {
      localStorage.setItem("authToken", response.token)
      localStorage.setItem("userEmail", email)
    }
    return response
  },

  async login(email: string, password: string) {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    })
    if (response.token) {
      localStorage.setItem("authToken", response.token)
      localStorage.setItem("userEmail", email)
    }
    return response
  },

  async getOrCreateUser(email: string, name: string, image?: string, provider?: string) {
    const response = await apiClient.post("/auth/user", {
      email,
      name,
      image,
      provider,
    })
    if (response.token) {
      localStorage.setItem("authToken", response.token)
      localStorage.setItem("userEmail", email)
    }
    return response
  },

  logout() {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userEmail")
  },

  getStoredEmail() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userEmail")
    }
    return null
  },

  isAuthenticated() {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("authToken")
    }
    return false
  },
}
