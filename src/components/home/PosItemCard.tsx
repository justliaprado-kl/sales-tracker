import type { InventoryItem } from '../../types'

interface Props {
  item: InventoryItem
  onAdd: (item: InventoryItem) => void
}

export default function PosItemCard({ item, onAdd }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {item.image_url ? (
        <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover" />
      ) : (
        <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-3xl">🛍️</div>
      )}
      <div className="p-3">
        <p className="font-semibold text-gray-800 truncate">{item.name}</p>
        <p className="text-blue-600 font-bold text-sm">₱{item.price.toFixed(2)}</p>
        <p className="text-xs text-gray-400 mb-2">Stock: {item.stock}</p>
        <button
          onClick={() => onAdd(item)}
          disabled={item.stock === 0}
          className="w-full bg-blue-600 text-white text-sm py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
