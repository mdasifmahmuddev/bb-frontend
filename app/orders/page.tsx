"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Eye } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Order {
  _id: string
  orderNumber: string
  items: any[]
  totalAmount: number
  orderStatus: string
  shippingAddress: any
  createdAt: string
  notes?: string
}

export default function UserOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [userEmail, setUserEmail] = useState<string>("")

   useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (!email) {
      router.push("/login")
      return
    }
    setUserEmail(email)
    loadOrders(email)
   }, [])  


  const loadOrders = async (email: string) => {
    try {
      console.log("Fetching orders for:", email)

       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/user/${email}`)


      if (!response.ok) {
        console.error("HTTP Error:", response.status, response.statusText)
        setOrders([])
        return
      }

      const data = await response.json()
      console.log("API Response:", data)

      if (data.status === 'success' && Array.isArray(data.data)) {
        const fixedOrders = data.data.map((order: any) => ({
          ...order,
          items: order.items.map((item: any) => ({
            ...item,
             image: item.image && item.image.trim() !== "" 
              ? item.image 
              : item.product?.images?.[0] && item.product.images[0].trim() !== ""
                ? item.product.images[0]
                : '/placeholder.svg',
             title: item.title || item.product?.title || 'Unknown Product',
             price: item.price || item.product?.price || 0,
          }))
        }))

        console.log("Orders loaded & fixed:", fixedOrders)
        setOrders(fixedOrders)
      } else {
        console.log("No orders found")
        setOrders([])
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Processing': return 'bg-blue-100 text-blue-800'
      case 'Shipped': return 'bg-purple-100 text-purple-800'
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted">Loading your orders...</p>
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
          <h1 className="text-4xl font-serif font-bold mb-8">My Orders</h1>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white border border-border rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold">Order #{order.orderNumber}</h3>
                        <p className="text-sm text-muted">
                          {new Date(order.createdAt).toLocaleDateString('en-GB')} at {new Date(order.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-5 py-2 border border-border hover:bg-accent transition flex items-center gap-2 rounded-md"
                        >
                          <Eye size={18} />
                          View Details
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
                      <div>
                        <p className="text-sm font-medium text-muted mb-1">Shipping To</p>
                        <p className="text-sm">
                          <strong>{order.shippingAddress?.fullName}</strong><br />
                          {order.shippingAddress?.address}<br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.district} - {order.shippingAddress?.postalCode}<br />
                          Phone: {order.shippingAddress?.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted mb-1">Order Summary</p>
                        <p className="text-sm">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                        <p className="text-2xl font-bold text-primary mt-2">
                          ৳{order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {order.items.slice(0, 5).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded border border-border"
                          />
                        ))}
                        {order.items.length > 5 && (
                          <div className="w-20 h-20 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-xs">
                            +{order.items.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-border rounded-lg">
              <Package size={80} className="mx-auto text-muted mb-6" />
              <h2 className="text-3xl font-bold mb-3">No orders yet</h2>
              <p className="text-muted mb-8 text-lg">Time to treat yourself!</p>
              <Link
                href="/shop"
                className="inline-block px-10 py-4 bg-primary text-white font-semibold text-lg rounded-md hover:bg-primary/90 transition"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>

       {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold">Order #{selectedOrder.orderNumber}</h2>
                <p className="text-muted mt-1">
                  {new Date(selectedOrder.createdAt).toLocaleString('en-GB')}
                </p>
                <span className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(selectedOrder.orderStatus)}`}>
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-3xl hover:text-red-500">×</button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-3">Shipping Address</h3>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <p className="font-semibold">{selectedOrder.shippingAddress?.fullName}</p>
                    <p>{selectedOrder.shippingAddress?.address}</p>
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.district} - {selectedOrder.shippingAddress?.postalCode}</p>
                    <p className="mt-2 font-medium">Phone: {selectedOrder.shippingAddress?.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                        <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-muted">Size: {item.size} | Color: {item.color}</p>
                          <p className="mt-2">
                            ৳{item.price.toLocaleString()} × {item.quantity} = <strong className="text-primary">৳{(item.price * item.quantity).toLocaleString()}</strong>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h3 className="font-bold text-lg mb-2">Order Notes</h3>
                  <p className="bg-gray-50 p-4 rounded-lg italic">"{selectedOrder.notes}"</p>
                </div>
              )}

              <div className="border-t-2 pt-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Paid</span>
                  <span className="text-primary">৳{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
                <p className="text-sm text-success text-right mt-2">Free Shipping • Cash on Delivery</p>
              </div>

              <Link href="/shop" className="block w-full text-center py-4 bg-primary text-white font-bold text-lg rounded-lg hover:bg-primary/90 transition">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}