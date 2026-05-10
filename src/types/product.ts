export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';

export type Product = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  status: ProductStatus;
  featured: boolean;
  lowStockThreshold: number;
  flavors: string[];
  size: string;
  weight: string;
  servings: number;
  ingredients: string;
  nutritionFacts: string;
  warnings: string;
  usageInstructions: string;
  expiryDate: string;
};
