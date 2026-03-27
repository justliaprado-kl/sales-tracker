import { Outlet, NavLink } from 'react-router'

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex gap-6 items-center shadow-sm">
        <span className="font-bold text-lg text-gray-800 mr-4">🛒 Sales Tracker</span>
        {[
          { to: '/', label: 'Home' },
          { to: '/inventory', label: 'Inventory' },
          { to: '/sales', label: 'Sales' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
