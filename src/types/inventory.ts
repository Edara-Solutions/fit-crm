export type StockChangeType = 'add' | 'reduce';

export type InventoryItem = {
  _id?: string;
  id: string;
  productId?: string;
  productName?: string;
  name?: string;
  sku?: string;
  category?: string;
  brand?: string;
  stock: number;
  lowStockThreshold?: number;
  expiryDate?: string;
  lastUpdated?: string;
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
