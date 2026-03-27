import type { CartItem } from '../../types'

interface Props {
  cart: CartItem[]
  total: number
  onRemove: (id: number) => void
  onUpdateQty: (id: number, qty: number) => void
  onCheckout: () => void
  onClear: () => void
  loading: boolean
}

export default function CartSummary({ cart, total, onRemove, onUpdateQty, onCheckout, onClear, loading }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
      <h2 className="font-bold text-gray-800 text-lg">Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">Cart is empty</p>
      ) : (
        <>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex-1 truncate text-gray-700">{item.name}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => onUpdateQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-600">-</button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button onClick={() => onUpdateQty(item.id, item.quantity + 1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-600">+</button>
                </div>
                <span className="w-16 text-right font-medium text-gray-800">₱{(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-600">✕</button>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-gray-800">
            <span>Total</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold transition-colors"
          >
            {loading ? 'Processing...' : 'Checkout'}
          </button>
          <button onClick={onClear} className="w-full text-gray-400 text-xs hover:text-gray-600">Clear cart</button>
        </>
      )}
    </div>
  )
}
