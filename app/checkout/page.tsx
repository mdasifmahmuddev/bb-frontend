"use client"

import { useState, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useToast } from "@/hooks/use-toast"

interface CheckoutForm {
  fullName: string
  phoneNumber: string
  address: string
  city: string
  postalCode: string
  district: string
  orderNotes: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userEmail, setUserEmail] = useState<string>("")
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    district: "",
    orderNotes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const bdCities = ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Barisal", "Sylhet", "Rangpur", "Mymensingh"]
  const bdDistricts = ["Dhaka", "Narayanganj", "Gazipur", "Tangail", "Chittagong", "Coxs Bazar", "Khulna", "Rajshahi"]

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (!email) {
      toast({
        title: "Login Required",
        description: "Please login to checkout",
        variant: "destructive",
      })
      router.push("/login")
      return
    }
    setUserEmail(email)
    fetchCart(email)
  }, [])

  const fetchCart = async (email: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/cart/${email}`)
      const result = await response.json()
      
      console.log('Checkout cart response:', result)  
      
      if (result.status === 'success') {
        setCart(result.data || [])
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast({
        title: "Error",
        description: "Failed to load cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName) newErrors.fullName = "Full name is required"
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required"
    if (!/^\d{10,11}$/.test(formData.phoneNumber.replace(/[^\d]/g, ""))) {
      newErrors.phoneNumber = "Invalid phone number"
    }
    if (!formData.address) newErrors.address = "Address is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.postalCode) newErrors.postalCode = "Postal code is required"
    if (!formData.district) newErrors.district = "District is required"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty",
        variant: "destructive",
      })
      return
    }

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
       const orderItems = cart.map(item => ({
        product: item.product._id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.product.images?.[0] || ""
      }))

      const orderData = {
        userEmail,
        items: orderItems,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          district: formData.district
        },
        totalAmount: cartTotal,
        notes: formData.orderNotes
      }

      console.log('Placing order:', orderData)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (data.status === 'success') {
        toast({
          title: "Order Placed!",
          description: `Order #${data.data.orderNumber} placed successfully`,
        })
        
         localStorage.removeItem('cart')
        
         router.push(`/orders`)
      } else {
        throw new Error(data.message || 'Failed to place order')
      }
    } catch (error: any) {
      console.error("Error placing order:", error)
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const cartTotal = cart.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity
  }, 0)

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <div className="max-w-7xl mx-auto px-4 text-center py-20">
            <p className="text-lg text-muted">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <div className="max-w-7xl mx-auto px-4 text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <Link
              href="/shop"
              className="inline-block px-8 py-4 bg-primary text-white font-medium hover:bg-primary-light transition"
            >
              Continue Shopping
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
          <Link href="/cart" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition mb-8">
            <ChevronLeft size={20} />
            Back to Cart
          </Link>

          <h1 className="text-4xl font-serif font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white p-8 border border-border space-y-6">
                <h2 className="text-2xl font-serif font-bold mb-6">Shipping Information</h2>

                 <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value })
                      if (errors.fullName) setErrors({ ...errors, fullName: "" })
                    }}
                    className="w-full px-4 py-2 border border-border focus:outline-none focus:border-primary transition"
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-error text-sm mt-1">{errors.fullName}</p>}
                </div>

                 <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, phoneNumber: e.target.value })
                      if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: "" })
                    }}
                    className="w-full px-4 py-2 border border-border focus:outline-none focus:border-primary transition"
                    placeholder="+880 1700 000 000"
                  />
                  {errors.phoneNumber && <p className="text-error text-sm mt-1">{errors.phoneNumber}</p>}
                </div>

                 <div>
                  <label className="block text-sm font-medium mb-2">Street Address *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value })
                      if (errors.address) setErrors({ ...errors, address: "" })
                    }}
                    rows={3}
                    className="w-full px-4 py-2 border border-border focus:outline-none focus:border-primary transition resize-none"
                    placeholder="Enter your complete street address"
                  />
                  {errors.address && <p className="text-error text-sm mt-1">{errors.address}</p>}
                </div>

                 <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value })
                        if (errors.city) setErrors({ ...errors, city: "" })
                      }}
                      className="w-full px-4 py-2 border border-border focus:outline-none focus:border-primary transition bg-white cursor-pointer"
                    >
                      <option value="">Select City</option>
                      {bdCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && <p className="text-error text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Postal Code *</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => {
                        setFormData({ ...formData, postalCode: e.target.value })
                        if (errors.postalCode) setErrors({ ...errors, postalCode: "" })
                      }}
                      className="w-full px-4 py-2 border border-border focus:outline-none focus:border-primary transition"
                      placeholder="1000"
                    />
                    {errors.postalCode && <p className="text-error text-sm mt-1">{errors.postalCode}</p>}
                  </div>
                </div>

                 <div>
                  <label className="block text-sm font-medium mb-2">District *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => {
                      setFormData({ ...formData, district: e.target.value })
                      if (errors.district) setErrors({ ...errors, district: "" })
                    }}
                    className="w-full px-4 py-2 border border-border focus:outline-none focus:border-primary transition bg-white cursor-pointer"
                  >
                    <option value="">Select District</option>
                    {bdDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && <p className="text-error text-sm mt-1">{errors.district}</p>}
                </div>

                 <div>
                  <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                  <textarea
                    value={formData.orderNotes}
                    onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-border focus:outline-none focus:border-primary transition resize-none"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>

                 <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-serif font-bold mb-4">Payment Method</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                    <span className="text-sm">Cash on Delivery (COD)</span>
                  </label>
                </div>

                 <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-primary text-white font-medium hover:bg-primary-light transition disabled:opacity-50"
                >
                  {isLoading ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>

             <div className="lg:col-span-1">
              <div className="bg-accent p-8 border border-border sticky top-24 space-y-6">
                <h2 className="text-xl font-serif font-bold">Order Summary</h2>

                 <div className="space-y-3 border-b border-border pb-4 max-h-64 overflow-y-auto">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>
                        {item.product?.title} x {item.quantity}
                      </span>
                      <span className="font-medium">৳{((item.product?.price || 0) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                 <div className="space-y-3 border-b border-border pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span>৳{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Shipping</span>
                    <span className="text-success font-medium">Free</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">৳{cartTotal.toLocaleString()}</span>
                </div>

                 <div className="bg-white p-4 border border-border text-sm text-muted">
                  <p className="font-medium text-black mb-2">Payment on Delivery</p>
                  <p>Pay in cash when your order arrives. Free shipping on all orders.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}