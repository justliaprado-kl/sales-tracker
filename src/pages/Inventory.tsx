import { useState } from 'react'
import { useInventoryItems } from '../hooks/useInventoryItems'
import {
  createInventoryItem,
  removeInventoryItem,
  adjustInventoryStock,
  uploadInventoryImage,
} from '../lib/services'
import InventoryTable from '../components/inventory/InventoryTable'
import AddInventoryItemForm from '../components/inventory/AddInventoryItemForm'
import StockModal from '../components/inventory/StockModal'
import type { InventoryItem } from '../types'

const PAGE_SIZE = 10

export default function Inventory() {
  const { items, loading, refetch } = useInventoryItems()
  const [formLoading, setFormLoading] = useState(false)
  const [stockItem, setStockItem] = useState<InventoryItem | null>(null)
  const [stockLoading, setStockLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleAdd = async (name: string, price: number, stock: number, file: File | null) => {
    setFormLoading(true)
    try {
      const item = await createInventoryItem({ name, price, stock })
      if (file) await uploadInventoryImage(item.id, file)
      refetch()
    } catch (err) {
      alert('Failed to add item: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return
    try {
      await removeInventoryItem(id)
      refetch()
    } catch (err) {
      alert('Failed to delete: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const handleAdjustStock = async (id: number, nextStock: number) => {
    setStockLoading(true)
    try {
      await adjustInventoryStock(id, nextStock)
      refetch()
    } catch (err) {
      alert('Failed to adjust stock: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setStockLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>

      <AddInventoryItemForm onAdd={handleAdd} loading={formLoading} />

      <div className="flex items-center justify-between">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search inventory..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <span className="text-xs text-gray-400">{filtered.length} items</span>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : (
        <InventoryTable
          items={paginated}
          onDelete={handleDelete}
          onAdjustStock={setStockItem}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {stockItem && (
        <StockModal
          item={stockItem}
          onSave={handleAdjustStock}
          onClose={() => setStockItem(null)}
          loading={stockLoading}
        />
      )}
    </div>
  )
}
