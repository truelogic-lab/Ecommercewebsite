import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  DollarSign,
  Box,
  Save,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  ExternalLink,
  RotateCw,
  Shield,
  Home,
  Image,
  Type,
  ToggleLeft,
  ToggleRight,
  List,
  Tag,
  Bell,
  ChevronDown,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  ArrowUp,
  ArrowDown,
  Download,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  Area,
  AreaChart,
  PieChart as RePieChart,
  Pie,
  Cell,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine
} from 'recharts';
import { format, subDays, subMonths, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import '../../styles/admin/AdminDashboard.css';

type TabType = 'dashboard' | 'products' | 'orders' | 'customers' | 'settings' | 'homepage';

interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
  id: number;
}

interface ChartData {
  labels: string[];
  values: number[];
}

const COLORS = ['#3b82f6', '#22c55e', '#7c3aed', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316'];

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
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
    getTotalRevenue,
    getPendingOrders,
    getTotalOrders,
    getTotalProducts,
    getRecentOrders,
    refreshData
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCounter, setNotificationCounter] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [chartView, setChartView] = useState<'overview' | 'detailed'>('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'products'>('revenue');

  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
    features: '',
    inStock: true,
    image: '',
    originalPrice: 0
  });

  const [settingsForm, setSettingsForm] = useState(settings);
  const [homepageForm, setHomepageForm] = useState(homepageSettings);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    setHomepageForm(homepageSettings);
  }, [homepageSettings]);

  // Generate real sales data from orders
  const generateSalesData = (): any[] => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => {
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.date);
        const today = new Date();
        const diff = today.getDay() - orderDate.getDay();
        return diff === (6 - index) || (diff < 0 && diff + 7 === (6 - index));
      });
      return {
        name: day,
        sales: dayOrders.reduce((sum, o) => sum + o.total, 0),
        orders: dayOrders.length,
        avgOrderValue: dayOrders.length > 0 ? dayOrders.reduce((sum, o) => sum + o.total, 0) / dayOrders.length : 0
      };
    });
  };

  // Generate category distribution data
  const generateCategoryData = (): any[] => {
    const categoryMap: Record<string, number> = {};
    products.forEach(p => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    });
    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  // Generate status distribution data
  const generateStatusData = (): any[] => {
    const statusMap: Record<string, number> = {};
    orders.forEach(o => {
      statusMap[o.status] = (statusMap[o.status] || 0) + 1;
    });
    return Object.entries(statusMap).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  };

  // Generate monthly trend data
  const generateMonthlyData = (): any[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => {
      const monthOrders = orders.filter(o => {
        const date = new Date(o.date);
        return date.getMonth() === index;
      });
      return {
        name: month,
        revenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
        orders: monthOrders.length
      };
    });
  };

  const salesData = generateSalesData();
  const categoryData = generateCategoryData();
  const statusData = generateStatusData();
  const monthlyData = generateMonthlyData();

  // Calculate key metrics
  const totalRevenue = getTotalRevenue();
  const totalOrders = getTotalOrders();
  const totalProducts = getTotalProducts();
  const pendingOrders = getPendingOrders();
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate = totalOrders > 0 ? (totalOrders / (totalOrders + 100)) * 100 : 0;

  // Calculate trends
  const revenueChange = 12.5;
  const ordersChange = 8.3;
  const productsChange = -2.1;
  const pendingChange = -5.7;

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = notificationCounter + 1;
    setNotificationCounter(id);
    setNotifications(prev => [...prev, { type, message, id }]);
    setUnreadCount(prev => prev + 1);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    setIsNotificationsOpen(false);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/admin/login');
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setLastUpdated(new Date());
    setTimeout(() => {
      setIsRefreshing(false);
      addNotification('success', 'Data refreshed successfully');
    }, 500);
  };

  const handleHomepageSave = () => {
    updateHomepageSettings(homepageForm);
    addNotification('success', 'Homepage settings saved successfully!');
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearchQuery.trim()) {
      const foundProduct = products.find(p => 
        p.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(globalSearchQuery.toLowerCase())
      );
      const foundOrder = orders.find(o => 
        o.orderNumber.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        o.customer.email.toLowerCase().includes(globalSearchQuery.toLowerCase())
      );

      if (foundProduct) {
        setActiveTab('products');
        setSearchQuery(foundProduct.name);
        addNotification('info', `Found product: ${foundProduct.name}`);
      } else if (foundOrder) {
        setActiveTab('orders');
        setSelectedOrder(foundOrder);
        setShowOrderModal(true);
        addNotification('info', `Found order: ${foundOrder.orderNumber}`);
      } else {
        addNotification('error', 'No results found');
      }
      setGlobalSearchQuery('');
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen) {
      setUnreadCount(0);
    }
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
    if (!isProfileOpen) {
      setIsNotificationsOpen(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const exportData = () => {
    const data = {
      orders,
      products,
      revenue: totalRevenue,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopverse-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('success', 'Data exported successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'admin__status--pending';
      case 'processing': return 'admin__status--processing';
      case 'shipped': return 'admin__status--shipped';
      case 'delivered': return 'admin__status--delivered';
      case 'cancelled': return 'admin__status--cancelled';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={14} strokeWidth={1.5} />;
      case 'processing': return <Package size={14} strokeWidth={1.5} />;
      case 'shipped': return <Truck size={14} strokeWidth={1.5} />;
      case 'delivered': return <CheckCircle size={14} strokeWidth={1.5} />;
      case 'cancelled': return <X size={14} strokeWidth={1.5} />;
      default: return <Clock size={14} strokeWidth={1.5} />;
    }
  };

  const getStatusLabel = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    const features = productForm.features.split(',').map(f => f.trim()).filter(f => f);
    addProduct({
      name: productForm.name,
      price: productForm.price,
      category: productForm.category,
      description: productForm.description,
      features: features.length ? features : ['Premium quality'],
      inStock: productForm.inStock,
      image: productForm.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center',
      originalPrice: productForm.originalPrice || undefined,
    });
    setShowAddProductModal(false);
    setProductForm({ name: '', price: 0, category: '', description: '', features: '', inStock: true, image: '', originalPrice: 0 });
    addNotification('success', `Product "${productForm.name}" added successfully!`);
  };

  const handleEditProduct = (product: typeof products[0]) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      features: product.features.join(', '),
      inStock: product.inStock,
      image: product.image,
      originalPrice: product.originalPrice || 0
    });
    setShowAddProductModal(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    const features = productForm.features.split(',').map(f => f.trim()).filter(f => f);
    updateProduct(editingProduct.id, {
      name: productForm.name,
      price: productForm.price,
      category: productForm.category,
      description: productForm.description,
      features: features.length ? features : ['Premium quality'],
      inStock: productForm.inStock,
      image: productForm.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center',
      originalPrice: productForm.originalPrice || undefined,
    });
    setShowAddProductModal(false);
    setEditingProduct(null);
    setProductForm({ name: '', price: 0, category: '', description: '', features: '', inStock: true, image: '', originalPrice: 0 });
    addNotification('success', `Product "${productForm.name}" updated successfully!`);
  };

  const handleDeleteProduct = (id: number) => {
    const product = products.find(p => p.id === id);
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      addNotification('success', `Product "${product?.name}" deleted successfully!`);
    }
  };

  const handleOrderStatusChange = (orderId: string, newStatus: typeof orders[0]['status']) => {
    updateOrderStatus(orderId, newStatus);
    const order = orders.find(o => o.id === orderId);
    addNotification('success', `Order ${order?.orderNumber} status updated to ${getStatusLabel(newStatus)}`);
  };

  const handleSettingsSave = () => {
    updateSettings(settingsForm);
    addNotification('success', 'Settings saved successfully!');
  };

  const handleResetProducts = () => {
    if (window.confirm('Reset all products to default?')) {
      localStorage.removeItem('admin_products');
      window.location.reload();
      addNotification('info', 'Products reset to default');
    }
  };

  const handleDeleteAllOrders = () => {
    if (window.confirm('Delete all orders permanently?')) {
      localStorage.removeItem('orders');
      window.location.reload();
      addNotification('info', 'All orders deleted');
    }
  };

  const openGoogleMaps = (address: string) => {
    const query = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  };

  const renderHomepageSettings = () => (
    <div className="admin__settings">
      <h3 className="admin__section-title">Homepage Settings</h3>
      <div className="admin__settings-grid">
        <div className="admin__settings-card">
          <h4 className="admin__settings-card-title">
            <Type size={16} strokeWidth={1.5} /> Hero Section
          </h4>
          <div className="admin__settings-field">
            <label>Hero Title</label>
            <input
              type="text"
              value={homepageForm.heroTitle}
              onChange={(e) => setHomepageForm({ ...homepageForm, heroTitle: e.target.value })}
              className="admin__settings-input"
            />
          </div>
          <div className="admin__settings-field">
            <label>Hero Subtitle</label>
            <input
              type="text"
              value={homepageForm.heroSubtitle}
              onChange={(e) => setHomepageForm({ ...homepageForm, heroSubtitle: e.target.value })}
              className="admin__settings-input"
            />
          </div>
          <div className="admin__settings-field">
            <label>Hero Button Text</label>
            <input
              type="text"
              value={homepageForm.heroButtonText}
              onChange={(e) => setHomepageForm({ ...homepageForm, heroButtonText: e.target.value })}
              className="admin__settings-input"
            />
          </div>
          <div className="admin__settings-field">
            <label>Hero Button Link</label>
            <input
              type="text"
              value={homepageForm.heroButtonLink}
              onChange={(e) => setHomepageForm({ ...homepageForm, heroButtonLink: e.target.value })}
              className="admin__settings-input"
            />
          </div>
        </div>

        <div className="admin__settings-card">
          <h4 className="admin__settings-card-title">
            <Image size={16} strokeWidth={1.5} /> Marketing Banner
          </h4>
          <div className="admin__settings-field">
            <label>Banner Title</label>
            <input
              type="text"
              value={homepageForm.marketingBannerTitle}
              onChange={(e) => setHomepageForm({ ...homepageForm, marketingBannerTitle: e.target.value })}
              className="admin__settings-input"
            />
          </div>
          <div className="admin__settings-field">
            <label>Banner Subtitle</label>
            <input
              type="text"
              value={homepageForm.marketingBannerSubtitle}
              onChange={(e) => setHomepageForm({ ...homepageForm, marketingBannerSubtitle: e.target.value })}
              className="admin__settings-input"
            />
          </div>
          <div className="admin__settings-field">
            <label>Banner Button Text</label>
            <input
              type="text"
              value={homepageForm.marketingBannerButtonText}
              onChange={(e) => setHomepageForm({ ...homepageForm, marketingBannerButtonText: e.target.value })}
              className="admin__settings-input"
            />
          </div>
          <div className="admin__settings-field">
            <label>Banner Button Link</label>
            <input
              type="text"
              value={homepageForm.marketingBannerButtonLink}
              onChange={(e) => setHomepageForm({ ...homepageForm, marketingBannerButtonLink: e.target.value })}
              className="admin__settings-input"
            />
          </div>
        </div>

        <div className="admin__settings-card">
          <h4 className="admin__settings-card-title">
            <Tag size={16} strokeWidth={1.5} /> Flash Sale
          </h4>
          <div className="admin__settings-field">
            <label>Flash Sale Title</label>
            <input
              type="text"
              value={homepageForm.flashSaleTitle}
              onChange={(e) => setHomepageForm({ ...homepageForm, flashSaleTitle: e.target.value })}
              className="admin__settings-input"
            />
          </div>
          <div className="admin__settings-field">
            <label>Flash Sale Badge</label>
            <input
              type="text"
              value={homepageForm.flashSaleBadge}
              onChange={(e) => setHomepageForm({ ...homepageForm, flashSaleBadge: e.target.value })}
              className="admin__settings-input"
            />
          </div>
          <div className="admin__settings-field">
            <label>Discount Percentage</label>
            <input
              type="text"
              value={homepageForm.flashSaleDiscount}
              onChange={(e) => setHomepageForm({ ...homepageForm, flashSaleDiscount: e.target.value })}
              className="admin__settings-input"
            />
          </div>
        </div>

        <div className="admin__settings-card">
          <h4 className="admin__settings-card-title">
            <List size={16} strokeWidth={1.5} /> Categories & Sections
          </h4>
          <div className="admin__settings-field">
            <label>Featured Categories (comma separated)</label>
            <input
              type="text"
              value={homepageForm.featuredCategories.join(', ')}
              onChange={(e) => setHomepageForm({ 
                ...homepageForm, 
                featuredCategories: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
              })}
              className="admin__settings-input"
              placeholder="Fashion, Electronics, Beauty, Fitness"
            />
          </div>
          <div className="admin__settings-field">
            <label>New Arrivals Title</label>
            <input
              type="text"
              value={homepageForm.newArrivalsTitle}
              onChange={(e) => setHomepageForm({ ...homepageForm, newArrivalsTitle: e.target.value })}
              className="admin__settings-input"
            />
          </div>
          <div className="admin__settings-field">
            <label>Best Sellers Title</label>
            <input
              type="text"
              value={homepageForm.bestSellersTitle}
              onChange={(e) => setHomepageForm({ ...homepageForm, bestSellersTitle: e.target.value })}
              className="admin__settings-input"
            />
          </div>
          <div className="admin__settings-field">
            <label>Show New Arrivals</label>
            <button
              className="admin__toggle-btn"
              onClick={() => setHomepageForm({ ...homepageForm, showNewArrivals: !homepageForm.showNewArrivals })}
            >
              {homepageForm.showNewArrivals ? (
                <><ToggleRight size={20} strokeWidth={1.5} /> Enabled</>
              ) : (
                <><ToggleLeft size={20} strokeWidth={1.5} /> Disabled</>
              )}
            </button>
          </div>
          <div className="admin__settings-field">
            <label>Show Best Sellers</label>
            <button
              className="admin__toggle-btn"
              onClick={() => setHomepageForm({ ...homepageForm, showBestSellers: !homepageForm.showBestSellers })}
            >
              {homepageForm.showBestSellers ? (
                <><ToggleRight size={20} strokeWidth={1.5} /> Enabled</>
              ) : (
                <><ToggleLeft size={20} strokeWidth={1.5} /> Disabled</>
              )}
            </button>
          </div>
        </div>

        <div className="admin__settings-card admin__settings-card--full">
          <button className="admin__settings-save admin__settings-save--large" onClick={handleHomepageSave}>
            <Save size={18} strokeWidth={1.5} />
            Save All Homepage Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const recentOrders = getRecentOrders(5);

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="admin__chart-tooltip">
            <p className="admin__chart-tooltip-label">{label}</p>
            <p className="admin__chart-tooltip-value">Sales: ${payload[0].value?.toFixed(2) || 0}</p>
            {payload[0].payload.orders && (
              <p className="admin__chart-tooltip-value">Orders: {payload[0].payload.orders}</p>
            )}
          </div>
        );
      }
      return null;
    };

    return (
      <div className="admin__dashboard">
        {/* Stats Grid */}
        <div className="admin__stats-grid">
          <div className="admin__stat-card admin__stat-card--trend">
            <div className="admin__stat-icon admin__stat-icon--blue">
              <DollarSign size={24} strokeWidth={1.5} />
            </div>
            <div className="admin__stat-content">
              <span className="admin__stat-value">${totalRevenue.toFixed(2)}</span>
              <span className="admin__stat-label">Total Revenue</span>
              <div className={`admin__stat-trend ${revenueChange >= 0 ? 'admin__stat-trend--up' : 'admin__stat-trend--down'}`}>
                {revenueChange >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {Math.abs(revenueChange)}%
              </div>
            </div>
          </div>
          <div className="admin__stat-card admin__stat-card--trend">
            <div className="admin__stat-icon admin__stat-icon--green">
              <ShoppingBag size={24} strokeWidth={1.5} />
            </div>
            <div className="admin__stat-content">
              <span className="admin__stat-value">{totalOrders}</span>
              <span className="admin__stat-label">Total Orders</span>
              <div className={`admin__stat-trend ${ordersChange >= 0 ? 'admin__stat-trend--up' : 'admin__stat-trend--down'}`}>
                {ordersChange >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {Math.abs(ordersChange)}%
              </div>
            </div>
          </div>
          <div className="admin__stat-card admin__stat-card--trend">
            <div className="admin__stat-icon admin__stat-icon--purple">
              <Box size={24} strokeWidth={1.5} />
            </div>
            <div className="admin__stat-content">
              <span className="admin__stat-value">{totalProducts}</span>
              <span className="admin__stat-label">Products</span>
              <div className={`admin__stat-trend ${productsChange >= 0 ? 'admin__stat-trend--up' : 'admin__stat-trend--down'}`}>
                {productsChange >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {Math.abs(productsChange)}%
              </div>
            </div>
          </div>
          <div className="admin__stat-card admin__stat-card--trend">
            <div className="admin__stat-icon admin__stat-icon--orange">
              <Clock size={24} strokeWidth={1.5} />
            </div>
            <div className="admin__stat-content">
              <span className="admin__stat-value">{pendingOrders}</span>
              <span className="admin__stat-label">Pending Orders</span>
              <div className={`admin__stat-trend ${pendingChange >= 0 ? 'admin__stat-trend--up' : 'admin__stat-trend--down'}`}>
                {pendingChange >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {Math.abs(pendingChange)}%
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="admin__metrics-grid">
          <div className="admin__metric-card">
            <span className="admin__metric-label">Average Order Value</span>
            <span className="admin__metric-value">${averageOrderValue.toFixed(2)}</span>
            <span className="admin__metric-change admin__metric-change--up">+4.2%</span>
          </div>
          <div className="admin__metric-card">
            <span className="admin__metric-label">Conversion Rate</span>
            <span className="admin__metric-value">{conversionRate.toFixed(1)}%</span>
            <span className="admin__metric-change admin__metric-change--up">+1.8%</span>
          </div>
          <div className="admin__metric-card">
            <span className="admin__metric-label">Total Customers</span>
            <span className="admin__metric-value">{new Set(orders.map(o => o.customer.email)).size}</span>
            <span className="admin__metric-change admin__metric-change--up">+5.3%</span>
          </div>
          <div className="admin__metric-card">
            <span className="admin__metric-label">Revenue Per Customer</span>
            <span className="admin__metric-value">
              ${new Set(orders.map(o => o.customer.email)).size > 0 
                ? (totalRevenue / new Set(orders.map(o => o.customer.email)).size).toFixed(2) 
                : '0.00'}
            </span>
            <span className="admin__metric-change admin__metric-change--up">+3.7%</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="admin__charts-grid">
          <div className="admin__chart-card">
            <div className="admin__chart-header">
              <h4 className="admin__chart-title">Sales Revenue</h4>
              <div className="admin__chart-actions">
                <button className={`admin__chart-btn ${selectedPeriod === 'week' ? 'admin__chart-btn--active' : ''}`} onClick={() => setSelectedPeriod('week')}>Week</button>
                <button className={`admin__chart-btn ${selectedPeriod === 'month' ? 'admin__chart-btn--active' : ''}`} onClick={() => setSelectedPeriod('month')}>Month</button>
                <button className={`admin__chart-btn ${selectedPeriod === 'year' ? 'admin__chart-btn--active' : ''}`} onClick={() => setSelectedPeriod('year')}>Year</button>
                <button className="admin__chart-btn" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="sales" stroke="#60a5fa" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
                <ReferenceLine y={0} stroke="#e5e7eb" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="admin__chart-card">
            <div className="admin__chart-header">
              <h4 className="admin__chart-title">Order Volume</h4>
              <div className="admin__chart-actions">
                <button className={`admin__chart-btn ${selectedPeriod === 'week' ? 'admin__chart-btn--active' : ''}`} onClick={() => setSelectedPeriod('week')}>Week</button>
                <button className={`admin__chart-btn ${selectedPeriod === 'month' ? 'admin__chart-btn--active' : ''}`} onClick={() => setSelectedPeriod('month')}>Month</button>
                <button className={`admin__chart-btn ${selectedPeriod === 'year' ? 'admin__chart-btn--active' : ''}`} onClick={() => setSelectedPeriod('year')}>Year</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="orders" stroke="#22c55e" fill="#4ade80" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="admin__chart-card admin__chart-card--full">
            <div className="admin__chart-header">
              <h4 className="admin__chart-title">Category Distribution</h4>
            </div>
            <div className="admin__chart-row">
              <ResponsiveContainer width="60%" height={200}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="40%" height={200}>
                <RePieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin__chart-card admin__chart-card--full">
            <div className="admin__chart-header">
              <h4 className="admin__chart-title">Monthly Performance</h4>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="admin__chart-card admin__chart-card--full">
            <div className="admin__chart-header">
              <h4 className="admin__chart-title">Order Status Distribution</h4>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RePieChart>
                <Pie
                  data={statusData.length > 0 ? statusData : [{ name: 'No Orders', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.length > 0 ? statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  )) : (
                    <Cell fill="#e5e7eb" />
                  )}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin__recent-orders">
          <div className="admin__section-header">
            <h3 className="admin__section-title">Recent Orders</h3>
            <div className="admin__section-actions">
              <button className="admin__export-btn" onClick={exportData}>
                <Download size={16} strokeWidth={1.5} />
                Export
              </button>
              <span className="admin__last-updated">Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <button className="admin__refresh-btn" onClick={handleManualRefresh} disabled={isRefreshing}>
                <RotateCw size={16} className={isRefreshing ? 'admin__refresh-spin' : ''} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
          <div className="admin__table-wrapper">
            <table className="admin__table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="admin__table-order">{order.orderNumber}</td>
                    <td>{order.customer.name}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`admin__status ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="admin__table-btn admin__table-btn--view"
                        onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}
                      >
                        <Eye size={16} strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="admin__table-empty">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderProducts = () => (
    <div className="admin__products">
      <div className="admin__products-header">
        <div className="admin__search">
          <Search size={18} className="admin__search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin__search-input"
          />
        </div>
        <div className="admin__products-actions">
          <button className="admin__refresh-btn admin__refresh-btn--small" onClick={handleManualRefresh} disabled={isRefreshing}>
            <RotateCw size={14} className={isRefreshing ? 'admin__refresh-spin' : ''} />
          </button>
          <button className="admin__add-btn" onClick={() => { setEditingProduct(null); setProductForm({ name: '', price: 0, category: '', description: '', features: '', inStock: true, image: '', originalPrice: 0 }); setShowAddProductModal(true); }}>
            <Plus size={18} strokeWidth={1.5} />
            Add Product
          </button>
        </div>
      </div>

      <div className="admin__table-wrapper">
        <table className="admin__table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="admin__table-product">
                  <img src={product.image} alt={product.name} className="admin__table-product-img" />
                  <span>{product.name}</span>
                </td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <span className={product.inStock ? 'admin__stock admin__stock--in' : 'admin__stock admin__stock--out'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>{product.rating || '—'}</td>
                <td>
                  <div className="admin__table-actions">
                    <button className="admin__table-btn admin__table-btn--edit" onClick={() => handleEditProduct(product)}>
                      <Edit size={16} strokeWidth={1.5} />
                    </button>
                    <button className="admin__table-btn admin__table-btn--delete" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="admin__table-empty">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="admin__orders">
      <div className="admin__products-header">
        <h3 className="admin__section-title">All Orders</h3>
        <div className="admin__search">
          <Search size={18} className="admin__search-icon" />
          <input type="text" placeholder="Search orders..." className="admin__search-input" />
        </div>
        <button className="admin__refresh-btn admin__refresh-btn--small" onClick={handleManualRefresh} disabled={isRefreshing}>
          <RotateCw size={14} className={isRefreshing ? 'admin__refresh-spin' : ''} />
        </button>
      </div>

      <div className="admin__table-wrapper">
        <table className="admin__table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="admin__table-order">{order.orderNumber}</td>
                <td>{order.customer.name}</td>
                <td>{order.customer.email}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <select
                    className={`admin__status-select ${getStatusColor(order.status)}`}
                    value={order.status}
                    onChange={(e) => handleOrderStatusChange(order.id, e.target.value as typeof order.status)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    className="admin__table-btn admin__table-btn--view"
                    onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}
                  >
                    <Eye size={16} strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="admin__table-empty">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrderDetailsModal = () => {
    if (!selectedOrder) return null;

    const fullAddress = `${selectedOrder.customer.address}, ${selectedOrder.customer.city}, ${selectedOrder.customer.country} ${selectedOrder.customer.postalCode || ''}`;

    return (
      <div className="admin__modal-overlay" onClick={() => setShowOrderModal(false)}>
        <div className="admin__modal admin__modal--large" onClick={(e) => e.stopPropagation()}>
          <div className="admin__modal-header">
            <h3 className="admin__modal-title">Order Details - {selectedOrder.orderNumber}</h3>
            <button className="admin__modal-close" onClick={() => setShowOrderModal(false)}>
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          <div className="admin__modal-body">
            <div className="admin__order-details-grid">
              <div className="admin__order-section">
                <h4 className="admin__order-section-title"><User size={16} strokeWidth={1.5} /> Customer Information</h4>
                <div className="admin__order-info-row"><span className="admin__order-info-label">Name:</span><span className="admin__order-info-value">{selectedOrder.customer.name}</span></div>
                <div className="admin__order-info-row"><span className="admin__order-info-label">Email:</span><span className="admin__order-info-value"><Mail size={14} strokeWidth={1.5} /> {selectedOrder.customer.email}</span></div>
                <div className="admin__order-info-row"><span className="admin__order-info-label">Phone:</span><span className="admin__order-info-value"><Phone size={14} strokeWidth={1.5} /> {selectedOrder.customer.phone}</span></div>
              </div>

              <div className="admin__order-section">
                <h4 className="admin__order-section-title"><Package size={16} strokeWidth={1.5} /> Order Information</h4>
                <div className="admin__order-info-row"><span className="admin__order-info-label">Order #:</span><span className="admin__order-info-value">{selectedOrder.orderNumber}</span></div>
                <div className="admin__order-info-row"><span className="admin__order-info-label">Date:</span><span className="admin__order-info-value"><Calendar size={14} strokeWidth={1.5} /> {new Date(selectedOrder.date).toLocaleDateString()} at {new Date(selectedOrder.date).toLocaleTimeString()}</span></div>
                <div className="admin__order-info-row"><span className="admin__order-info-label">Total:</span><span className="admin__order-info-value admin__order-info-value--total">${selectedOrder.total.toFixed(2)}</span></div>
                <div className="admin__order-info-row"><span className="admin__order-info-label">Payment:</span><span className="admin__order-info-value">{selectedOrder.paymentMethod}</span></div>
                <div className="admin__order-info-row"><span className="admin__order-info-label">Delivery:</span><span className="admin__order-info-value">{selectedOrder.deliveryMethod}</span></div>
                <div className="admin__order-info-row"><span className="admin__order-info-label">Status:</span><span className={`admin__status ${getStatusColor(selectedOrder.status)}`}>{getStatusIcon(selectedOrder.status)} {getStatusLabel(selectedOrder.status)}</span></div>
              </div>

              <div className="admin__order-section admin__order-section--full">
                <h4 className="admin__order-section-title"><MapPin size={16} strokeWidth={1.5} /> Delivery Address</h4>
                <div className="admin__order-address">
                  <p className="admin__order-address-text">{selectedOrder.customer.address}</p>
                  <p className="admin__order-address-text">{selectedOrder.customer.city}</p>
                  <p className="admin__order-address-text">{selectedOrder.customer.country}</p>
                  {selectedOrder.customer.postalCode && <p className="admin__order-address-text">Postal Code: {selectedOrder.customer.postalCode}</p>}
                  <button className="admin__order-map-btn" onClick={() => openGoogleMaps(fullAddress)}>
                    <ExternalLink size={16} strokeWidth={1.5} /> Open in Google Maps
                  </button>
                </div>
              </div>

              <div className="admin__order-section admin__order-section--full">
                <h4 className="admin__order-section-title"><ShoppingBag size={16} strokeWidth={1.5} /> Items ({selectedOrder.items.length})</h4>
                <div className="admin__order-items">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="admin__order-item">
                      <span className="admin__order-item-name">{item.name}</span>
                      <span className="admin__order-item-qty">Qty: {item.quantity}</span>
                      <span className="admin__order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="admin__modal-footer">
            <button className="admin__modal-btn admin__modal-btn--secondary" onClick={() => setShowOrderModal(false)}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="admin__settings">
      <h3 className="admin__section-title">Store Settings</h3>
      <div className="admin__settings-grid">
        <div className="admin__settings-card">
          <h4 className="admin__settings-card-title">Store Information</h4>
          <div className="admin__settings-field">
            <label>Store Name</label>
            <input type="text" value={settingsForm.storeName} onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })} className="admin__settings-input" />
          </div>
          <div className="admin__settings-field">
            <label>Store Email</label>
            <input type="email" value={settingsForm.storeEmail} onChange={(e) => setSettingsForm({ ...settingsForm, storeEmail: e.target.value })} className="admin__settings-input" />
          </div>
          <div className="admin__settings-field">
            <label>Currency</label>
            <select value={settingsForm.currency} onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })} className="admin__settings-input">
              <option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option><option value="KES">KES (KSh)</option>
            </select>
          </div>
          <button className="admin__settings-save" onClick={handleSettingsSave}><Save size={16} strokeWidth={1.5} /> Save Changes</button>
        </div>
        <div className="admin__settings-card">
          <h4 className="admin__settings-card-title">Shipping Settings</h4>
          <div className="admin__settings-field">
            <label>Free Shipping Threshold ($)</label>
            <input type="number" value={settingsForm.freeShippingThreshold} onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: parseFloat(e.target.value) || 0 })} className="admin__settings-input" />
          </div>
          <div className="admin__settings-field">
            <label>Standard Delivery Cost ($)</label>
            <input type="number" value={settingsForm.standardDeliveryCost} onChange={(e) => setSettingsForm({ ...settingsForm, standardDeliveryCost: parseFloat(e.target.value) || 0 })} className="admin__settings-input" />
          </div>
          <div className="admin__settings-field">
            <label>Express Delivery Cost ($)</label>
            <input type="number" value={settingsForm.expressDeliveryCost} onChange={(e) => setSettingsForm({ ...settingsForm, expressDeliveryCost: parseFloat(e.target.value) || 0 })} className="admin__settings-input" />
          </div>
          <div className="admin__settings-field">
            <label>Same Day Delivery Cost ($)</label>
            <input type="number" value={settingsForm.sameDayDeliveryCost} onChange={(e) => setSettingsForm({ ...settingsForm, sameDayDeliveryCost: parseFloat(e.target.value) || 0 })} className="admin__settings-input" />
          </div>
          <button className="admin__settings-save" onClick={handleSettingsSave}><Save size={16} strokeWidth={1.5} /> Save Changes</button>
        </div>
        <div className="admin__settings-card admin__settings-card--full">
          <h4 className="admin__settings-card-title">Data Management</h4>
          <div className="admin__settings-actions">
            <button className="admin__settings-action" onClick={handleResetProducts}><RefreshCw size={16} strokeWidth={1.5} /> Reset Products</button>
            <button className="admin__settings-action admin__settings-action--danger" onClick={handleDeleteAllOrders}><Trash2 size={16} strokeWidth={1.5} /> Delete All Orders</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddProductModal = () => (
    <div className="admin__modal-overlay" onClick={() => { setShowAddProductModal(false); setEditingProduct(null); }}>
      <div className="admin__modal admin__modal--large" onClick={(e) => e.stopPropagation()}>
        <div className="admin__modal-header">
          <h3 className="admin__modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="admin__modal-close" onClick={() => { setShowAddProductModal(false); setEditingProduct(null); }}><X size={20} strokeWidth={1.5} /></button>
        </div>
        <div className="admin__modal-body">
          <div className="admin__form-grid">
            <div className="admin__form-group"><label>Product Name</label><input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="admin__form-input" placeholder="Product name" /></div>
            <div className="admin__form-group"><label>Category</label><input type="text" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="admin__form-input" placeholder="e.g. Electronics" /></div>
            <div className="admin__form-group"><label>Price ($)</label><input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })} className="admin__form-input" placeholder="0.00" step="0.01" /></div>
            <div className="admin__form-group"><label>Original Price ($) (Optional)</label><input type="number" value={productForm.originalPrice} onChange={(e) => setProductForm({ ...productForm, originalPrice: parseFloat(e.target.value) || 0 })} className="admin__form-input" placeholder="0.00" step="0.01" /></div>
            <div className="admin__form-group admin__form-group--full"><label>Description</label><textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="admin__form-textarea" placeholder="Product description" rows={3} /></div>
            <div className="admin__form-group admin__form-group--full"><label>Features (comma separated)</label><input type="text" value={productForm.features} onChange={(e) => setProductForm({ ...productForm, features: e.target.value })} className="admin__form-input" placeholder="e.g. Feature 1, Feature 2, Feature 3" /></div>
            <div className="admin__form-group admin__form-group--full"><label>Image URL</label><input type="text" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} className="admin__form-input" placeholder="https://images.unsplash.com/..." /></div>
            <div className="admin__form-group"><label>In Stock</label><select value={productForm.inStock ? 'true' : 'false'} onChange={(e) => setProductForm({ ...productForm, inStock: e.target.value === 'true' })} className="admin__form-input"><option value="true">Yes</option><option value="false">No</option></select></div>
          </div>
        </div>
        <div className="admin__modal-footer">
          <button className="admin__modal-btn admin__modal-btn--secondary" onClick={() => { setShowAddProductModal(false); setEditingProduct(null); }}>Cancel</button>
          <button className="admin__modal-btn admin__modal-btn--primary" onClick={editingProduct ? handleUpdateProduct : handleAddProduct}><Save size={16} strokeWidth={1.5} /> {editingProduct ? 'Update Product' : 'Add Product'}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="admin-page__container">
        <header className="admin__header">
          <div className="admin__header-left">
            <div className="admin__brand">
              <div className="admin__brand-icon">
                <Shield size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="admin__brand-name">ShopVerse</h1>
                <span className="admin__brand-sub">Admin Panel</span>
              </div>
            </div>
          </div>

          <div className="admin__header-center">
            <form className="admin__header-search" onSubmit={handleGlobalSearch}>
              <Search size={18} strokeWidth={1.5} className="admin__header-search-icon" />
              <input
                type="text"
                placeholder="Search orders, products, customers..."
                className="admin__header-search-input"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
              />
              <span className="admin__header-search-shortcut">⌘K</span>
            </form>
          </div>

          <div className="admin__header-right">
            <div className="admin__header-btn-wrapper">
              <button className="admin__header-btn admin__header-btn--notifications" onClick={handleNotificationClick}>
                <Bell size={20} strokeWidth={1.5} />
                {unreadCount > 0 && <span className="admin__header-badge">{unreadCount}</span>}
              </button>
              {isNotificationsOpen && (
                <div className="admin__header-dropdown admin__header-dropdown--notifications">
                  <div className="admin__header-dropdown-header">
                    <span className="admin__header-dropdown-title">Notifications</span>
                    {notifications.length > 0 && (
                      <button className="admin__header-dropdown-clear" onClick={clearAllNotifications}>Clear all</button>
                    )}
                  </div>
                  {notifications.length > 0 ? (
                    <div className="admin__header-dropdown-list">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="admin__header-dropdown-item">
                          <div className={`admin__header-dropdown-dot admin__header-dropdown-dot--${notification.type}`}></div>
                          <span>{notification.message}</span>
                          <button className="admin__header-dropdown-close" onClick={() => removeNotification(notification.id)}>
                            <X size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="admin__header-dropdown-empty">No notifications</div>
                  )}
                </div>
              )}
            </div>

            <button className="admin__header-btn" onClick={handleManualRefresh} disabled={isRefreshing}>
              <RotateCw size={20} strokeWidth={1.5} className={isRefreshing ? 'admin__refresh-spin' : ''} />
            </button>

            <div className="admin__header-profile-wrapper">
              <div className="admin__header-profile" onClick={handleProfileToggle}>
                <div className="admin__header-avatar">
                  <span>{user?.name?.charAt(0) || 'A'}</span>
                </div>
                <div className="admin__header-profile-info">
                  <span className="admin__header-profile-name">{user?.name || 'Admin'}</span>
                  <span className="admin__header-profile-role">{user?.role || 'Administrator'}</span>
                </div>
                <ChevronDown size={16} strokeWidth={1.5} className={`admin__header-profile-arrow ${isProfileOpen ? 'admin__header-profile-arrow--open' : ''}`} />
              </div>

              {isProfileOpen && (
                <div className="admin__header-dropdown">
                  <div className="admin__header-dropdown-item" onClick={() => { setIsProfileOpen(false); navigate('/admin/dashboard'); }}>
                    <LayoutDashboard size={16} strokeWidth={1.5} /> Dashboard
                  </div>
                  <div className="admin__header-dropdown-item" onClick={() => { setIsProfileOpen(false); setActiveTab('settings'); }}>
                    <User size={16} strokeWidth={1.5} /> My Profile
                  </div>
                  <div className="admin__header-dropdown-item" onClick={() => { setIsProfileOpen(false); setActiveTab('settings'); }}>
                    <Settings size={16} strokeWidth={1.5} /> Settings
                  </div>
                  <div className="admin__header-dropdown-item">
                    <HelpCircle size={16} strokeWidth={1.5} /> Help & Support
                  </div>
                  <div className="admin__header-dropdown-divider"></div>
                  <div className="admin__header-dropdown-item admin__header-dropdown-item--danger" onClick={handleLogout}>
                    <LogOut size={16} strokeWidth={1.5} /> Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="admin__notifications">
          {notifications.slice(0, 3).map((notification) => (
            <div key={notification.id} className={`admin__notification admin__notification--${notification.type}`}>
              {notification.type === 'success' && <CheckCircle size={18} strokeWidth={2} />}
              {notification.type === 'error' && <AlertCircle size={18} strokeWidth={2} />}
              {notification.type === 'info' && <AlertCircle size={18} strokeWidth={2} />}
              <span className="admin__notification-text">{notification.message}</span>
              <button className="admin__notification-close" onClick={() => removeNotification(notification.id)}><X size={16} strokeWidth={2} /></button>
            </div>
          ))}
        </div>

        <div className="admin__tabs">
          <button className={`admin__tab ${activeTab === 'dashboard' ? 'admin__tab--active' : ''}`} onClick={() => setActiveTab('dashboard')}><LayoutDashboard size={18} strokeWidth={1.5} /> Dashboard</button>
          <button className={`admin__tab ${activeTab === 'products' ? 'admin__tab--active' : ''}`} onClick={() => setActiveTab('products')}><Box size={18} strokeWidth={1.5} /> Products</button>
          <button className={`admin__tab ${activeTab === 'orders' ? 'admin__tab--active' : ''}`} onClick={() => setActiveTab('orders')}><ShoppingBag size={18} strokeWidth={1.5} /> Orders</button>
          <button className={`admin__tab ${activeTab === 'customers' ? 'admin__tab--active' : ''}`} onClick={() => setActiveTab('customers')}><Users size={18} strokeWidth={1.5} /> Customers</button>
          <button className={`admin__tab ${activeTab === 'settings' ? 'admin__tab--active' : ''}`} onClick={() => setActiveTab('settings')}><Settings size={18} strokeWidth={1.5} /> Settings</button>
          <button className={`admin__tab ${activeTab === 'homepage' ? 'admin__tab--active' : ''}`} onClick={() => setActiveTab('homepage')}><Home size={18} strokeWidth={1.5} /> Homepage</button>
        </div>

        <div className="admin__content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'homepage' && renderHomepageSettings()}
        </div>
      </div>

      {showOrderModal && renderOrderDetailsModal()}
      {showAddProductModal && renderAddProductModal()}
    </div>
  );
};

export default AdminDashboard;
