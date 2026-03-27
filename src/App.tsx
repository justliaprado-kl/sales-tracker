import { createBrowserRouter, RouterProvider } from 'react-router'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import Sales from './pages/Sales'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'inventory', element: <Inventory /> },
        { path: 'sales', element: <Sales /> },
      ],
    },
  ],
  { basename: '/sales-tracker' }
)

export default function App() {
  return <RouterProvider router={router} />
}
