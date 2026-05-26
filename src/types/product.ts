export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';

export type ProductOriginalPriceHistory = {
  price: number;
  note?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  _id?: string;
  id: string;
  slug?: string;
  name: string;
  shortDescription?: string;
  description: string;
  brand: string | { _id?: string; id?: string; name?: string };
  category: string | { _id?: string; id?: string; name?: string };
  image?: string;
  images?: string[];
  price: number;
  discountPrice?: number;
  revenue?: number;
  originalPriceHistory?: ProductOriginalPriceHistory[];
  totalViews?: number;
  views?: Record<string, number>;
  stock: number;
  sku: string;
  status?: ProductStatus;
  isActive?: boolean;
  featured?: boolean;
  isFeatured?: boolean;
  isStack?: boolean;
  lowStockThreshold?: number;
  flavors?: string[];
  size?: string;
  weight?: string;
  servings?: number;
  ingredients?: string | string[];
  nutritionFacts?: string | Record<string, unknown>;
  warnings?: string[];
  usageInstructions?: string[];
  expiryDate?: string;
  createdAt?: string;
  updatedAt?: string;
};
