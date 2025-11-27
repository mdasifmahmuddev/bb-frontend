 
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const productService = {
   async getProducts(params?: { category?: string; search?: string; limit?: number }) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.category && params.category !== 'all') {
        queryParams.append('category', params.category)
      }
      if (params?.search) {
        queryParams.append('search', params.search)
      }
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString())
      }

      const url = `${API_URL}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      console.log('🔍 Fetching products from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Backend error:', errorData)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Products fetched:', result.data?.length || 0, 'products')
      
      return result.data || []
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      throw error
    }
  },

   async getProductById(id: string) {
    try {
      const url = `${API_URL}/products/${id}`
      
      console.log('🔍 Fetching product from:', url)
      console.log('🆔 Product ID:', id)
      
       if (!id || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error('Invalid product ID format')
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Backend error:', errorData)
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || 'Product not found'}`)
      }

      const result = await response.json()
      console.log('✅ Product fetched:', result.data?.title)
      
      return result.data
    } catch (error) {
      console.error('❌ Error fetching product:', error)
      throw error
    }
  },

   async getFeaturedProducts(limit: number = 6) {
    try {
      const url = `${API_URL}/products?featured=true&limit=${limit}`
      
      console.log('🔍 Fetching featured products from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Featured products fetched:', result.data?.length || 0)
      
      return result.data || []
    } catch (error) {
      console.error('❌ Error fetching featured products:', error)
      throw error
    }
  },

   async getProductsByCategory(category: string, limit?: number) {
    try {
      const params: any = { category }
      if (limit) params.limit = limit
      
      return await this.getProducts(params)
    } catch (error) {
      console.error('❌ Error fetching products by category:', error)
      throw error
    }
  },
}