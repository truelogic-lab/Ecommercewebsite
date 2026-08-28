import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import { AdminRoute } from './components/AdminRoute';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CareersPage } from './pages/CareersPage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CookieConsent } from './components/CookieConsent';
import { LocationPrompt } from './components/LocationPrompt';
import './styles/globals.css';

export const App: React.FC = () => {
  const handleLocationGranted = (location: { lat: number; lng: number; address: string }) => {
    console.log('Location granted:', location);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <AdminProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/track-order" element={<OrderTrackingPage />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/collection" element={<CollectionPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminRoute />}>
                <Route path="dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Redirect to admin dashboard */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
              </Route>
            </Routes>
            <CookieConsent />
            <LocationPrompt onLocationGranted={handleLocationGranted} />
          </Router>
        </AdminProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
