import type { InventoryItem, StockAdjustment } from '../types/inventory';

export const mockInventory: InventoryItem[] = [
  { id: 'inv-1', productId: 'p-1001', productName: 'BE-FOX Whey Isolate 2kg', sku: 'BFX-WHY-2KG', stock: 124, lowStockThreshold: 20, expiryDate: '2027-02-20', lastUpdated: '2026-05-10' },
  { id: 'inv-2', productId: 'p-1002', productName: 'Creatine Monohydrate 300g', sku: 'MST-CRT-300', stock: 45, lowStockThreshold: 15, expiryDate: '2026-11-15', lastUpdated: '2026-05-09' },
  { id: 'inv-3', productId: 'p-1003', productName: 'C4 Pre Workout Blast', sku: 'C4-PRE-BST', stock: 9, lowStockThreshold: 12, expiryDate: '2026-07-01', lastUpdated: '2026-05-08' },
  { id: 'inv-4', productId: 'p-1004', productName: 'Omega-3 Performance Caps', sku: 'NOW-OMG-120', stock: 0, lowStockThreshold: 25, expiryDate: '2026-06-10', lastUpdated: '2026-05-07' },
];

export const mockStockAdjustments: StockAdjustment[] = [
  { id: 'adj-1', productName: 'BE-FOX Whey Isolate 2kg', type: 'add', quantity: 40, reason: 'Supplier delivery received', date: '2026-05-10', user: 'Karim Fathy' },
  { id: 'adj-2', productName: 'C4 Pre Workout Blast', type: 'reduce', quantity: 6, reason: 'Damaged packaging removed', date: '2026-05-08', user: 'Karim Fathy' },
  { id: 'adj-3', productName: 'Omega-3 Performance Caps', type: 'reduce', quantity: 12, reason: 'Online order allocation', date: '2026-05-07', user: 'Salma Nabil' },
];
