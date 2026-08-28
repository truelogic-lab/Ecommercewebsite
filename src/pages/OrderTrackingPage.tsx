import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  Search, 
  X,
  ShoppingBag,
  Box
} from 'lucide-react';
import './OrderTrackingPage.css';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  deliveryMethod: string;
  estimatedDelivery: string;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  trackingHistory: {
    date: string;
    status: string;
    description: string;
    location?: string;
  }[];
}

interface StoredOrder extends Order {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export const OrderTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      try {
        const parsed = JSON.parse(storedOrders);
        setOrders(parsed);
        if (parsed.length > 0) {
          setSelectedOrder(parsed[0]);
        }
      } catch {
        setOrders([]);
      }
    }
    setIsLoading(false);
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 4000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showNotification('error', 'Please enter an order number');
      return;
    }
    
    const found = orders.find(order => 
      order.orderNumber.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    
    if (found) {
      setSelectedOrder(found);
      showNotification('success', `Order ${found.orderNumber} found`);
      setSearchQuery('');
    } else {
      showNotification('error', 'Order not found. Please check your order number.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} strokeWidth={1.5} />;
      case 'processing':
        return <Package size={20} strokeWidth={1.5} />;
      case 'shipped':
        return <Truck size={20} strokeWidth={1.5} />;
      case 'delivered':
        return <CheckCircle size={20} strokeWidth={1.5} />;
      case 'cancelled':
        return <X size={20} strokeWidth={1.5} />;
      default:
        return <Package size={20} strokeWidth={1.5} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'order-tracking-page__status--pending';
      case 'processing':
        return 'order-tracking-page__status--processing';
      case 'shipped':
        return 'order-tracking-page__status--shipped';
      case 'delivered':
        return 'order-tracking-page__status--delivered';
      case 'cancelled':
        return 'order-tracking-page__status--cancelled';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (isLoading) {
    return (
      <div className="order-tracking-page">
        <div className="order-tracking-page__container">
          <div className="order-tracking-page__loading">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking-page">
      <div className="order-tracking-page__container">
        <Link to="/" className="order-tracking-page__back">
          <ArrowLeft size={18} strokeWidth={1.5} />
          Back to Shop
        </Link>

        <div className="order-tracking-page__header">
          <div className="order-tracking-page__header-left">
            <h1 className="order-tracking-page__title">Track Your Orders</h1>
            <p className="order-tracking-page__subtitle">View and track all your orders in one place</p>
          </div>
          <Package size={40} strokeWidth={1.5} className="order-tracking-page__header-icon" />
        </div>

        {notification.type && (
          <div className={`order-tracking-page__notification order-tracking-page__notification--${notification.type}`}>
            {notification.type === 'success' ? (
              <CheckCircle size={18} strokeWidth={2} />
            ) : (
              <X size={18} strokeWidth={2} />
            )}
            <span className="order-tracking-page__notification-text">{notification.message}</span>
            <button 
              className="order-tracking-page__notification-close"
              onClick={() => setNotification({ type: null, message: '' })}
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="order-tracking-page__empty">
            <Package size={48} strokeWidth={1.5} className="order-tracking-page__empty-icon" />
            <h3 className="order-tracking-page__empty-title">No Orders Yet</h3>
            <p className="order-tracking-page__empty-text">You haven't placed any orders yet. Start shopping today!</p>
            <Link to="/collection" className="order-tracking-page__empty-btn">Browse Products</Link>
          </div>
        ) : (
          <div className="order-tracking-page__grid">
            <div className="order-tracking-page__search">
              <form onSubmit={handleSearch} className="order-tracking-page__search-form">
                <div className="order-tracking-page__search-wrapper">
                  <Search size={18} strokeWidth={1.5} className="order-tracking-page__search-icon" />
                  <input
                    type="text"
                    placeholder="Search by order number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="order-tracking-page__search-input"
                  />
                </div>
                <button type="submit" className="order-tracking-page__search-btn">Search</button>
              </form>
            </div>

            <div className="order-tracking-page__sidebar">
              <h3 className="order-tracking-page__sidebar-title">Your Orders</h3>
              <div className="order-tracking-page__order-list">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className={`order-tracking-page__order-item ${selectedOrder?.id === order.id ? 'order-tracking-page__order-item--active' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="order-tracking-page__order-item-header">
                      <span className="order-tracking-page__order-item-number">{order.orderNumber}</span>
                      <span className={`order-tracking-page__order-item-status ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="order-tracking-page__order-item-date">
                      <Calendar size={14} strokeWidth={1.5} />
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                    <div className="order-tracking-page__order-item-total">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-tracking-page__details">
              {selectedOrder ? (
                <>
                  <div className="order-tracking-page__details-header">
                    <div>
                      <h2 className="order-tracking-page__details-number">{selectedOrder.orderNumber}</h2>
                      <p className="order-tracking-page__details-date">
                        Placed on {new Date(selectedOrder.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`order-tracking-page__details-status ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>

                  <div className="order-tracking-page__details-section">
                    <h4 className="order-tracking-page__details-section-title">Order Summary</h4>
                    <div className="order-tracking-page__details-summary">
                      <div className="order-tracking-page__details-summary-item">
                        <span className="order-tracking-page__details-summary-label">Total</span>
                        <span className="order-tracking-page__details-summary-value">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                      <div className="order-tracking-page__details-summary-item">
                        <span className="order-tracking-page__details-summary-label">Payment Method</span>
                        <span className="order-tracking-page__details-summary-value">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="order-tracking-page__details-summary-item">
                        <span className="order-tracking-page__details-summary-label">Delivery Method</span>
                        <span className="order-tracking-page__details-summary-value">{selectedOrder.deliveryMethod}</span>
                      </div>
                      <div className="order-tracking-page__details-summary-item">
                        <span className="order-tracking-page__details-summary-label">Estimated Delivery</span>
                        <span className="order-tracking-page__details-summary-value">{selectedOrder.estimatedDelivery}</span>
                      </div>
                    </div>
                  </div>

                  <div className="order-tracking-page__details-section">
                    <h4 className="order-tracking-page__details-section-title">Tracking History</h4>
                    <div className="order-tracking-page__tracking-timeline">
                      {selectedOrder.trackingHistory.map((event, index) => (
                        <div key={index} className="order-tracking-page__tracking-event">
                          <div className="order-tracking-page__tracking-event-dot"></div>
                          {index < selectedOrder.trackingHistory.length - 1 && (
                            <div className="order-tracking-page__tracking-event-line"></div>
                          )}
                          <div className="order-tracking-page__tracking-event-content">
                            <span className="order-tracking-page__tracking-event-status">{event.status}</span>
                            <span className="order-tracking-page__tracking-event-desc">{event.description}</span>
                            {event.location && (
                              <span className="order-tracking-page__tracking-event-location">
                                <MapPin size={14} strokeWidth={1.5} />
                                {event.location}
                              </span>
                            )}
                            <span className="order-tracking-page__tracking-event-date">
                              {new Date(event.date).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-tracking-page__details-section">
                    <h4 className="order-tracking-page__details-section-title">Items</h4>
                    <div className="order-tracking-page__details-items">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="order-tracking-page__details-item">
                          <img src={item.image} alt={item.name} className="order-tracking-page__details-item-image" />
                          <div className="order-tracking-page__details-item-info">
                            <span className="order-tracking-page__details-item-name">{item.name}</span>
                            <span className="order-tracking-page__details-item-qty">Qty: {item.quantity}</span>
                          </div>
                          <span className="order-tracking-page__details-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-tracking-page__details-section">
                    <h4 className="order-tracking-page__details-section-title">Delivery Address</h4>
                    <div className="order-tracking-page__details-address">
                      <p className="order-tracking-page__details-address-name">
                        <User size={14} strokeWidth={1.5} />
                        {selectedOrder.customer.name}
                      </p>
                      <p className="order-tracking-page__details-address-text">{selectedOrder.customer.address}</p>
                      <p className="order-tracking-page__details-address-text">
                        {selectedOrder.customer.city}, {selectedOrder.customer.country} {selectedOrder.customer.postalCode}
                      </p>
                      <p className="order-tracking-page__details-address-contact">
                        <Phone size={14} strokeWidth={1.5} />
                        {selectedOrder.customer.phone}
                      </p>
                      <p className="order-tracking-page__details-address-contact">
                        <Mail size={14} strokeWidth={1.5} />
                        {selectedOrder.customer.email}
                      </p>
                    </div>
                  </div>

                  <div className="order-tracking-page__details-actions">
                    <Link to="/collection" className="order-tracking-page__details-btn">
                      Continue Shopping
                    </Link>
                    <button 
                      className="order-tracking-page__details-btn order-tracking-page__details-btn--secondary"
                      onClick={() => {
                        const updatedOrders = orders.filter(o => o.id !== selectedOrder.id);
                        setOrders(updatedOrders);
                        localStorage.setItem('orders', JSON.stringify(updatedOrders));
                        setSelectedOrder(updatedOrders[0] || null);
                        showNotification('success', 'Order removed successfully');
                      }}
                    >
                      Remove Order
                    </button>
                  </div>
                </>
              ) : (
                <div className="order-tracking-page__no-selection">
                  <Box size={32} strokeWidth={1.5} />
                  <p>Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
