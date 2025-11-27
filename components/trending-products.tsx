"use client"

import { useState, useEffect } from "react"
import ProductCard from "./product-card"
import { productService } from "@/lib/product-service"
import { useToast } from "@/hooks/use-toast"

export default function TrendingProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTrendingProducts()
  }, [])

  const fetchTrendingProducts = async () => {
    try {
      setLoading(true)
       const data = await productService.getFeaturedProducts(6)
      console.log('✅ Trending products loaded:', data.length)
      setProducts(data)
    } catch (error) {
      console.error('❌ Error fetching trending products:', error)
      toast({
        title: "Error",
        description: "Failed to load trending products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold mb-2">Trending This Season</h2>
          <p className="text-muted">Discover our most popular items</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="text-lg text-muted mt-4">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted">No products available</p>
          </div>
        )}
      </div>
    </section>
  )
}