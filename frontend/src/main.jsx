import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminProductListPage from './pages/AdminProductListPage.jsx';
import AdminProductCreatePage from './pages/AdminProductCreatePage.jsx';
import AdminProductEditPage from './pages/AdminProductEditPage.jsx';
import AdminOrderListPage from './pages/AdminOrderListPage.jsx';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage.jsx';
import MyOrdersListPage from './pages/MyOrdersListPage.jsx';
import MyOrderDetailPage from './pages/MyOrderDetailPage.jsx';
import AboutUsPage from './pages/AboutUsPage.jsx';
import AdminAboutUsEditPage from './pages/AdminAboutUsEditPage.jsx';
import LeaveReviewPage from './pages/LeaveReviewPage.jsx';
import AdminTestimonialListPage from './pages/AdminTestimonialListPage.jsx';
import AdminSettingsPage from './pages/AdminSettingsPage.jsx';
import ShippingPolicyPage from './pages/ShippingPolicyPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import TermsOfServicePage from './pages/TermsOfServicePage.jsx';
import SizeGuidePage from './pages/SizeGuidePage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import AdminReviewsPage from './pages/AdminReviewsPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import LoyaltyPage from './pages/LoyaltyPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about-us', element: <AboutUsPage /> },
      { path: '/shipping-policy', element: <ShippingPolicyPage /> },
      { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
      { path: '/terms-of-service', element: <TermsOfServicePage /> },
      { path: '/size-guide', element: <SizeGuidePage /> },
      { path: '/product/:id', element: <ProductPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/leave-review', element: <ProtectedRoute><LeaveReviewPage /></ProtectedRoute> },
      { path: '/cart', element: <ProtectedRoute><CartPage /></ProtectedRoute> },
      { path: '/checkout', element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> },
      { path: '/payment', element: <ProtectedRoute><PaymentPage /></ProtectedRoute> },
      { path: '/order-confirmation', element: <ProtectedRoute><OrderConfirmationPage /></ProtectedRoute> },
      { path: '/my-orders', element: <ProtectedRoute><MyOrdersListPage /></ProtectedRoute> },
      { path: '/order/:id', element: <ProtectedRoute><MyOrderDetailPage /></ProtectedRoute> },
      { path: '/profile', element: <ProtectedRoute><UserProfilePage /></ProtectedRoute> },
      { path: '/blog', element: <BlogPage /> },
      { path: '/blog/:id', element: <BlogPostPage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/loyalty', element: <ProtectedRoute><LoyaltyPage /></ProtectedRoute> },
      { path: '/admin', element: <AdminRoute><AdminDashboardPage /></AdminRoute> },
      { path: '/admin/productlist', element: <AdminRoute><AdminProductListPage /></AdminRoute> },
      { path: '/admin/product/create', element: <AdminRoute><AdminProductCreatePage /></AdminRoute> },
      { path: '/admin/product/:id/edit', element: <AdminRoute><AdminProductEditPage /></AdminRoute> },
      { path: '/admin/orderlist', element: <AdminRoute><AdminOrderListPage /></AdminRoute> },
      { path: '/admin/order/:id', element: <AdminRoute><AdminOrderDetailPage /></AdminRoute> },
      { path: '/admin/about-us/edit', element: <AdminRoute><AdminAboutUsEditPage /></AdminRoute> },
      { path: '/admin/testimonials', element: <AdminRoute><AdminTestimonialListPage /></AdminRoute> },
      { path: '/admin/reviews', element: <AdminRoute><AdminReviewsPage /></AdminRoute> },
      { path: '/admin/settings', element: <AdminRoute><AdminSettingsPage /></AdminRoute> },
    ],
  },
]);

const GOOGLE_CLIENT_ID = "612517409433-pbe7tfdh2qle3f4nt9086cokdprm95hb.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);