import type { InventoryItem } from '../../types'

interface Props {
  items: InventoryItem[]
  onDelete: (id: number) => void
  onAdjustStock: (item: InventoryItem) => void
}

export default function InventoryTable({ items, onDelete, onAdjustStock }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Image</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Name</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Price</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Stock</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                  : <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">🛍️</div>
                }
              </td>
              <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
              <td className="px-4 py-3 text-gray-600">₱{item.price.toFixed(2)}</td>
              <td className="px-4 py-3">
                <span className={`font-semibold ${item.stock === 0 ? 'text-red-500' : item.stock < 5 ? 'text-yellow-500' : 'text-green-600'}`}>
                  {item.stock}
                </span>
              </td>
              <td className="px-4 py-3 flex gap-2">
                <button
                  onClick={() => onAdjustStock(item)}
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                >
                  Adjust Stock
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <p className="text-center text-gray-400 py-10">No items yet. Add one above!</p>
      )}
    </div>
  )
}
