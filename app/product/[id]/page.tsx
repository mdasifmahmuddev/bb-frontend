"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { productService } from "@/lib/product-service"
import { useToast } from "@/hooks/use-toast"

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  
  const { id } = use(params)
  
  const router = useRouter()
  const { toast } = useToast()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const data = await productService.getProductById(id)
      setProduct(data)
      
      if (data.sizes?.length > 0) {
        setSelectedSize(data.sizes[0])
      }
      if (data.colors?.length > 0) {
        setSelectedColor(data.colors[0])
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast({
        title: "Select Size",
        description: "Please select a size before adding to cart",
        variant: "destructive",
      })
      return
    }

    if (!selectedColor) {
      toast({
        title: "Select Color",
        description: "Please select a color before adding to cart",
        variant: "destructive",
      })
      return
    }

    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    try {
      setAddingToCart(true)
      
      console.log('Sending add to cart request:', {
        email: userEmail,
        productId: product._id,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor.name,
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          productId: product._id,
          quantity: quantity,
          size: selectedSize,
          color: selectedColor.name,
        }),
      })

      const data = await response.json()
      console.log('Response from server:', data)

      if (!response.ok) {
        throw new Error(data.message || "Failed to add to cart")
      }

      toast({
        title: "Added to Cart",
        description: `${product.title} has been added to your cart`,
      })

       window.dispatchEvent(new Event('cartUpdated'))

       setTimeout(() => {
        router.push('/cart')
      }, 500)

    } catch (error: any) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="text-lg text-muted mt-4">Loading product...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <div className="max-w-7xl mx-auto px-4 text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted mb-6">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push("/shop")}
              className="px-6 py-3 bg-primary text-white hover:bg-primary-light transition"
            >
              Back to Shop
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price
  const hasDiscount = product.discountPrice > 0
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => router.push("/shop")}
            className="flex items-center gap-2 text-muted hover:text-primary transition mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Shop</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-4 bg-white border border-border overflow-hidden aspect-square">
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square border-2 overflow-hidden transition ${
                        selectedImage === index ? "border-primary" : "border-border hover:border-primary"
                      }`}
                    >
                      <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-6">
                <p className="text-sm text-muted uppercase tracking-wide mb-2">{product.category}</p>
                <h1 className="text-4xl font-serif font-bold mb-4">{product.title}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-primary">৳{displayPrice.toLocaleString()}</span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-muted line-through">৳{product.price.toLocaleString()}</span>
                      <span className="px-3 py-1 bg-error text-white text-sm font-medium">
                        Save {discountPercentage}%
                      </span>
                    </>
                  )}
                </div>

                <div className="mb-6">
                  {product.stock > 0 ? (
                    <span className="text-success font-medium">✓ In Stock ({product.stock} available)</span>
                  ) : (
                    <span className="text-error font-medium">✗ Out of Stock</span>
                  )}
                </div>
              </div>

              <p className="text-lg mb-8 leading-relaxed">{product.shortDescription}</p>

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Select Size</label>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 border-2 font-medium transition ${
                          selectedSize === size
                            ? "border-primary bg-primary text-white"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">
                    Select Color: {selectedColor?.name || ""}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color: any) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full border-4 transition ${
                          selectedColor?.name === color.name ? "border-primary scale-110" : "border-border"
                        }`}
                        style={{ backgroundColor: color.hexCode }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <label className="block text-sm font-medium mb-3">Quantity</label>
                <div className="flex items-center gap-4 border border-border w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || addingToCart}
                className="w-full py-4 bg-primary text-white font-medium text-lg flex items-center justify-center gap-3 hover:bg-primary-light transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={24} />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>

          <div className="mt-12 bg-white border border-border p-8">
            <h2 className="text-2xl font-serif font-bold mb-4">Product Description</h2>
            <p className="text-muted leading-relaxed whitespace-pre-line">{product.fullDescription}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}