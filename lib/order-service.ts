import { apiClient } from "./api-client"

export const orderService = {
  async createOrder(orderData: {
    email: string
    items: Array<{ productId: string; quantity: number; size: string; color: string }>
    shippingAddress: {
      fullName: string
      phone: string
      address: string
      city: string
      postalCode: string
      district: string
    }
    totalAmount: number
  }) {
    const response = await apiClient.post("/orders", orderData)
    return response.data
  },

  async getOrders(email: string) {
    const response = await apiClient.get(`/orders?email=${email}`)
    return response.data || []
  },

  async getOrderById(orderId: string) {
    const response = await apiClient.get(`/orders/${orderId}`)
    return response.data
  },
}
