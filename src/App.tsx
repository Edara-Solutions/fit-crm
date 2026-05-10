/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Placeholder } from './pages/Placeholder';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Placeholder title="Users & Staff Management" />} />
          <Route path="customers" element={<Placeholder title="Customers Directory" />} />
          <Route path="categories" element={<Placeholder title="Product Categories" />} />
          <Route path="brands" element={<Placeholder title="Brands Management" />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Placeholder title="Orders Management" />} />
          <Route path="coupons" element={<Placeholder title="Coupon Codes" />} />
          <Route path="inventory" element={<Placeholder title="Inventory Tracking" />} />
          <Route path="payments" element={<Placeholder title="Payment History" />} />
          <Route path="reports" element={<Placeholder title="Business Reports" />} />
          <Route path="settings" element={<Placeholder title="System Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

