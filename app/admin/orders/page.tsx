"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, Eye, LogOut } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Order {
  _id: string
  orderNumber: string
  user: {
    name: string
    email: string
  }
  items: any[]
  totalAmount: number
  orderStatus: string
  shippingAddress: any
  createdAt: string
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.status === 'success') {
        setOrders(data.data)
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      })

      const data = await response.json()
      
      if (data.status === 'success') {
        // Update orders list
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        ))
        
        // Update selected order if it's the same
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus })
        }
        
        alert('Order status updated successfully!')
      } else {
        alert('Failed to update order status')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update order status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    alert('Admin logged out successfully!')
    router.push('/admin/login')
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
            <p className="text-muted">Loading orders...</p>
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
           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-serif font-bold mb-2">Manage Orders</h1>
              <p className="text-muted">Total orders: {orders.length}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link
                href="/admin"
                className="px-6 py-3 border-2 border-border font-medium hover:bg-accent transition"
              >
                ← Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-3 bg-error text-white font-medium hover:bg-red-700 transition flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

           <div className="hidden md:block bg-white border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-accent border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium">Order #</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-border hover:bg-accent transition">
                    <td className="px-6 py-4 text-sm font-medium">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium">{order.user?.name || 'N/A'}</p>
                        <p className="text-muted text-xs">{order.user?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                    <td className="px-6 py-4 text-sm font-medium">৳{order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-accent rounded transition"
                        title="View Details"
                      >
                        <Eye size={16} className="text-muted" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

           <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-4 border border-border space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{order.orderNumber}</p>
                    <p className="text-sm text-muted">{order.user?.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{order.items.length} items</span>
                  <span className="font-bold">৳{order.totalAmount.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full px-4 py-2 border border-border hover:bg-accent transition text-sm flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            ))}
          </div>

           {orders.length === 0 && (
            <div className="text-center py-12 bg-white border border-border">
              <Package size={48} className="mx-auto text-muted mb-4" />
              <p className="text-lg text-muted">No orders yet</p>
            </div>
          )}
        </div>
      </div>

       {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6 border-b border-border sticky top-0 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-1">Order #{selectedOrder.orderNumber}</h2>
                  <p className="text-sm text-muted">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-2xl text-muted hover:text-black"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
               <div>
                <h3 className="font-bold mb-2">Customer Information</h3>
                <div className="bg-accent p-4 rounded space-y-1 text-sm">
                  <p><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                  <p><strong>Address:</strong> {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.district} - {selectedOrder.shippingAddress?.postalCode}</p>
                </div>
              </div>

               <div>
                <h3 className="font-bold mb-2">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-3 border border-border rounded">
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.title}
                        className="w-16 h-16 object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted">Size: {item.size} | Color: {item.color}</p>
                        <p className="text-sm">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                      </div>
                      <div className="font-bold">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

               <div className="border-t border-border pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">৳{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

               <div>
                <h3 className="font-bold mb-2">Update Order Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder._id, status)}
                      disabled={updatingStatus || selectedOrder.orderStatus === status}
                      className={`px-4 py-2 text-sm font-medium rounded transition disabled:opacity-50 ${
                        selectedOrder.orderStatus === status
                          ? 'bg-primary text-white'
                          : 'border border-border hover:bg-accent'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}