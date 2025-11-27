 "use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, ShoppingCart, DollarSign, Users, LogOut } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Stats {
  totalProducts: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [adminUser, setAdminUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const user = localStorage.getItem('adminUser')
      
      if (user) {
        setAdminUser(JSON.parse(user))
      }

      // Fetch admin stats
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to load admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted">
                Welcome back, {adminUser?.username || 'Admin'}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded hover:bg-accent transition"
              >
                View Website
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-error text-white rounded hover:bg-red-700 transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <Package className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats?.totalProducts || 0}</h3>
              <p className="text-muted text-sm">Total Products</p>
            </div>

            <div className="bg-white p-6 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <ShoppingCart className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats?.totalOrders || 0}</h3>
              <p className="text-muted text-sm">Total Orders</p>
            </div>

            <div className="bg-white p-6 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-orange-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats?.pendingOrders || 0}</h3>
              <p className="text-muted text-sm">Pending Orders</p>
            </div>

            <div className="bg-white p-6 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-1">৳{stats?.totalRevenue || 0}</h3>
              <p className="text-muted text-sm">Total Revenue</p>
            </div>
          </div>

           <div className="bg-white border border-border rounded-lg p-6">
            <h2 className="text-xl font-serif font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/add-product"
                className="p-6 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent transition text-center"
              >
                <Package className="mx-auto mb-3 text-primary" size={32} />
                <h3 className="font-medium mb-1">Add Product</h3>
                <p className="text-sm text-muted">Create a new product</p>
              </Link>

              <Link
                href="/admin/manage-products"
                className="p-6 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent transition text-center"
              >
                <Package className="mx-auto mb-3 text-primary" size={32} />
                <h3 className="font-medium mb-1">Manage Products</h3>
                <p className="text-sm text-muted">Edit or delete products</p>
              </Link>

              <Link
                href="/admin/orders"
                className="p-6 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent transition text-center"
              >
                <ShoppingCart className="mx-auto mb-3 text-primary" size={32} />
                <h3 className="font-medium mb-1">Manage Orders</h3>
                <p className="text-sm text-muted">View and update orders</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}