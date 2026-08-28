import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { products as initialProducts } from '../data/products';

interface Product {
  id: number;
  name: string;
  price: number;
  reviews: number;
  image: string;
  originalPrice?: number;
  rating?: number;
  category: string;
  description: string;
  features: string[];
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  deliveryMethod: string;
  estimatedDelivery: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
}

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  currency: string;
  freeShippingThreshold: number;
  standardDeliveryCost: number;
  expressDeliveryCost: number;
  sameDayDeliveryCost: number;
}

interface HomepageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonLink: string;
  marketingBannerTitle: string;
  marketingBannerSubtitle: string;
  marketingBannerButtonText: string;
  marketingBannerButtonLink: string;
  flashSaleTitle: string;
  flashSaleBadge: string;
  flashSaleDiscount: string;
  featuredCategories: string[];
  showNewArrivals: boolean;
  showBestSellers: boolean;
  newArrivalsTitle: string;
  bestSellersTitle: string;
}

interface AdminContextType {
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
  homepageSettings: HomepageSettings;
  addProduct: (product: Omit<Product, 'id' | 'reviews'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateSettings: (settings: Partial<StoreSettings>) => void;
  updateHomepageSettings: (settings: Partial<HomepageSettings>) => void;
  getOrderById: (id: string) => Order | undefined;
  getProductById: (id: number) => Product | undefined;
  getTotalRevenue: () => number;
  getPendingOrders: () => number;
  getTotalOrders: () => number;
  getTotalProducts: () => number;
  getRecentOrders: (limit?: number) => Order[];
  refreshData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const defaultHomepageSettings: HomepageSettings = {
  heroTitle: 'Discover Products You\'ll Love',
  heroSubtitle: 'Shop the latest trending products curated for modern lifestyles.',
  heroButtonText: 'Shop Now',
  heroButtonLink: '/collection',
  marketingBannerTitle: 'Summer Sale Up to 50% Off',
  marketingBannerSubtitle: 'Don\'t miss out on our biggest sale of the year.',
  marketingBannerButtonText: 'Shop Now',
  marketingBannerButtonLink: '/collection',
  flashSaleTitle: 'Flash Sale',
  flashSaleBadge: 'Up To 70% Off',
  flashSaleDiscount: '70',
  featuredCategories: ['Fashion', 'Electronics', 'Beauty', 'Fitness', 'Home Decor', 'Accessories'],
  showNewArrivals: true,
  showBestSellers: true,
  newArrivalsTitle: 'New Arrivals',
  bestSellersTitle: 'Best Sellers'
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('admin_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('admin_settings');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      storeName: 'ShopVerse',
      storeEmail: 'support@shopverse.com',
      currency: 'USD',
      freeShippingThreshold: 50,
      standardDeliveryCost: 5,
      expressDeliveryCost: 15,
      sameDayDeliveryCost: 25
    };
  });

  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(() => {
    const saved = localStorage.getItem('homepage_settings');
    return saved ? JSON.parse(saved) : defaultHomepageSettings;
  });

  // Auto-refresh: Check for changes every 5 seconds
  useEffect(() => {
    const checkForUpdates = () => {
      const savedProducts = localStorage.getItem('admin_products');
      const savedOrders = localStorage.getItem('orders');
      const savedSettings = localStorage.getItem('admin_settings');
      const savedHomepage = localStorage.getItem('homepage_settings');

      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (JSON.stringify(parsed) !== JSON.stringify(products)) {
          setProducts(parsed);
        }
      }

      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (JSON.stringify(parsed) !== JSON.stringify(orders)) {
          setOrders(parsed);
        }
      }

      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (JSON.stringify(parsed) !== JSON.stringify(settings)) {
          setSettings(parsed);
        }
      }

      if (savedHomepage) {
        const parsed = JSON.parse(savedHomepage);
        if (JSON.stringify(parsed) !== JSON.stringify(homepageSettings)) {
          setHomepageSettings(parsed);
        }
      }
    };

    const interval = setInterval(checkForUpdates, 5000);
    return () => clearInterval(interval);
  }, [products, orders, settings, homepageSettings]);

  // Listen for storage events (cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_products' && e.newValue) {
        setProducts(JSON.parse(e.newValue));
      }
      if (e.key === 'orders' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
      if (e.key === 'admin_settings' && e.newValue) {
        setSettings(JSON.parse(e.newValue));
      }
      if (e.key === 'homepage_settings' && e.newValue) {
        setHomepageSettings(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshData = useCallback(() => {
    const savedProducts = localStorage.getItem('admin_products');
    const savedOrders = localStorage.getItem('orders');
    const savedSettings = localStorage.getItem('admin_settings');
    const savedHomepage = localStorage.getItem('homepage_settings');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedHomepage) setHomepageSettings(JSON.parse(savedHomepage));
  }, []);

  const addProduct = (product: Omit<Product, 'id' | 'reviews'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      reviews: 0,
      rating: 4.0,
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('admin_products', JSON.stringify(updated));
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    const updated = products.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    setProducts(updated);
    localStorage.setItem('admin_products', JSON.stringify(updated));
  };

  const deleteProduct = (id: number) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('admin_products', JSON.stringify(updated));
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    const updated = orders.map(o => 
      o.id === id ? { ...o, status } : o
    );
    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
  };

  const updateSettings = (updates: Partial<StoreSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    localStorage.setItem('admin_settings', JSON.stringify(updated));
  };

  const updateHomepageSettings = (updates: Partial<HomepageSettings>) => {
    const updated = { ...homepageSettings, ...updates };
    setHomepageSettings(updated);
    localStorage.setItem('homepage_settings', JSON.stringify(updated));
  };

  const getOrderById = (id: string) => orders.find(o => o.id === id);
  const getProductById = (id: number) => products.find(p => p.id === id);
  const getTotalRevenue = () => orders.reduce((sum, o) => sum + o.total, 0);
  const getPendingOrders = () => orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const getTotalOrders = () => orders.length;
  const getTotalProducts = () => products.length;
  const getRecentOrders = (limit: number = 5) => orders.slice(0, limit);

  return (
    <AdminContext.Provider value={{
      products,
      orders,
      settings,
      homepageSettings,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      updateSettings,
      updateHomepageSettings,
      getOrderById,
      getProductById,
      getTotalRevenue,
      getPendingOrders,
      getTotalOrders,
      getTotalProducts,
      getRecentOrders,
      refreshData
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
