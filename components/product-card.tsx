"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  _id: string
  title: string
  price: number
  discountPrice?: number
  images: string[]
  category: string
  shortDescription?: string
}

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false)
  const { toast } = useToast()

  // Fixed price logic - discountPrice should be LOWER than price
  const originalPrice = product.price
  const currentPrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price
  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      toast({
        title: "Please Login",
        description: "You need to login to add items to cart",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Info",
      description: "Please select size and color on product page",
    })
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white group flex flex-col h-full border border-border hover:shadow-lg transition-shadow"
    >
       <Link href={`/product/${product._id}`} className="block">
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          />
          {hasDiscount && (
            <div className="absolute top-4 right-4 bg-error text-white px-3 py-1 text-sm font-medium">
              {discountPercent}% OFF
            </div>
          )}
        </div>
      </Link>

       <div className="flex flex-col flex-grow p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-serif font-bold mb-2 line-clamp-2 h-14 hover:text-primary transition">
            {product.title}
          </h3>
        </Link>

         {product.shortDescription && (
          <p className="text-sm text-muted mb-3 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

         <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-primary">৳{currentPrice.toLocaleString()}</span>
          {hasDiscount && (
            <span className="text-sm line-through text-muted">৳{originalPrice.toLocaleString()}</span>
          )}
        </div>

         <div className="flex gap-2 mt-auto">
          <Link
            href={`/product/${product._id}`}
            className="flex-1 px-4 py-2 border border-black text-center text-sm font-medium hover:bg-black hover:text-white transition"
          >
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-primary text-white hover:bg-primary-light transition flex items-center justify-center gap-1"
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}