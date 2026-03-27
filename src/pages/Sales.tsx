import { useState, useMemo } from 'react'
import { useSales } from '../hooks/useSales'
import SalesTable from '../components/sales/SalesTable'

const PAGE_SIZE = 15

export default function Sales() {
  const { sales, loading } = useSales()
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return sales.filter(s => {
      const d = new Date(s.sold_at)
      if (dateFrom && d < new Date(dateFrom)) return false
      if (dateTo && d > new Date(dateTo + 'T23:59:59')) return false
      return true
    })
  }, [sales, dateFrom, dateTo])

  const grandTotal = filtered.reduce((sum, s) => sum + s.total, 0)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Sales Log</h1>
        <div className="flex gap-2 items-center flex-wrap">
          <label className="text-xs text-gray-500">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => { setDateFrom(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <label className="text-xs text-gray-500">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => { setDateTo(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); setPage(1) }}
              className="text-xs text-red-400 hover:text-red-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-4 flex-wrap">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-3 flex flex-col">
          <span className="text-xs text-gray-400">Total Sales</span>
          <span className="text-2xl font-bold text-green-600">₱{grandTotal.toFixed(2)}</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-3 flex flex-col">
          <span className="text-xs text-gray-400">Transactions</span>
          <span className="text-2xl font-bold text-gray-800">{filtered.length}</span>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : (
        <SalesTable sales={paginated} />
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
    </div>
  )
}
