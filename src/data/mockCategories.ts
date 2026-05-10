import type { Category } from '../types/category';

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Protein', description: 'Whey, isolate, mass gainers, and recovery blends.', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=160&q=80', productCount: 18, status: 'active' },
  { id: 'cat-2', name: 'Strength', description: 'Creatine, power, and performance essentials.', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=160&q=80', productCount: 12, status: 'active' },
  { id: 'cat-3', name: 'Pre Workout', description: 'Energy, pump, and focus formulas.', image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=160&q=80', productCount: 9, status: 'active' },
  { id: 'cat-4', name: 'Health', description: 'Vitamins, omega, minerals, and wellness support.', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=160&q=80', productCount: 15, status: 'inactive' },
];
