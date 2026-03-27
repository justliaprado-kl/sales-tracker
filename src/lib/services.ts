import { supabase } from '../supabaseClient'
import type { InventoryItem, Sale, CheckoutLine } from '../types'

// ── Inventory ──────────────────────────────────────────────────────────────

export async function fetchInventoryItems(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as InventoryItem[]
}

export async function createInventoryItem(
  item: Pick<InventoryItem, 'name' | 'price' | 'stock'>
): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from('inventory_items')
    .insert(item)
    .select()
    .single()
  if (error) throw error
  return data as InventoryItem
}

export async function removeInventoryItem(id: number): Promise<void> {
  const { error } = await supabase.from('inventory_items').delete().eq('id', id)
  if (error) throw error
}

export async function adjustInventoryStock(
  id: number,
  nextStock: number
): Promise<void> {
  const { error } = await supabase
    .from('inventory_items')
    .update({ stock: nextStock })
    .eq('id', id)
  if (error) throw error

  // Record restock movement
  const { error: movErr } = await supabase.from('inventory_movement').insert({
    inventory_item: id,
    movement_type: 'RESTOCK',
    quantity: nextStock,
  })
  if (movErr) throw movErr
}

export async function uploadInventoryImage(
  itemId: number,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${itemId}/image.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('item_images')
    .upload(path, file, { upsert: true })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('item_images').getPublicUrl(path)
  const publicUrl = data.publicUrl

  const { error: updateError } = await supabase
    .from('inventory_items')
    .update({ image_url: publicUrl })
    .eq('id', itemId)
  if (updateError) throw updateError

  return publicUrl
}

// ── Sales & Checkout ───────────────────────────────────────────────────────

export async function checkoutSale(lines: CheckoutLine[]): Promise<void> {
  for (const line of lines) {
    const total = line.quantity * line.unit_price

    // Insert sale record
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({ ...line, total })
      .select()
      .single()
    if (saleError) throw saleError

    // Insert movement record
    const { error: movErr } = await supabase.from('inventory_movement').insert({
      inventory_item: line.inventory_item,
      movement_type: 'SALE',
      quantity: line.quantity,
      reference_id: sale.id,
    })
    if (movErr) throw movErr

    // Decrement stock
    const { data: item, error: fetchErr } = await supabase
      .from('inventory_items')
      .select('stock')
      .eq('id', line.inventory_item)
      .single()
    if (fetchErr) throw fetchErr

    const { error: stockErr } = await supabase
      .from('inventory_items')
      .update({ stock: (item as { stock: number }).stock - line.quantity })
      .eq('id', line.inventory_item)
    if (stockErr) throw stockErr
  }
}

export async function fetchSalesLog(): Promise<Sale[]> {
  const { data, error } = await supabase
    .from('sales')
    .select('*, inventory_items(name)')
    .order('sold_at', { ascending: false })
  if (error) throw error
  return data as Sale[]
}
