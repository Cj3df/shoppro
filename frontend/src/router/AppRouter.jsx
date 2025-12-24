import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import StorefrontLayout from '../layouts/StorefrontLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Admin Pages
import DashboardPage from '../pages/admin/DashboardPage';
import ProductListPage from '../pages/admin/ProductListPage';
import ProductFormPage from '../pages/admin/ProductFormPage';
import OrderListPage from '../pages/admin/OrderListPage';
import OrderDetailPage from '../pages/admin/OrderDetailPage';

// Storefront Pages
import HomePage from '../pages/storefront/HomePage';
import ProductCatalogPage from '../pages/storefront/ProductCatalogPage';
import ProductDetailPage from '../pages/storefront/ProductDetailPage';
import CartPage from '../pages/storefront/CartPage';
import CheckoutPage from '../pages/storefront/CheckoutPage';
import MyOrdersPage from '../pages/storefront/MyOrdersPage';
import WishlistPage from '../pages/storefront/WishlistPage';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

const AppRouter = () => {
    return (
        <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<div className="p-8 text-center">Forgot Password Page</div>} />

            {/* Admin / Staff Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <RoleRoute allowedRoles={['admin', 'staff']}>
                            <AdminLayout />
                        </RoleRoute>
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="products/new" element={<ProductFormPage />} />
                <Route path="products/:id/edit" element={<ProductFormPage />} />
                <Route path="orders" element={<OrderListPage />} />
                <Route path="orders/:id" element={<OrderDetailPage />} />
                <Route path="inventory" element={<div className="p-8">Inventory Logs (Coming Soon)</div>} />
                <Route path="users" element={<div className="p-8">User Management (Coming Soon)</div>} />
                <Route path="settings" element={<div className="p-8">Settings (Coming Soon)</div>} />
            </Route>

            {/* Storefront Routes */}
            <Route path="/" element={<StorefrontLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductCatalogPage />} />
                <Route path="products/:slug" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route
                    path="checkout"
                    element={
                        <ProtectedRoute>
                            <CheckoutPage />
                        </ProtectedRoute>
                    }
                />

                {/* Customer Protected Routes */}
                <Route
                    path="my-orders"
                    element={
                        <ProtectedRoute>
                            <MyOrdersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="wishlist"
                    element={
                        <ProtectedRoute>
                            <WishlistPage />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* 404 */}
            <Route path="*" element={<div className="p-20 text-center font-bold text-2xl">404 - Page Not Found</div>} />
        </Routes>
    );
};

export default AppRouter;
