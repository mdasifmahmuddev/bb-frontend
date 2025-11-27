"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, ChevronDown } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import { productService } from "@/lib/product-service"
import { useToast } from "@/hooks/use-toast"

 const CATEGORY_MAP: Record<string, string> = {
  'all': 'all',
  'shirt': 'Full Shirt',
  'trouser': 'Trouser',
  'jacket': 'Jacket',
  'sweater': 'Sweater',
  'blazer': 'Blazer',
  'coat': 'Coat',
  'accessories': 'Accessories',
}

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchTerm])  

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      const params: any = {}
      
       if (selectedCategory !== 'all') {
        params.category = CATEGORY_MAP[selectedCategory]
      }
      
      if (searchTerm.trim()) {
        params.search = searchTerm.trim()
      }

      console.log('📦 Fetching with params:', params)  
      
      const data = await productService.getProducts(params)
      
      console.log('✅ Products loaded:', data.length)  
      
      setProducts(data)
      
      if (data.length === 0) {
        toast({
          title: "No products found",
          description: "Try adjusting your filters",
        })
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Make sure backend is running on port 5000.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]

     switch (sortBy) {
      case "price-low":
        return filtered.sort((a: any, b: any) => a.price - b.price)
      case "price-high":
        return filtered.sort((a: any, b: any) => b.price - a.price)
      case "newest":
        return filtered.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || 0).getTime()
          const dateB = new Date(b.createdAt || 0).getTime()
          return dateB - dateA
        })
      default:
        return filtered
    }
  }, [sortBy, products])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
           <div className="mb-12">
            <h1 className="text-4xl font-serif font-bold mb-2">Premium Collection</h1>
            <p className="text-muted">Discover our curated selection of men's fashion</p>
          </div>

           <div className="flex flex-col md:flex-row gap-4 mb-8 items-end">
             <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border focus:outline-none focus:border-primary transition"
              />
            </div>

             <div className="relative min-w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-border appearance-none focus:outline-none focus:border-primary transition bg-white cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="shirt">Full Shirt</option>
                <option value="trouser">Trouser</option>
                <option value="jacket">Jacket</option>
                <option value="sweater">Sweater</option>
                <option value="blazer">Blazer</option>
                <option value="coat">Coat</option>
                <option value="accessories">Accessories</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-muted pointer-events-none" size={20} />
            </div>

             <div className="relative min-w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-border appearance-none focus:outline-none focus:border-primary transition bg-white cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-muted pointer-events-none" size={20} />
            </div>
          </div>

           <p className="text-sm text-muted mb-6">
            {loading ? 'Loading...' : `Showing ${filteredAndSortedProducts.length} products`}
          </p>

           {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="text-lg text-muted mt-4">Loading products...</p>
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-border p-8">
              <p className="text-lg text-muted mb-2">No products found</p>
              <p className="text-sm text-muted mb-4">Try adjusting your filters or search term</p>
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="px-6 py-2 bg-primary text-white hover:bg-primary-light transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}