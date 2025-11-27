"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, Edit2, Trash2, Search, LogOut } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Product {
  _id: string
  title: string
  category: string
  price: number
  stock: number
  featured: boolean
  images: string[]
}

export default function ManageProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      const data = await response.json()
      if (data.status === 'success') {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.status === 'success') {
        setProducts(products.filter((p) => p._id !== id))
        alert('Product deleted successfully!')
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete product')
    } finally {
      setDeleteConfirm(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    alert('Admin logged out successfully!')
    router.push('/admin/login')
  }

  const categories = ["all", ...new Set(products.map((p) => p.category))]

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted">Loading products...</p>
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
              <h1 className="text-4xl font-serif font-bold mb-2">Manage Products</h1>
              <p className="text-muted">Total products: {products.length}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link
                href="/admin"
                className="px-6 py-3 border-2 border-border font-medium hover:bg-accent transition"
              >
                ← Dashboard
              </Link>
              <Link
                href="/admin/add-product"
                className="px-6 py-3 bg-primary text-white font-medium hover:bg-primary-light transition"
              >
                + Add New Product
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

           <div className="bg-white p-6 border border-border mb-6">
            <div className="flex flex-col md:flex-row gap-4">
               <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-muted" size={20} />
                <input
                  type="text"
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border focus:outline-none focus:border-primary transition"
                />
              </div>

               <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-border focus:outline-none focus:border-primary transition bg-white cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

           <div className="hidden md:block bg-white border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-accent border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Featured</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b border-border hover:bg-accent transition">
                    <td className="px-6 py-4">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.title}
                        className="w-12 h-12 object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm">{product.title}</td>
                    <td className="px-6 py-4 text-sm">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-medium">৳{product.price}</td>
                    <td className="px-6 py-4 text-sm">{product.stock}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-medium ${product.featured ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {product.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/product/${product._id}`}
                          className="p-2 hover:bg-accent rounded transition"
                          title="View"
                        >
                          <Eye size={16} className="text-muted" />
                        </Link>
                        <Link
                          href={`/admin/edit-product/${product._id}`}
                          className="p-2 hover:bg-accent rounded transition"
                          title="Edit"
                        >
                          <Edit2 size={16} className="text-muted" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(product._id)}
                          className="p-2 hover:bg-red-100 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-error" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

           <div className="md:hidden space-y-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white p-4 border border-border space-y-3">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-40 object-cover"
                />
                <div>
                  <h3 className="font-medium">{product.title}</h3>
                  <p className="text-sm text-muted">{product.category}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span>৳{product.price}</span>
                  <span>Stock: {product.stock}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/product/${product._id}`}
                    className="flex-1 px-3 py-2 border border-border hover:bg-accent transition text-sm flex items-center justify-center gap-1"
                  >
                    <Eye size={16} /> View
                  </Link>
                  <Link
                    href={`/admin/edit-product/${product._id}`}
                    className="flex-1 px-3 py-2 border border-border hover:bg-accent transition text-sm flex items-center justify-center gap-1"
                  >
                    <Edit2 size={16} /> Edit
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(product._id)}
                    className="flex-1 px-3 py-2 border border-error text-error hover:bg-red-50 transition text-sm flex items-center justify-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

           {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted">No products found</p>
            </div>
          )}
        </div>
      </div>

       {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded max-w-sm mx-4">
            <h3 className="text-xl font-serif font-bold mb-4">Delete Product?</h3>
            <p className="text-muted mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-error text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-border hover:bg-accent transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}