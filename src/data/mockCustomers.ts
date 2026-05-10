import type { Customer } from '../types/customer';

export const mockCustomers: Customer[] = [
  { id: 'cus-1', name: 'Omar Hassan', email: 'omar@example.com', phone: '+20 100 222 1188', status: 'vip', totalOrders: 18, totalSpent: 64200, lastOrderDate: '2026-05-09', addresses: ['Nasr City, Cairo', 'New Cairo, Cairo'], usedCoupons: ['BULK15', 'FOXSHIP'], notes: 'Prefers chocolate flavors. VIP gym owner account.' },
  { id: 'cus-2', name: 'Mariam Adel', email: 'mariam@example.com', phone: '+20 111 934 4421', status: 'active', totalOrders: 7, totalSpent: 18450, lastOrderDate: '2026-05-07', addresses: ['Smouha, Alexandria'], usedCoupons: ['WELCOME10'], notes: 'Asked about lactose-free protein.' },
  { id: 'cus-3', name: 'Youssef Kareem', email: 'youssef@example.com', phone: '+20 122 771 9090', status: 'active', totalOrders: 4, totalSpent: 9200, lastOrderDate: '2026-04-29', addresses: ['Mansoura, Dakahlia'], usedCoupons: [], notes: 'Cash on delivery only.' },
  { id: 'cus-4', name: 'Nour Samir', email: 'nour@example.com', phone: '+20 101 887 5522', status: 'blocked', totalOrders: 2, totalSpent: 3600, lastOrderDate: '2026-03-14', addresses: ['Maadi, Cairo'], usedCoupons: ['WELCOME10'], notes: 'Two refused deliveries.' },
];
