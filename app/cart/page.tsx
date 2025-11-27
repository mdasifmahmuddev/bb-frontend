"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const [userEmail, setUserEmail] = useState<string>("")
  const [isInitialized, setIsInitialized] = useState(false)
  const { cart, loading, fetchCart, updateItem, removeItem } = useCart(userEmail)

   useEffect(() => {
    const email = localStorage.getItem("userEmail")
    console.log("🔍 Cart Page - User Email from localStorage:", email)
    if (email) {
      setUserEmail(email)
    }
    setIsInitialized(true)
  }, [])

   useEffect(() => {
    console.log("🔍 Cart Page - Effect triggered:", { userEmail, isInitialized })
    if (userEmail && isInitialized) {
      console.log("🔍 Cart Page - Calling fetchCart for:", userEmail)
      fetchCart()
    }
  }, [userEmail, isInitialized, fetchCart])

   useEffect(() => {
    const handleCartUpdate = () => {
      if (userEmail) {
        console.log("🔄 Cart updated event - refetching...")
        fetchCart()
      }
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [userEmail, fetchCart])

   useEffect(() => {
    console.log("🔍 Cart Page - Cart updated:", {
      length: cart.length,
      cart: cart
    })
  }, [cart])

  const subtotal = cart.reduce((sum, item) => {
    const product = item.product
    return sum + (product?.price || 0) * item.quantity
  }, 0)
  const shipping = cart.length > 0 ? 0 : 0
  const total = subtotal + shipping

  console.log("🔍 Cart Page - Current State:", {
    userEmail,
    isInitialized,
    loading,
    cartLength: cart.length
  })

   if (!isInitialized) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <div className="max-w-7xl mx-auto px-4 text-center py-20">
            <p className="text-lg text-muted">Initializing...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

   if (!userEmail) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <div className="max-w-7xl mx-auto px-4 text-center py-20">
            <p className="text-2xl text-muted mb-6">Please login to view your cart</p>
            <Link
              href="/login"
              className="inline-block px-8 py-4 bg-primary text-white font-medium hover:bg-primary-light transition"
            >
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold mb-8">Shopping Cart</h1>

          
          

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-lg text-muted">Loading cart...</p>
            </div>
          ) : cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item._id} className="bg-white p-6 border border-border flex gap-6">
                       <img
                        src={item.product?.images?.[0] || "/placeholder.svg"}
                        alt={item.product?.title}
                        className="w-24 h-24 object-cover"
                      />

                       <div className="flex-1">
                        <h3 className="font-serif font-bold mb-2">{item.product?.title}</h3>
                        <div className="text-sm text-muted space-y-1 mb-4">
                          <p>Size: {item.size}</p>
                          <p>Color: {item.color}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 border border-border w-fit">
                            <button
                              onClick={() => updateItem(item._id, item.quantity - 1)}
                              className="p-2 hover:bg-accent transition"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateItem(item._id, item.quantity + 1)}
                              className="p-2 hover:bg-accent transition"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <span className="text-lg font-bold text-primary">
                            ৳{((item.product?.price || 0) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>

                       <button onClick={() => removeItem(item._id)} className="p-2 hover:bg-red-100 rounded transition">
                        <Trash2 size={20} className="text-error" />
                      </button>
                    </div>
                  ))}
                </div>

                 <Link href="/shop" className="inline-block mt-6 text-primary hover:underline">
                  ← Continue Shopping
                </Link>
              </div>

               <div className="lg:col-span-1">
                <div className="bg-white p-8 border border-border sticky top-24 space-y-4">
                  <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>

                  <div className="space-y-3 border-b border-border pb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Subtotal</span>
                      <span>৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Shipping</span>
                      <span className="text-success font-medium">{shipping === 0 ? "Free" : `৳${shipping}`}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">৳{total.toLocaleString()}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full py-4 bg-primary text-white font-medium text-center hover:bg-primary-light transition"
                  >
                    Proceed to Checkout
                  </Link>

                  <Link
                    href="/shop"
                    className="block w-full py-2 border border-border font-medium text-center hover:bg-accent transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl text-muted mb-6">Your cart is empty</p>
              <Link
                href="/shop"
                className="inline-block px-8 py-4 bg-primary text-white font-medium hover:bg-primary-light transition"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}