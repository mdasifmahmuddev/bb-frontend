"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { User, Mail, Lock, Chrome } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { authService } from "@/lib/auth-service"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
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
      await authService.register(formData.name, formData.email, formData.password)
      toast({
        title: "Success",
        description: "Account created successfully! Redirecting...",
      })
      router.push("/")
    } catch (error) {
      console.error("[v0] Register error:", error)
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
           <div className="bg-white p-8 border border-border">
            <h1 className="text-3xl font-serif font-bold text-center mb-2">Create Account</h1>
            <p className="text-center text-muted mb-8">Join BanglaBaari today</p>

            <form onSubmit={handleSubmit} className="space-y-5">
               <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-muted" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) setErrors({ ...errors, name: "" })
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-border focus:outline-none focus:border-primary transition"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
              </div>

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

               <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-muted" size={18} />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value })
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" })
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-border focus:outline-none focus:border-primary transition"
                    placeholder="••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

               <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-white font-medium hover:bg-primary-light transition disabled:opacity-50 mt-6"
              >
                {isLoading ? "Creating account..." : "Register"}
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

             <button className="w-full py-3 border border-border text-black font-medium hover:bg-accent transition flex items-center justify-center gap-2">
              <Chrome size={18} />
              Continue with Google
            </button>

             <p className="text-center text-sm text-muted mt-8">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
