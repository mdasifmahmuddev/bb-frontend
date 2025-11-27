"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, Search, Menu, X, LogOut, Shield, User, Package, Settings, ShoppingBag, ChevronDown } from "lucide-react"
import { authService } from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  
  const { data: session, status } = useSession()

  const isLoggedIn = status === "authenticated" || (isMounted && authService.isAuthenticated())
  const userEmail = session?.user?.email || (isMounted ? authService.getStoredEmail() : null)
  const userName = session?.user?.name || (userEmail ? userEmail.split('@')[0] : 'User')

  useEffect(() => {
    setIsMounted(true)
    
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      try {
        const payload = JSON.parse(atob(adminToken.split('.')[1]))
        setIsAdmin(payload.isAdmin === true)
      } catch {
        setIsAdmin(false)
      }
    }

    const cartData = localStorage.getItem("cart")
    if (cartData) {
      try {
        const cart = JSON.parse(cartData)
        setCartCount(cart.length || 0)
      } catch {
        setCartCount(0)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.dropdown-container')) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    if (session) {
      await signOut({ callbackUrl: "/" })
    } else {
      authService.logout()
      localStorage.removeItem("cart")
      router.push("/")
    }
    
    toast({
      title: "Success",
      description: "Logged out successfully",
    })
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setIsAdmin(false)
    toast({
      title: "Success",
      description: "Admin logged out successfully",
    })
    router.push("/")
  }

  if (!isMounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="text-2xl font-serif font-bold text-black hover:text-primary transition">
              BanglaBaari
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium hover:text-primary transition">Home</Link>
              <Link href="/shop" className="text-sm font-medium hover:text-primary transition">Shop</Link>
              <Link href="/shop?new=true" className="text-sm font-medium hover:text-primary transition">New Arrivals</Link>
              <Link href="/shop?winter=true" className="text-sm font-medium hover:text-primary transition">Winter Collection</Link>
              <Link href="#about" className="text-sm font-medium hover:text-primary transition">About</Link>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <Search size={20} />
              </button>
              <div className="p-2 hover:bg-gray-100 rounded-full transition relative">
                <ShoppingCart size={20} />
              </div>
            </div>
            <button className="md:hidden p-2">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-serif font-bold text-black hover:text-primary transition">
            BanglaBaari
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition">
              Home
            </Link>
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition">
              Shop
            </Link>
            <Link href="/shop?new=true" className="text-sm font-medium hover:text-primary transition">
              New Arrivals
            </Link>
            <Link href="/shop?winter=true" className="text-sm font-medium hover:text-primary transition">
              Winter Collection
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition">
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <Search size={20} />
            </button>
            <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAdmin ? (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 rounded-full transition group"
                >
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    <Shield size={16} />
                  </div>
                  <span className="text-sm font-medium text-primary">Admin</span>
                  <ChevronDown size={16} className={`text-primary transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                          <Shield size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">Admin Panel</p>
                          <p className="text-xs text-gray-600">Full Access</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Shield size={18} className="text-primary" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                      <Link
                        href="/admin/add-product"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Package size={18} className="text-gray-500" />
                        <span className="font-medium">Add Product</span>
                      </Link>
                      <Link
                        href="/admin/manage-products"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Settings size={18} className="text-gray-500" />
                        <span className="font-medium">Manage Products</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-200 bg-gray-50">
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          handleAdminLogout()
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error font-medium hover:bg-red-50 transition"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : isLoggedIn ? (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition group"
                >
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{userName}</span>
                  <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                          <p className="text-xs text-gray-600 truncate">{userEmail}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        <ShoppingBag size={18} className="text-gray-500" />
                        <span className="font-medium">My Orders</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-200 bg-gray-50">
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          handleLogout()
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error font-medium hover:bg-red-50 transition"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 border-2 border-primary text-primary text-sm font-medium rounded-lg hover:bg-primary hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col gap-1 mt-4">
              <Link href="/" className="text-sm font-medium px-4 py-3 hover:bg-gray-50 rounded-lg transition">
                Home
              </Link>
              <Link href="/shop" className="text-sm font-medium px-4 py-3 hover:bg-gray-50 rounded-lg transition">
                Shop
              </Link>
              <Link href="/shop?new=true" className="text-sm font-medium px-4 py-3 hover:bg-gray-50 rounded-lg transition">
                New Arrivals
              </Link>
              <Link href="/shop?winter=true" className="text-sm font-medium px-4 py-3 hover:bg-gray-50 rounded-lg transition">
                Winter Collection
              </Link>
              <Link href="#about" className="text-sm font-medium px-4 py-3 hover:bg-gray-50 rounded-lg transition">
                About
              </Link>
              
              {isAdmin ? (
                <>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <div className="px-4 py-3 bg-primary/10 rounded-lg mx-4 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                          <Shield size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Admin Panel</p>
                          <p className="text-xs text-gray-600">Full Access</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-sm font-medium px-4 py-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <Shield size={18} className="text-primary" />
                      Dashboard
                    </Link>
                    <Link
                      href="/admin/add-product"
                      className="flex items-center gap-2 text-sm font-medium px-4 py-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <Package size={18} />
                      Add Product
                    </Link>
                    <Link
                      href="/admin/manage-products"
                      className="flex items-center gap-2 text-sm font-medium px-4 py-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <Settings size={18} />
                      Manage Products
                    </Link>
                    <button
                      onClick={handleAdminLogout}
                      className="w-full mt-2 mx-4 px-4 py-3 bg-error text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2"
                      style={{width: 'calc(100% - 2rem)'}}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              ) : isLoggedIn ? (
                <>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <div className="px-4 py-3 bg-gray-50 rounded-lg mx-4 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                          <p className="text-xs text-gray-600 truncate">{userEmail}</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2 text-sm font-medium px-4 py-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <ShoppingBag size={18} />
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full mt-2 mx-4 px-4 py-3 bg-error text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2"
                      style={{width: 'calc(100% - 2rem)'}}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-200 mt-2 pt-2 px-4 space-y-2">
                    <Link href="/login" className="block px-4 py-3 border-2 border-primary text-primary text-sm font-medium text-center rounded-lg hover:bg-primary hover:text-white transition">
                      Login
                    </Link>
                    <Link href="/register" className="block px-4 py-3 bg-primary text-white text-sm font-medium text-center rounded-lg hover:bg-primary-light transition">
                      Register
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}