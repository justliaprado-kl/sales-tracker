import { useState } from 'react'
import { useInventoryItems } from '../hooks/useInventoryItems'
import { useCart } from '../hooks/useCart'
import { checkoutSale } from '../lib/services'
import PosItemCard from '../components/home/PosItemCard'
import CartSummary from '../components/home/CartSummary'
import type { InventoryItem } from '../types'

export default function Home() {
  const { items, loading, refetch } = useInventoryItems()
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, total } = useCart()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleCheckout = async () => {
    if (cart.length === 0) return
    setCheckoutLoading(true)
    try {
      await checkoutSale(
        cart.map(item => ({
          inventory_item: item.id,
          quantity: item.quantity,
          unit_price: item.price,
        }))
      )
      clearCart()
      refetch()
      alert('Checkout successful!')
    } catch (err) {
      alert('Checkout failed: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Item Grid */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">POS</h1>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search items..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item => (
              <PosItemCard
                key={item.id}
                item={item}
                onAdd={(i: InventoryItem) => addToCart(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart */}
      <div className="w-72 shrink-0">
        <CartSummary
          cart={cart}
          total={total}
          onRemove={removeFromCart}
          onUpdateQty={updateQuantity}
          onCheckout={handleCheckout}
          onClear={clearCart}
          loading={checkoutLoading}
        />
      </div>
    </div>
  )
}
