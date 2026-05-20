import type { Brand } from '../types/brand';

export const mockBrands: Brand[] = [
  { id: 'brand-1', name: 'FIT', description: 'Premium house line for serious athletes.', logo: 'BF', productCount: 11, status: 'active' },
  { id: 'brand-2', name: 'MuscleTech', description: 'Performance supplements and strength support.', logo: 'MT', productCount: 8, status: 'active' },
  { id: 'brand-3', name: 'C4', description: 'Energy-driven pre-workout products.', logo: 'C4', productCount: 6, status: 'active' },
  { id: 'brand-4', name: 'Now Foods', description: 'Vitamins and wellness essentials.', logo: 'NF', productCount: 10, status: 'inactive' },
];
