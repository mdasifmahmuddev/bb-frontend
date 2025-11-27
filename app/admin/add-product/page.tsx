"use client"

import { useState } from "react"
import { X, Plus, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Color {
  name: string
  hexCode: string
}

interface FormData {
  title: string
  shortDescription: string
  fullDescription: string
  category: string
  price: number
  discountPrice: number
  sizes: string[]
  colors: Color[]
  images: string[]
  stock: number
  featured: boolean
}

export default function AddProductPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    price: 0,
    discountPrice: 0,
    sizes: [],
    colors: [],
    images: [],
    stock: 0,
    featured: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [colorInput, setColorInput] = useState({ name: "", hexCode: "#000000" })
  const [imageInput, setImageInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const availableSizes = ["S", "M", "L", "XL", "XXL", "30", "32", "34", "36", "38", "40"]
  const categories = ["Full Shirt", "Trouser", "Jacket", "Sweater", "Blazer", "Coat", "Accessories"]

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
    }))
    if (errors.sizes) setErrors({ ...errors, sizes: "" })
  }

  const addColor = () => {
    if (colorInput.name && colorInput.hexCode) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, { ...colorInput }],
      }))
      setColorInput({ name: "", hexCode: "#000000" })
      if (errors.colors) setErrors({ ...errors, colors: "" })
    }
  }

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }))
  }

  const addImage = () => {
    if (imageInput && formData.images.length < 5) {
      // Validate URL format
      try {
        new URL(imageInput)
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, imageInput],
        }))
        setImageInput("")
        if (errors.images) setErrors({ ...errors, images: "" })
      } catch {
        alert('Please enter a valid image URL')
      }
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title) newErrors.title = "Title is required"
    if (!formData.shortDescription) newErrors.shortDescription = "Short description is required"
    if (!formData.fullDescription) newErrors.fullDescription = "Full description is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0"
    if (formData.images.length < 2) newErrors.images = "Minimum 2 images required"
    if (formData.stock < 0) newErrors.stock = "Stock cannot be negative"
    if (formData.sizes.length === 0) newErrors.sizes = "Select at least one size"
    if (formData.colors.length === 0) newErrors.colors = "Add at least one color"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submitted with data:', formData)
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert(`Please fix the following errors:\n${Object.values(newErrors).join('\n')}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.status === 'success') {
        alert('Product added successfully!')
        router.push('/admin/manage-products')
      } else {
        alert(data.message || 'Failed to add product')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to add product. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    alert('Admin logged out successfully!')
    router.push('/admin/login')
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-2">Add New Product</h1>
                <p className="text-muted">Fill in the details to add a new product to your catalog</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-error text-white font-medium hover:bg-red-700 transition flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 border border-border">
            
             {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border-2 border-red-200 p-4 rounded">
                <h3 className="font-bold text-red-800 mb-2">Please fix the following errors:</h3>
                <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            )}

             <div>
              <label className="block text-sm font-medium mb-2">Product Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value })
                  if (errors.title) setErrors({ ...errors, title: "" })
                }}
                className={`w-full px-4 py-2 border focus:outline-none transition ${
                  errors.title ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                }`}
                placeholder="Premium Cotton Shirt"
              />
              {errors.title && <p className="text-error text-sm mt-1">{errors.title}</p>}
            </div>

             <div>
              <label className="block text-sm font-medium mb-2">
                Short Description * ({formData.shortDescription.length}/200)
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => {
                  if (e.target.value.length <= 200) {
                    setFormData({ ...formData, shortDescription: e.target.value })
                    if (errors.shortDescription) setErrors({ ...errors, shortDescription: "" })
                  }
                }}
                maxLength={200}
                rows={2}
                className="w-full px-4 py-2 border border-border focus:outline-none focus:border-primary transition resize-none"
                placeholder="Brief description of the product"
              />
              {errors.shortDescription && <p className="text-error text-sm mt-1">{errors.shortDescription}</p>}
            </div>

             <div>
              <label className="block text-sm font-medium mb-2">Full Description *</label>
              <textarea
                value={formData.fullDescription}
                onChange={(e) => {
                  setFormData({ ...formData, fullDescription: e.target.value })
                  if (errors.fullDescription) setErrors({ ...errors, fullDescription: "" })
                }}
                rows={5}
                className="w-full px-4 py-2 border border-border focus:outline-none focus:border-primary transition resize-none"
                placeholder="Detailed product description including features and benefits"
              />
              {errors.fullDescription && <p className="text-error text-sm mt-1">{errors.fullDescription}</p>}
            </div>

             <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value })
                  if (errors.category) setErrors({ ...errors, category: "" })
                }}
                className="w-full px-4 py-2 border border-border focus:outline-none focus:border-primary transition bg-white cursor-pointer"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-error text-sm mt-1">{errors.category}</p>}
            </div>

             <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (BDT) *</label>
                <input
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    if (errors.price) setErrors({ ...errors, price: "" })
                  }}
                  className="w-full px-4 py-2 border border-border focus:outline-none focus:border-primary transition"
                  placeholder="0"
                />
                {errors.price && <p className="text-error text-sm mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Discount Price (BDT)</label>
                <input
                  type="number"
                  value={formData.discountPrice || ""}
                  onChange={(e) => setFormData({ ...formData, discountPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-border focus:outline-none focus:border-primary transition"
                  placeholder="0"
                />
              </div>
            </div>

             <div>
              <label className="block text-sm font-medium mb-3">Available Sizes *</label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1 border-2 text-sm transition ${
                      formData.sizes.includes(size)
                        ? "border-primary bg-primary text-white"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {errors.sizes && <p className="text-error text-sm mt-2">{errors.sizes}</p>}
            </div>

             <div>
              <label className="block text-sm font-medium mb-3">Product Colors *</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Color name (e.g., Navy Blue)"
                  value={colorInput.name}
                  onChange={(e) => setColorInput({ ...colorInput, name: e.target.value })}
                  className="flex-1 px-4 py-2 border border-border focus:outline-none focus:border-primary transition"
                />
                <input
                  type="color"
                  value={colorInput.hexCode}
                  onChange={(e) => setColorInput({ ...colorInput, hexCode: e.target.value })}
                  className="w-12 h-10 border border-border cursor-pointer"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-4 py-2 bg-primary text-white hover:bg-primary-light transition flex items-center gap-1"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-accent border border-border">
                    <div className="w-4 h-4 border border-gray-300" style={{ backgroundColor: color.hexCode }} />
                    <span className="text-sm">{color.name}</span>
                    <button
                      type="button"
                      onClick={() => removeColor(idx)}
                      className="text-muted hover:text-error transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {errors.colors && <p className="text-error text-sm mt-2">{errors.colors}</p>}
            </div>

             <div>
              <label className="block text-sm font-medium mb-3">Product Images (Min 2, Max 5) *</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addImage()
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-border focus:outline-none focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={addImage}
                  disabled={formData.images.length >= 5}
                  className="px-4 py-2 bg-primary text-white hover:bg-primary-light transition disabled:opacity-50 flex items-center gap-1"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
              {errors.images && <p className="text-error text-sm mb-3">{errors.images}</p>}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {formData.images.map((image, idx) => (
                  <div key={idx} className="relative h-24 border border-border overflow-hidden group">
                    <img
                      src={image}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted mt-2">
                Tip: Use high-quality images. You can use image hosting services like imgur.com, imgbb.com, or postimages.org
              </p>
            </div>

             <div>
              <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
              <input
                type="number"
                value={formData.stock || ""}
                onChange={(e) => {
                  setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                  if (errors.stock) setErrors({ ...errors, stock: "" })
                }}
                className="w-full px-4 py-2 border border-border focus:outline-none focus:border-primary transition"
                placeholder="0"
                min="0"
              />
              {errors.stock && <p className="text-error text-sm mt-1">{errors.stock}</p>}
            </div>

             <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 cursor-pointer"
                id="featured"
              />
              <label htmlFor="featured" className="cursor-pointer">
                Mark as Featured Product (will appear on homepage)
              </label>
            </div>

             <div className="flex gap-4 pt-6 border-t border-border">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-primary text-white font-medium hover:bg-primary-light transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Adding Product..." : "Add Product"}
              </button>
              <Link
                href="/admin/manage-products"
                className="flex-1 py-3 border-2 border-border text-center font-medium hover:bg-accent transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}