import { useState } from 'react'
import type { InventoryItem } from '../../types'

interface Props {
  item: InventoryItem
  onSave: (id: number, newStock: number) => Promise<void>
  onClose: () => void
  loading: boolean
}

export default function StockModal({ item, onSave, onClose, loading }: Props) {
  const [stock, setStock] = useState(String(item.stock))

  const handleSave = async () => {
    const val = parseInt(stock)
    if (isNaN(val) || val < 0) return
    await onSave(item.id, val)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-80 flex flex-col gap-4">
        <h3 className="font-bold text-gray-800 text-lg">Adjust Stock</h3>
        <p className="text-gray-500 text-sm">{item.name}</p>
        <input
          type="number" min="0"
          value={stock}
          onChange={e => setStock(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
