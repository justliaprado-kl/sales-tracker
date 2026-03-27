import { useState } from 'react'
import type { CartItem, InventoryItem } from '../types'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: InventoryItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1, image_url: item.image_url }]
    })
  }

  const removeFromCart = (id: number) =>
    setCart(prev => prev.filter(i => i.id !== id))

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id)
    setCart(prev => prev.map(i => (i.id === id ? { ...i, quantity } : i)))
  }

  const clearCart = () => setCart([])

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, total }
}
