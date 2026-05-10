import { Navigate, RouteObject } from 'react-router-dom';
import { RequireAuth } from '../auth/RequireAuth';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { BrandsPage } from '../pages/brands/BrandsPage';
import { CategoriesPage } from '../pages/categories/CategoriesPage';
import { CouponsPage } from '../pages/coupons/CouponsPage';
import { CustomerDetailsPage } from '../pages/customers/CustomerDetailsPage';
import { CustomersPage } from '../pages/customers/CustomersPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { InventoryPage } from '../pages/inventory/InventoryPage';
import { LoginPage } from '../pages/login/LoginPage';
import { OrderDetailsPage } from '../pages/orders/OrderDetailsPage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { ProductFormPage } from '../pages/products/ProductFormPage';
import { ProductsPage } from '../pages/products/ProductsPage';
import { ReportsPage } from '../pages/reports/ReportsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { RolesPermissionsPage } from '../pages/users/RolesPermissionsPage';
import { UsersPage } from '../pages/users/UsersPage';

export const routes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderDetailsPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/new', element: <ProductFormPage /> },
      { path: 'products/:id/edit', element: <ProductFormPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'brands', element: <BrandsPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'customers/:id', element: <CustomerDetailsPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'users/roles-permissions', element: <RolesPermissionsPage /> },
      { path: 'coupons', element: <CouponsPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
];
