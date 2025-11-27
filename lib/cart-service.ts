 
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const cartService = {
  async getCart(email: string) {
    try {
      const response = await fetch(`${API_URL}/auth/cart/${email}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch cart');
      }

       return result.data || [];
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  async addToCart(email: string, productId: string, quantity: number, size: string, color: string) {
    try {
      const response = await fetch(`${API_URL}/auth/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          productId,
          quantity,
          size,
          color,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add to cart');
      }

       return result.data || [];
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  async updateCartItem(email: string, itemId: string, quantity: number) {
    try {
      const response = await fetch(`${API_URL}/auth/cart/${email}/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update cart item');
      }

       return result.data || [];
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  async removeFromCart(email: string, itemId: string) {
    try {
      const response = await fetch(`${API_URL}/auth/cart/${email}/${itemId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to remove from cart');
      }

       return result.data || [];
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },
};