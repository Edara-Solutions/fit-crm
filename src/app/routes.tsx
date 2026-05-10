import { Navigate, RouteObject } from 'react-router-dom';
import { PublicOnlyRoute } from '../auth/PublicOnlyRoute';
import { RequireAuth } from '../auth/RequireAuth';
import { RoleProtectedRoute } from '../auth/RoleProtectedRoute';
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
import { routePermissions } from '../constants/permissions';

export const routes: RouteObject[] = [
  { path: '/login', element: <PublicOnlyRoute><LoginPage /></PublicOnlyRoute> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <RoleProtectedRoute roles={routePermissions.dashboard}><DashboardPage /></RoleProtectedRoute> },
      { path: 'orders', element: <RoleProtectedRoute roles={routePermissions.orders}><OrdersPage /></RoleProtectedRoute> },
      { path: 'orders/:id', element: <RoleProtectedRoute roles={routePermissions.orders}><OrderDetailsPage /></RoleProtectedRoute> },
      { path: 'products', element: <RoleProtectedRoute roles={routePermissions.products}><ProductsPage /></RoleProtectedRoute> },
      { path: 'products/new', element: <RoleProtectedRoute roles={routePermissions.products}><ProductFormPage /></RoleProtectedRoute> },
      { path: 'products/:id/edit', element: <RoleProtectedRoute roles={routePermissions.products}><ProductFormPage /></RoleProtectedRoute> },
      { path: 'categories', element: <RoleProtectedRoute roles={routePermissions.categories}><CategoriesPage /></RoleProtectedRoute> },
      { path: 'brands', element: <RoleProtectedRoute roles={routePermissions.brands}><BrandsPage /></RoleProtectedRoute> },
      { path: 'customers', element: <RoleProtectedRoute roles={routePermissions.customers}><CustomersPage /></RoleProtectedRoute> },
      { path: 'customers/:id', element: <RoleProtectedRoute roles={routePermissions.customers}><CustomerDetailsPage /></RoleProtectedRoute> },
      { path: 'users', element: <RoleProtectedRoute roles={routePermissions.users}><UsersPage /></RoleProtectedRoute> },
      { path: 'users/roles-permissions', element: <RoleProtectedRoute roles={routePermissions.users}><RolesPermissionsPage /></RoleProtectedRoute> },
      { path: 'coupons', element: <RoleProtectedRoute roles={routePermissions.coupons}><CouponsPage /></RoleProtectedRoute> },
      { path: 'inventory', element: <RoleProtectedRoute roles={routePermissions.inventory}><InventoryPage /></RoleProtectedRoute> },
      { path: 'reports', element: <RoleProtectedRoute roles={routePermissions.reports}><ReportsPage /></RoleProtectedRoute> },
      { path: 'settings', element: <RoleProtectedRoute roles={routePermissions.settings}><SettingsPage /></RoleProtectedRoute> },
    ],
  },
];
