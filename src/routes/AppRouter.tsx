import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import { ProtectedRoute, AdminRoute } from '@/routes/ProtectedRoutes';
import ScrollToTop from '@/components/ui/ScrollToTop';
import MetaTags from '@/components/ui/MetaTags';
import PageLoader from '@/components/ui/PageLoader';

// Lazy load pages
const HomePage = React.lazy(() => import('@/pages/shop/HomePage'));
const ShopPage = React.lazy(() => import('@/pages/shop/ShopPage'));
const SalePage = React.lazy(() => import('@/pages/shop/SalePage'));
const ProductDetailPage = React.lazy(() => import('@/pages/shop/ProductDetailPage'));
const CartPage = React.lazy(() => import('@/pages/checkout/CartPage'));
const WishlistPage = React.lazy(() => import('@/pages/user/WishlistPage'));
const CheckoutPage = React.lazy(() => import('@/pages/checkout/CheckoutPage'));
const OrderPage = React.lazy(() => import('@/pages/checkout/OrderPage'));
const ProfilePage = React.lazy(() => import('@/pages/user/ProfilePage'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Support
const FAQPage = React.lazy(() => import('@/pages/support/FAQPage'));
const ShippingPage = React.lazy(() => import('@/pages/support/ShippingPage'));
const ContactPage = React.lazy(() => import('@/pages/support/ContactPage'));
const SizeGuidePage = React.lazy(() => import('@/pages/support/SizeGuidePage'));

// Legal
const PrivacyPage = React.lazy(() => import('@/pages/legal/PrivacyPage'));
const TermsPage = React.lazy(() => import('@/pages/legal/TermsPage'));

// Admin
const DashboardScreen = React.lazy(() => import('@/pages/admin/DashboardScreen'));
const ProductListScreen = React.lazy(() => import('@/pages/admin/ProductListScreen'));
const OrderListScreen = React.lazy(() => import('@/pages/admin/OrderListScreen'));
const UserListScreen = React.lazy(() => import('@/pages/admin/UserListScreen'));
const ProductEditScreen = React.lazy(() => import('@/pages/admin/ProductEditScreen'));
const AdminLayout = React.lazy(() => import('@/components/admin/AdminLayout'));
const LoginPage = React.lazy(() => import('@/pages/user/LoginPage'));


const AppRouter = () => {
    return (
        <Router>
            <ScrollToTop />
            <MetaTags />
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* ── Main routes — with Header + Footer ─────────────── */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="shop" element={<ShopPage />} />
                        <Route path="sale" element={<SalePage />} />
                        <Route path="product/:id" element={<ProductDetailPage />} />
                        <Route path="cart" element={<CartPage />} />
                        <Route path="wishlist" element={<WishlistPage />} />

                        {/* Support Group */}
                        <Route path="support">
                            <Route path="faq" element={<FAQPage />} />
                            <Route path="shipping" element={<ShippingPage />} />
                            <Route path="contact" element={<ContactPage />} />
                            <Route path="size-guide" element={<SizeGuidePage />} />
                        </Route>

                        {/* Legal Group */}
                        <Route path="legal">
                            <Route path="privacy" element={<PrivacyPage />} />
                            <Route path="terms" element={<TermsPage />} />
                        </Route>

                        {/* Direct Legacy / SEO Mappings */}
                        <Route path="faq" element={<FAQPage />} />
                        <Route path="shipping" element={<ShippingPage />} />
                        <Route path="contact" element={<ContactPage />} />

                        {/* Protected User Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="checkout" element={<CheckoutPage />} />
                            <Route path="account/orders" element={<ProfilePage />} />
                            <Route path="account/orders/:id" element={<OrderPage />} />
                            <Route path="profile" element={<ProfilePage />} />
                        </Route>
                    </Route>

                    {/* ── Admin routes ──────── */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<DashboardScreen />} />
                            <Route path="products" element={<ProductListScreen />} />
                            <Route path="products/:id/edit" element={<ProductEditScreen />} />
                            <Route path="orders" element={<OrderListScreen />} />
                            <Route path="users" element={<UserListScreen />} />
                        </Route>
                    </Route>

                    {/* ── Auth routes ─────────────── */}
                    <Route element={<AuthLayout />}>
                        <Route path="login" element={<LoginPage />} />
                    </Route>

                    {/* ── 404 Fallback ─────────────── */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
            <ToastContainer
                position="bottom-right"
                autoClose={4500}
                newestOnTop
                closeOnClick={false}
                pauseOnHover
                draggable={false}
                hideProgressBar
                theme="dark"
                toastStyle={{
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0,
                    border: 'none',
                }}
            />
        </Router>
    );
};

export default AppRouter;
