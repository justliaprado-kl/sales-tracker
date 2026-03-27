import type { Sale } from '../../types'

interface Props {
  sales: Sale[]
}

export default function SalesTable({ sales }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Item</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Qty</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Unit Price</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-500">
                {new Date(sale.sold_at).toLocaleString()}
              </td>
              <td className="px-4 py-3 font-medium text-gray-800">
                {sale.inventory_items?.name ?? '—'}
              </td>
              <td className="px-4 py-3 text-gray-600">{sale.quantity}</td>
              <td className="px-4 py-3 text-gray-600">₱{sale.unit_price.toFixed(2)}</td>
              <td className="px-4 py-3 font-bold text-green-600">₱{sale.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {sales.length === 0 && (
        <p className="text-center text-gray-400 py-10">No sales yet.</p>
      )}
    </div>
  )
}
