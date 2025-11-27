"use client"

import { useState, useCallback } from "react"
import { cartService } from "@/lib/cart-service"
import { useToast } from "@/hooks/use-toast"

export function useCart(email?: string) {
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchCart = useCallback(async () => {
    if (!email) return
    setLoading(true)
    try {
      const data = await cartService.getCart(email)
      console.log('Cart data received:', data)  
      setCart(data)
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
  }, [email, toast])

  const addItem = useCallback(
    async (productId: string, quantity: number, size: string, color: string) => {
      if (!email) return
      try {
        const data = await cartService.addToCart(email, productId, quantity, size, color)
        setCart(data)
        toast({
          title: "Success",
          description: "Item added to cart",
        })
      } catch (error) {
        console.error("Error adding to cart:", error)
        toast({
          title: "Error",
          description: "Failed to add item to cart",
          variant: "destructive",
        })
      }
    },
    [email, toast],
  )

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      if (!email) return
      if (quantity < 1) return  
      
      try {
        const data = await cartService.updateCartItem(email, itemId, quantity)
        setCart(data)
      } catch (error) {
        console.error("Error updating cart item:", error)
        toast({
          title: "Error",
          description: "Failed to update item",
          variant: "destructive",
        })
      }
    },
    [email, toast],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!email) return
      try {
        const data = await cartService.removeFromCart(email, itemId)
        setCart(data)
        toast({
          title: "Success",
          description: "Item removed from cart",
        })
      } catch (error) {
        console.error("Error removing from cart:", error)
        toast({
          title: "Error",
          description: "Failed to remove item",
          variant: "destructive",
        })
      }
    },
    [email, toast],
  )

  return {
    cart,
    loading,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
  }
}