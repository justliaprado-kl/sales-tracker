export interface InventoryItem {
  id: number
  created_at: string
  name: string
  price: number
  stock: number
  image_url: string | null
}

export interface Sale {
  id: number
  inventory_item: number
  quantity: number
  sold_at: string
  unit_price: number
  total: number
  inventory_items?: { name: string }
}

export interface InventoryMovement {
  id: number
  created_at: string
  inventory_item: number
  movement_type: 'SALE' | 'RESTOCK'
  quantity: number
  reference_id: number | null
}

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image_url: string | null
}

export interface CheckoutLine {
  inventory_item: number
  quantity: number
  unit_price: number
}
