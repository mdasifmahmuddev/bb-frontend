"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, Search, Menu, X, LogOut, Shield, Package, Settings, ShoppingBag, ChevronDown } from "lucide-react"
import { authService } from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  
  const { data: session, status } = useSession()

  const isLoggedIn = status === "authenticated" || (isMounted && authService.isAuthenticated())
  const userEmail = session?.user?.email || (isMounted ? authService.getStoredEmail() : null)
  const userName = session?.user?.name || (userEmail ? userEmail.split('@')[0] : 'User')

  useEffect(() => {
    setIsMounted(true)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    
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

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.dropdown-container')) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll)
    }
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E8C999] via-[#8E1616] to-[#E8C999] rounded-lg flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-[#000000] font-extrabold text-xl">B</span>
              </div>
              <span className="text-2xl font-serif font-bold bg-gradient-to-r from-[#E8C999] via-[#F8EEDF] to-[#E8C999] bg-clip-text text-transparent">
                BanglaBaari
              </span>
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-black/90 backdrop-blur-2xl shadow-2xl border-b border-white/20' 
        : 'bg-black/70 backdrop-blur-xl border-b border-white/10'
    }`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="flex items-center gap-3 group relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-[#E8C999] via-[#8E1616] to-[#E8C999] rounded-lg flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-[#000000] font-extrabold text-xl relative z-10">B</span>
            </div>
            <span className="text-2xl font-serif font-bold bg-gradient-to-r from-[#E8C999] via-[#F8EEDF] to-[#E8C999] bg-clip-text text-transparent bg-size-200 animate-gradient">
              BanglaBaari
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 text-sm font-semibold text-white/90 hover:text-[#E8C999] transition-all duration-300 relative group">
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#E8C999] to-[#8E1616] group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/shop" className="px-4 py-2 text-sm font-semibold text-white/90 hover:text-[#E8C999] transition-all duration-300 relative group">
              <span className="relative z-10">Shop</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#E8C999] to-[#8E1616] group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/shop?new=true" className="px-4 py-2 text-sm font-semibold text-white/90 hover:text-[#E8C999] transition-all duration-300 relative group">
              <span className="relative z-10">New Arrivals</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#E8C999] to-[#8E1616] group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/shop?winter=true" className="px-4 py-2 text-sm font-semibold text-white/90 hover:text-[#E8C999] transition-all duration-300 relative group">
              <span className="relative z-10">Winter Collection</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#E8C999] to-[#8E1616] group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/about" className="px-4 py-2 text-sm font-semibold text-white/90 hover:text-[#E8C999] transition-all duration-300 relative group">
              <span className="relative z-10">About</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#E8C999] to-[#8E1616] group-hover:w-full transition-all duration-300"></div>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button className="p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 group relative">
              <Search size={20} className="text-white/90 group-hover:text-[#E8C999] transition-colors" />
              <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/30 transition-all duration-300"></div>
            </button>
            
            <Link href="/cart" className="p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 relative group">
              <ShoppingCart size={20} className="text-white/90 group-hover:text-[#E8C999] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#8E1616] to-[#E8C999] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
              <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/30 transition-all duration-300"></div>
            </Link>

            {isAdmin ? (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/20 backdrop-blur-xl group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#E8C999] to-[#8E1616] rounded-full flex items-center justify-center font-semibold shadow-lg">
                    <Shield size={16} className="text-[#000000]" />
                  </div>
                  <span className="text-sm font-bold text-[#E8C999]">Admin</span>
                  <ChevronDown size={16} className={`text-[#E8C999] transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-black/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="p-4 bg-gradient-to-br from-white/10 to-white/5 border-b border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#E8C999] to-[#8E1616] rounded-full flex items-center justify-center shadow-xl">
                          <Shield size={24} className="text-[#000000]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#E8C999]">Admin Panel</p>
                          <p className="text-xs text-white/70">Full Access</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-white/90 hover:bg-white/10 transition-colors" onClick={() => setShowDropdown(false)}>
                        <Shield size={18} className="text-[#E8C999]" />
                        <span className="font-semibold">Dashboard</span>
                      </Link>
                      <Link href="/admin/add-product" className="flex items-center gap-3 px-4 py-3 text-sm text-white/90 hover:bg-white/10 transition-colors" onClick={() => setShowDropdown(false)}>
                        <Package size={18} className="text-white/70" />
                        <span className="font-semibold">Add Product</span>
                      </Link>
                      <Link href="/admin/manage-products" className="flex items-center gap-3 px-4 py-3 text-sm text-white/90 hover:bg-white/10 transition-colors" onClick={() => setShowDropdown(false)}>
                        <Settings size={18} className="text-white/70" />
                        <span className="font-semibold">Manage Products</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-white/20 bg-black/50">
                      <button onClick={() => { setShowDropdown(false); handleAdminLogout() }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#8E1616] font-bold hover:bg-[#8E1616]/10 transition-colors">
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
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/20 backdrop-blur-xl group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#E8C999] to-[#F8EEDF] rounded-full flex items-center justify-center font-bold text-sm shadow-lg text-[#000000]">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-white/90 max-w-[100px] truncate">{userName}</span>
                  <ChevronDown size={16} className={`text-[#E8C999] transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-black/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="p-4 bg-gradient-to-br from-white/10 to-white/5 border-b border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#E8C999] to-[#F8EEDF] rounded-full flex items-center justify-center font-bold text-lg shadow-xl text-[#000000]">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#E8C999] truncate">{userName}</p>
                          <p className="text-xs text-white/70 truncate">{userEmail}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-white/90 hover:bg-white/10 transition-colors" onClick={() => setShowDropdown(false)}>
                        <ShoppingBag size={18} className="text-white/70" />
                        <span className="font-semibold">My Orders</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-white/20 bg-black/50">
                      <button onClick={() => { setShowDropdown(false); handleLogout() }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#8E1616] font-bold hover:bg-[#8E1616]/10 transition-colors">
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="px-6 py-2.5 border-2 border-[#E8C999] text-[#E8C999] text-sm font-bold rounded-lg hover:bg-[#E8C999] hover:text-[#000000] transition-all duration-300 shadow-lg hover:shadow-[#E8C999]/20">
                  Login
                </Link>
                <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-[#8E1616] to-[#E8C999] text-[#000000] text-sm font-bold rounded-lg hover:from-[#E8C999] hover:to-[#8E1616] transition-all duration-300 shadow-xl hover:shadow-[#E8C999]/30 hover:scale-105">
                  Register
                </Link>
              </div>
            )}
          </div>

          <button className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} className="text-[#E8C999]" /> : <Menu size={24} className="text-white/90" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-white/20 bg-black/95 backdrop-blur-xl">
            <div className="flex flex-col gap-1 mt-4">
              <Link href="/" className="text-sm font-semibold px-4 py-3 text-white/90 hover:bg-white/10 hover:text-[#E8C999] rounded-lg transition-all" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link href="/shop" className="text-sm font-semibold px-4 py-3 text-white/90 hover:bg-white/10 hover:text-[#E8C999] rounded-lg transition-all" onClick={() => setIsOpen(false)}>
                Shop
              </Link>
              <Link href="/shop?new=true" className="text-sm font-semibold px-4 py-3 text-white/90 hover:bg-white/10 hover:text-[#E8C999] rounded-lg transition-all" onClick={() => setIsOpen(false)}>
                New Arrivals
              </Link>
              <Link href="/shop?winter=true" className="text-sm font-semibold px-4 py-3 text-white/90 hover:bg-white/10 hover:text-[#E8C999] rounded-lg transition-all" onClick={() => setIsOpen(false)}>
                Winter Collection
              </Link>
              <Link href="/about" className="text-sm font-semibold px-4 py-3 text-white/90 hover:bg-white/10 hover:text-[#E8C999] rounded-lg transition-all" onClick={() => setIsOpen(false)}>
                About
              </Link>
              
              <Link href="/cart" className="flex items-center justify-between text-sm font-semibold px-4 py-3 text-white/90 hover:bg-white/10 hover:text-[#E8C999] rounded-lg transition-all" onClick={() => setIsOpen(false)}>
                <span className="flex items-center gap-2">
                  <ShoppingCart size={18} />
                  Cart
                </span>
                {cartCount > 0 && (
                  <span className="bg-gradient-to-br from-[#8E1616] to-[#E8C999] text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {isAdmin ? (
                <div className="border-t border-white/20 mt-3 pt-3">
                  <div className="px-4 py-3 bg-white/10 rounded-lg mx-4 mb-3 border border-white/20 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#E8C999] to-[#8E1616] rounded-full flex items-center justify-center shadow-lg">
                        <Shield size={20} className="text-[#000000]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#E8C999]">Admin Panel</p>
                        <p className="text-xs text-white/70">Full Access</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold px-4 py-3 text-white/90 hover:bg-white/10 hover:text-[#E8C999] rounded-lg transition-all" onClick={() => setIsOpen(false)}>
                    <Shield size={18} />
                    Dashboard
                  </Link>
                  <Link href="/admin/add-product" className="flex items-center gap-2 text-sm font-semibold px-4 py-3 text-white/90 hover:bg-white/10 hover:text-[#E8C999] rounded-lg transition-all" onClick={() => setIsOpen(false)}>
                    <Package size={18} />
                    Add Product
                  </Link>
                  <Link href="/admin/manage-products" className="flex items-center gap-2 text-sm font-semibold px-4 py-3 text-white/90 hover:bg-white/10 hover:text-[#E8C999] rounded-lg transition-all" onClick={() => setIsOpen(false)}>
                    <Settings size={18} />
                    Manage Products
                  </Link>
                  <button onClick={handleAdminLogout} className="w-full mt-2 mx-4 px-4 py-3 bg-gradient-to-r from-[#8E1616] to-[#8E1616]/80 hover:from-[#8E1616]/90 hover:to-[#8E1616] text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg" style={{width: 'calc(100% - 2rem)'}}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : isLoggedIn ? (
                <div className="border-t border-white/20 mt-3 pt-3">
                  <div className="px-4 py-3 bg-white/10 rounded-lg mx-4 mb-3 border border-white/20 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#E8C999] to-[#F8EEDF] rounded-full flex items-center justify-center font-bold shadow-lg text-[#000000]">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#E8C999] truncate">{userName}</p>
                        <p className="text-xs text-white/70 truncate">{userEmail}</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/orders" className="flex items-center gap-2 text-sm font-semibold px-4 py-3 text-white/90 hover:bg-white/10 hover:text-[#E8C999] rounded-lg transition-all" onClick={() => setIsOpen(false)}>
                    <ShoppingBag size={18} />
                    My Orders
                  </Link>
                  <button onClick={handleLogout} className="w-full mt-2 mx-4 px-4 py-3 bg-gradient-to-r from-[#8E1616] to-[#8E1616]/80 hover:from-[#8E1616]/90 hover:to-[#8E1616] text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg" style={{width: 'calc(100% - 2rem)'}}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-white/20 mt-3 pt-3 px-4 space-y-2">
                  <Link href="/login" className="block px-4 py-3 border-2 border-[#E8C999] text-[#E8C999] text-sm font-bold text-center rounded-lg hover:bg-[#E8C999] hover:text-[#000000] transition-all shadow-lg" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="block px-4 py-3 bg-gradient-to-r from-[#8E1616] to-[#E8C999] text-[#000000] text-sm font-bold text-center rounded-lg hover:from-[#E8C999] hover:to-[#8E1616] transition-all shadow-xl" onClick={() => setIsOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}