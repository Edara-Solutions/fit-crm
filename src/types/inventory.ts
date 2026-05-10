export type StockChangeType = 'add' | 'reduce';

export type InventoryItem = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  expiryDate: string;
  lastUpdated: string;
};

export type StockAdjustment = {
  id: string;
  productName: string;
  type: StockChangeType;
  quantity: number;
  reason: string;
  date: string;
  user: string;
};
