import { useState } from 'react'

interface Props {
  onAdd: (name: string, price: number, stock: number, file: File | null) => Promise<void>
  loading: boolean
}

export default function AddInventoryItemForm({ onAdd, loading }: Props) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || !stock) return
    await onAdd(name, parseFloat(price), parseInt(stock), file)
    setName('')
    setPrice('')
    setStock('')
    setFile(null)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1 flex-1 min-w-32">
        <label className="text-xs text-gray-500 font-medium">Item Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Milk Tea"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />
      </div>
      <div className="flex flex-col gap-1 w-28">
        <label className="text-xs text-gray-500 font-medium">Price (₱)</label>
        <input
          type="number" min="0" step="0.01"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="0.00"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />
      </div>
      <div className="flex flex-col gap-1 w-24">
        <label className="text-xs text-gray-500 font-medium">Stock</label>
        <input
          type="number" min="0"
          value={stock}
          onChange={e => setStock(e.target.value)}
          placeholder="0"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Image (optional)</label>
        <input
          type="file" accept="image/*"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
          className="text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Adding...' : '+ Add Item'}
      </button>
    </form>
  )
}
