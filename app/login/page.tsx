"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import { Mail, Lock, Chrome } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { authService } from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

   useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
       localStorage.setItem("userEmail", session.user.email)
      
      toast({
        title: "Success",
        description: "Logged in with Google successfully!",
      })
      router.push("/")
    }
  }, [status, session, router, toast])

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn("google", { callbackUrl: "/" })
    } catch (error) {
      console.error("Google sign-in error:", error)
      toast({
        title: "Login Failed",
        description: "Failed to sign in with Google",
        variant: "destructive",
      })
      setIsGoogleLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setIsLoading(true)
    try {
      const user = await authService.login(formData.email, formData.password)
      localStorage.setItem("user", JSON.stringify(user))
      toast({
        title: "Success",
        description: "Logged in successfully!",
      })
      router.push("/")
    } catch (error) {
      console.error("[v0] Login error:", error)
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 border border-border">
            <h1 className="text-3xl font-serif font-bold text-center mb-2">Login</h1>
            <p className="text-center text-muted mb-8">Welcome back to BanglaBaari</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-muted" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors({ ...errors, email: "" })
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-border focus:outline-none focus:border-primary transition"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-muted" size={18} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      if (errors.password) setErrors({ ...errors, password: "" })
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-border focus:outline-none focus:border-primary transition"
                    placeholder="••••••"
                  />
                </div>
                {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span>Remember me</span>
                </label>
                <Link href="#" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-white font-medium hover:bg-primary-light transition disabled:opacity-50"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted">OR</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-3 border border-border text-black font-medium hover:bg-accent transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Chrome size={18} />
              {isGoogleLoading ? "Signing in..." : "Continue with Google"}
            </button>

            <p className="text-center text-sm text-muted mt-8">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}