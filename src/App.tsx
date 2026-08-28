import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
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
import { CookieConsent } from './components/CookieConsent';
import { LocationPrompt } from './components/LocationPrompt';
import './styles/globals.css';

export const App: React.FC = () => {
  const handleLocationGranted = (location: { lat: number; lng: number; address: string }) => {
    console.log('Location granted:', location);
  };

  return (
    <CartProvider>
      <Router>
        <Routes>
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
        </Routes>
        <CookieConsent />
        <LocationPrompt onLocationGranted={handleLocationGranted} />
      </Router>
    </CartProvider>
  );
};

export default App;
