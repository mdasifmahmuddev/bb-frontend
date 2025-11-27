"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
     if (pathname === '/admin/login') {
      setIsLoading(false)
      return
    }

    checkAdminAuth()
  }, [pathname])

  const checkAdminAuth = () => {
     const adminToken = localStorage.getItem('adminToken')
    
    if (!adminToken) {
       router.push('/admin/login')
      return
    }

     try {
       const payload = JSON.parse(atob(adminToken.split('.')[1]))
      const isExpired = payload.exp * 1000 < Date.now()
      
      if (isExpired) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        router.push('/admin/login')
        return
      }

       if (!payload.isAdmin) {
        alert('Access denied. Admin privileges required.')
        router.push('/')
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      console.error('Invalid token:', error)
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      router.push('/admin/login')
    } finally {
      setIsLoading(false)
    }
  }

   if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}