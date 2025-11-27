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
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F8EEDF] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#8E1616]/10 text-[#8E1616] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full mb-4">
            Handpicked Selection
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#000000] mb-3">
            Trending This Season
          </h2>
          <p className="text-sm sm:text-base text-[#000000]/70 max-w-2xl mx-auto">
            Discover our most popular items
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8E1616] border-r-transparent"></div>
            <p className="text-lg text-[#000000] opacity-70 mt-4">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-[#000000] opacity-70">No products available</p>
          </div>
        )}
      </div>
    </section>
  )
}