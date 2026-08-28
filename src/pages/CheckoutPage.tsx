import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronRight, 
  Check, 
  Truck, 
  Clock, 
  CreditCard, 
  Smartphone,
  Lock,
  X,
  MapPin,
  User,
  Mail,
  Phone,
  Building,
  Globe,
  AlertCircle,
  Navigation,
  ExternalLink
} from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import './CheckoutPage.css';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  deliveryInstructions: string;
  landmark: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartContext();
  const { settings } = useAdmin();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'Kenya',
    postalCode: '',
    deliveryInstructions: '',
    landmark: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedDelivery, setSelectedDelivery] = useState<string>('standard');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);

  const currency = settings?.currency || 'USD';

  const deliveryOptions: DeliveryOption[] = [
    { id: 'standard', name: 'Standard Delivery', description: 'Reliable delivery to your doorstep', price: settings?.standardDeliveryCost || 5, estimatedDays: '2-4 business days' },
    { id: 'express', name: 'Express Delivery', description: 'Priority handling and faster delivery', price: settings?.expressDeliveryCost || 15, estimatedDays: '1-2 business days' },
    { id: 'same-day', name: 'Same-Day Delivery', description: 'Order today, delivered today', price: settings?.sameDayDeliveryCost || 25, estimatedDays: 'Same day' },
  ];

  const paymentMethods: PaymentMethod[] = [
    { id: 'mpesa', name: 'M-Pesa', icon: <Smartphone size={20} /> },
    { id: 'visa', name: 'Visa / Mastercard', icon: <CreditCard size={20} /> },
    { id: 'bank', name: 'Bank Transfer', icon: <Building size={20} /> },
    { id: 'cod', name: 'Cash on Delivery', icon: <Truck size={20} /> },
  ];

  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [items, navigate, orderComplete]);

  const subtotal = getTotalPrice();
  const deliveryCost = deliveryOptions.find(d => d.id === selectedDelivery)?.price || 0;
  const freeShippingThreshold = settings?.freeShippingThreshold || 50;
  const finalDeliveryCost = subtotal >= freeShippingThreshold ? 0 : deliveryCost;
  const total = subtotal + finalDeliveryCost - discount;

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (step >= 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
        isValid = false;
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
        isValid = false;
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
        isValid = false;
      }
    }

    if (step >= 2) {
      if (!formData.address.trim()) {
        newErrors.address = 'Delivery address is required';
        isValid = false;
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
        isValid = false;
      }
      if (!formData.country.trim()) {
        newErrors.country = 'Country is required';
        isValid = false;
      }
      if (!formData.postalCode.trim()) {
        newErrors.postalCode = 'Postal code is required';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SAVE20') {
      setDiscount(subtotal * 0.2);
      setPromoApplied(true);
    } else if (promoCode.trim().toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.1);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try SAVE20 or SAVE10');
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setDiscount(0);
  };

  const generateOrderNumber = () => {
    return 'ORD-' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(2, 5).toUpperCase();
  };

  const saveOrder = (orderData: any) => {
    const existingOrders = localStorage.getItem('orders');
    let orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.unshift(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
  };

  const handlePlaceOrder = async () => {
    if (!selectedDelivery) {
      alert('Please select a delivery method');
      return;
    }
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderNum = generateOrderNumber();
      setOrderNumber(orderNum);
      
      const orderData = {
        id: Date.now().toString(),
        orderNumber: orderNum,
        date: new Date().toISOString(),
        total: total,
        status: 'pending',
        paymentMethod: paymentMethods.find(p => p.id === selectedPayment)?.name || '',
        deliveryMethod: deliveryOptions.find(d => d.id === selectedDelivery)?.name || '',
        estimatedDelivery: deliveryOptions.find(d => d.id === selectedDelivery)?.estimatedDays || '',
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
          landmark: formData.landmark,
          deliveryInstructions: formData.deliveryInstructions
        },
        trackingHistory: [
          {
            date: new Date().toISOString(),
            status: 'Order Placed',
            description: 'Your order has been confirmed and is being processed.',
            location: formData.city + ', ' + formData.country
          }
        ]
      };
      
      saveOrder(orderData);
      setOrderComplete(true);
      clearCart();
    } catch {
      alert('Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openGoogleMaps = () => {
    const query = encodeURIComponent(`${formData.address}, ${formData.city}, ${formData.country}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  };

  const handleAutoFillLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    setLocationSuccess(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          let address = '';
          let addressLine2 = '';
          let city = '';
          let state = '';
          let country = '';
          let postalCode = '';
          let landmark = '';
          
          if (data) {
            const houseNumber = data.houseNumber || '';
            const street = data.street || '';
            const locality = data.locality || '';
            const cityData = data.city || data.principalSubdivision || locality;
            const stateData = data.principalSubdivision || data.region || '';
            const countryData = data.countryName || data.country || 'Kenya';
            const postcode = data.postcode || '';
            const neighbourhood = data.neighbourhood || data.suburb || '';
            
            let fullAddress = '';
            if (houseNumber && street) {
              fullAddress = `${houseNumber} ${street}`;
            } else if (street) {
              fullAddress = street;
            } else if (cityData) {
              fullAddress = cityData;
            } else {
              fullAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            }
            
            let finalPostalCode = postcode;
            if (!finalPostalCode || finalPostalCode === '') {
              try {
                const postalResponse = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`
                );
                const postalData = await postalResponse.json();
                if (postalData && postalData.address && postalData.address.postcode) {
                  finalPostalCode = postalData.address.postcode;
                }
              } catch {
                // Silently fail
              }
            }
            
            address = fullAddress;
            addressLine2 = neighbourhood || '';
            city = cityData || 'Nairobi';
            state = stateData || '';
            country = countryData;
            postalCode = finalPostalCode || '00100';
            landmark = neighbourhood || locality || '';
          }
          
          setFormData(prev => ({
            ...prev,
            address: address || prev.address,
            addressLine2: addressLine2 || prev.addressLine2,
            city: city || prev.city,
            state: state || prev.state,
            country: country || prev.country,
            postalCode: postalCode || prev.postalCode,
            landmark: landmark || prev.landmark,
          }));
          
          setLocationSuccess(`Location detected: ${city}, ${country}`);
          setTimeout(() => setLocationSuccess(null), 6000);
          setLocationError(null);
        } catch {
          const lat = latitude.toFixed(6);
          const lng = longitude.toFixed(6);
          setFormData(prev => ({
            ...prev,
            address: `${lat}, ${lng}`,
            city: prev.city || 'Nairobi',
            country: prev.country || 'Kenya',
            postalCode: prev.postalCode || '00100',
          }));
          setLocationSuccess(`Location detected: ${lat}, ${lng}`);
          setTimeout(() => setLocationSuccess(null), 6000);
        }
        
        setIsLocating(false);
      },
      (err) => {
        let errorMessage = 'Unable to access location. ';
        if (err.code === 1) {
          errorMessage += 'Please enable location services in your browser.';
        } else if (err.code === 2) {
          errorMessage += 'Location unavailable. Please try again.';
        } else if (err.code === 3) {
          errorMessage += 'Request timed out. Please try again.';
        } else {
          errorMessage += 'Please enable location services.';
        }
        setLocationError(errorMessage);
        setIsLocating(false);
        setTimeout(() => setLocationError(null), 6000);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  if (orderComplete) {
    return (
      <div className="checkout-page">
        <div className="checkout-page__container">
          <div className="checkout-page__confirmation">
            <div className="checkout-page__confirmation-icon">
              <Check size={48} strokeWidth={2} />
            </div>
            <h1 className="checkout-page__confirmation-title">Order Confirmed!</h1>
            <p className="checkout-page__confirmation-order">Order #{orderNumber}</p>
            <p className="checkout-page__confirmation-text">
              Your order has been successfully placed. You will receive a confirmation email shortly.
            </p>
            <div className="checkout-page__confirmation-details">
              <div className="checkout-page__confirmation-detail">
                <span className="checkout-page__confirmation-detail-label">Estimated Delivery</span>
                <span className="checkout-page__confirmation-detail-value">
                  {deliveryOptions.find(d => d.id === selectedDelivery)?.estimatedDays}
                </span>
              </div>
              <div className="checkout-page__confirmation-detail">
                <span className="checkout-page__confirmation-detail-label">Payment Method</span>
                <span className="checkout-page__confirmation-detail-value">
                  {paymentMethods.find(p => p.id === selectedPayment)?.name}
                </span>
              </div>
              <div className="checkout-page__confirmation-detail">
                <span className="checkout-page__confirmation-detail-label">Total</span>
                <span className="checkout-page__confirmation-detail-value">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="checkout-page__confirmation-actions">
              <Link to="/track-order" className="checkout-page__confirmation-btn checkout-page__confirmation-btn--track">
                Track Order
              </Link>
              <Link to="/" className="checkout-page__confirmation-btn">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-page__container">
        <Link to="/cart" className="checkout-page__back">
          <ArrowLeft size={18} strokeWidth={1.5} />
          Back to Cart
        </Link>

        <div className="checkout-page__progress">
          <div className="checkout-page__progress-step">
            <span className={`checkout-page__progress-number ${currentStep >= 1 ? 'checkout-page__progress-number--active' : ''}`}>1</span>
            <span className="checkout-page__progress-label">Cart</span>
          </div>
          <div className="checkout-page__progress-line"></div>
          <div className="checkout-page__progress-step">
            <span className={`checkout-page__progress-number ${currentStep >= 2 ? 'checkout-page__progress-number--active' : ''}`}>2</span>
            <span className="checkout-page__progress-label">Checkout</span>
          </div>
          <div className="checkout-page__progress-line"></div>
          <div className="checkout-page__progress-step">
            <span className={`checkout-page__progress-number ${currentStep >= 3 ? 'checkout-page__progress-number--active' : ''}`}>3</span>
            <span className="checkout-page__progress-label">Payment</span>
          </div>
          <div className="checkout-page__progress-line"></div>
          <div className="checkout-page__progress-step">
            <span className={`checkout-page__progress-number ${currentStep >= 4 ? 'checkout-page__progress-number--active' : ''}`}>4</span>
            <span className="checkout-page__progress-label">Confirmation</span>
          </div>
        </div>

        <div className="checkout-page__grid">
          <div className="checkout-page__form">
            {currentStep === 1 && (
              <div className="checkout-page__section">
                <h2 className="checkout-page__section-title">Contact Information</h2>
                <div className="checkout-page__form-group">
                  <label className="checkout-page__form-label">Full Name</label>
                  <div className="checkout-page__form-input-wrapper">
                    <User size={18} className="checkout-page__form-icon" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`checkout-page__form-input ${errors.fullName ? 'checkout-page__form-input--error' : ''}`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && <span className="checkout-page__form-error">{errors.fullName}</span>}
                </div>

                <div className="checkout-page__form-group">
                  <label className="checkout-page__form-label">Email Address</label>
                  <div className="checkout-page__form-input-wrapper">
                    <Mail size={18} className="checkout-page__form-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`checkout-page__form-input ${errors.email ? 'checkout-page__form-input--error' : ''}`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && <span className="checkout-page__form-error">{errors.email}</span>}
                </div>

                <div className="checkout-page__form-group">
                  <label className="checkout-page__form-label">Phone Number</label>
                  <div className="checkout-page__form-input-wrapper">
                    <Phone size={18} className="checkout-page__form-icon" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`checkout-page__form-input ${errors.phone ? 'checkout-page__form-input--error' : ''}`}
                      placeholder="+254 700 000 000"
                    />
                  </div>
                  {errors.phone && <span className="checkout-page__form-error">{errors.phone}</span>}
                </div>

                <button className="checkout-page__next-btn" onClick={handleNextStep}>
                  Continue to Delivery <ChevronRight size={18} />
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="checkout-page__section">
                <h2 className="checkout-page__section-title">Delivery Address</h2>
                
                <div className="checkout-page__location-actions">
                  <button 
                    className="checkout-page__auto-location-btn"
                    onClick={handleAutoFillLocation}
                    disabled={isLocating}
                  >
                    <Navigation size={18} strokeWidth={1.5} />
                    {isLocating ? 'Detecting GPS location...' : 'Auto-fill location'}
                  </button>
                  
                  <button 
                    className="checkout-page__map-btn"
                    onClick={openGoogleMaps}
                  >
                    <ExternalLink size={18} strokeWidth={1.5} />
                    Open Google Maps
                  </button>
                </div>
                
                {locationError && (
                  <div className="checkout-page__location-error">
                    <AlertCircle size={16} strokeWidth={1.5} />
                    {locationError}
                  </div>
                )}
                
                {locationSuccess && (
                  <div className="checkout-page__location-success">
                    <Check size={16} strokeWidth={2} />
                    {locationSuccess}
                  </div>
                )}

                <div className="checkout-page__form-group">
                  <label className="checkout-page__form-label">Street Address</label>
                  <div className="checkout-page__form-input-wrapper">
                    <MapPin size={18} className="checkout-page__form-icon" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`checkout-page__form-input ${errors.address ? 'checkout-page__form-input--error' : ''}`}
                      placeholder="123 Main Street"
                    />
                  </div>
                  {errors.address && <span className="checkout-page__form-error">{errors.address}</span>}
                </div>

                <div className="checkout-page__form-group">
                  <label className="checkout-page__form-label">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    className="checkout-page__form-input"
                    placeholder="Apartment, suite, building"
                  />
                </div>

                <div className="checkout-page__form-row">
                  <div className="checkout-page__form-group">
                    <label className="checkout-page__form-label">City/Town</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`checkout-page__form-input ${errors.city ? 'checkout-page__form-input--error' : ''}`}
                      placeholder="Nairobi"
                    />
                    {errors.city && <span className="checkout-page__form-error">{errors.city}</span>}
                  </div>
                  <div className="checkout-page__form-group">
                    <label className="checkout-page__form-label">State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="checkout-page__form-input"
                      placeholder="Nairobi County"
                    />
                  </div>
                </div>

                <div className="checkout-page__form-row">
                  <div className="checkout-page__form-group">
                    <label className="checkout-page__form-label">Postal/ZIP Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`checkout-page__form-input ${errors.postalCode ? 'checkout-page__form-input--error' : ''}`}
                      placeholder="00100"
                    />
                    {errors.postalCode && <span className="checkout-page__form-error">{errors.postalCode}</span>}
                  </div>
                  <div className="checkout-page__form-group">
                    <label className="checkout-page__form-label">Country</label>
                    <div className="checkout-page__form-input-wrapper">
                      <Globe size={18} className="checkout-page__form-icon" />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`checkout-page__form-input ${errors.country ? 'checkout-page__form-input--error' : ''}`}
                      >
                        <option value="Kenya">Kenya</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="South Africa">South Africa</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                    {errors.country && <span className="checkout-page__form-error">{errors.country}</span>}
                  </div>
                </div>

                <div className="checkout-page__form-group">
                  <label className="checkout-page__form-label">Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="checkout-page__form-input"
                    placeholder="Near the mall, opposite the church"
                  />
                </div>

                <div className="checkout-page__form-group">
                  <label className="checkout-page__form-label">Delivery Instructions (Optional)</label>
                  <textarea
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    className="checkout-page__form-textarea"
                    placeholder="Gate code, landmark, or special instructions"
                    rows={2}
                  />
                </div>

                <div className="checkout-page__form-actions">
                  <button className="checkout-page__back-btn" onClick={handlePrevStep}>
                    Back
                  </button>
                  <button className="checkout-page__next-btn" onClick={handleNextStep}>
                    Continue to Payment <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="checkout-page__section">
                <h2 className="checkout-page__section-title">Delivery & Payment</h2>

                <div className="checkout-page__delivery-options">
                  <h3 className="checkout-page__subtitle">Delivery Method</h3>
                  {deliveryOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`checkout-page__delivery-option ${selectedDelivery === option.id ? 'checkout-page__delivery-option--selected' : ''}`}
                      onClick={() => setSelectedDelivery(option.id)}
                    >
                      <div className="checkout-page__delivery-option-left">
                        <Truck size={20} strokeWidth={1.5} />
                        <div>
                          <span className="checkout-page__delivery-option-name">{option.name}</span>
                          <span className="checkout-page__delivery-option-desc">{option.description}</span>
                          <span className="checkout-page__delivery-option-time">
                            <Clock size={14} strokeWidth={1.5} />
                            {option.estimatedDays}
                          </span>
                        </div>
                      </div>
                      <span className="checkout-page__delivery-option-price">
                        {subtotal >= (settings?.freeShippingThreshold || 50) ? 'Free' : `${currency}${option.price.toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="checkout-page__payment-methods">
                  <h3 className="checkout-page__subtitle">Payment Method</h3>
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`checkout-page__payment-method ${selectedPayment === method.id ? 'checkout-page__payment-method--selected' : ''}`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      {method.icon}
                      <span className="checkout-page__payment-method-name">{method.name}</span>
                      {selectedPayment === method.id && <Check size={16} className="checkout-page__payment-method-check" />}
                    </div>
                  ))}
                </div>

                <div className="checkout-page__promo">
                  <h3 className="checkout-page__subtitle">Have a promo code?</h3>
                  <div className="checkout-page__promo-input">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="checkout-page__promo-field"
                      disabled={promoApplied}
                    />
                    {!promoApplied ? (
                      <button className="checkout-page__promo-btn" onClick={handleApplyPromo}>
                        Apply
                      </button>
                    ) : (
                      <button className="checkout-page__promo-btn checkout-page__promo-btn--remove" onClick={handleRemovePromo}>
                        <X size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                  {promoApplied && (
                    <div className="checkout-page__promo-success">
                      <Check size={16} strokeWidth={2} />
                      Promo code applied! ${discount.toFixed(2)} off
                    </div>
                  )}
                </div>

                <div className="checkout-page__secure">
                  <Lock size={16} strokeWidth={1.5} />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                <div className="checkout-page__form-actions">
                  <button className="checkout-page__back-btn" onClick={handlePrevStep}>
                    Back
                  </button>
                  <button 
                    className="checkout-page__place-order-btn" 
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting || !selectedDelivery || !selectedPayment}
                  >
                    {isSubmitting ? 'Processing...' : `Pay ${currency}${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-page__summary">
            <h3 className="checkout-page__summary-title">Order Summary</h3>
            <div className="checkout-page__summary-items">
              {items.map((item) => (
                <div key={item.id} className="checkout-page__summary-item">
                  <img src={item.image} alt={item.name} className="checkout-page__summary-item-image" />
                  <div className="checkout-page__summary-item-details">
                    <span className="checkout-page__summary-item-name">{item.name}</span>
                    <span className="checkout-page__summary-item-qty">Qty: {item.quantity}</span>
                    <span className="checkout-page__summary-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-page__summary-totals">
              <div className="checkout-page__summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-page__summary-row">
                <span>Delivery</span>
                <span>{subtotal >= (settings?.freeShippingThreshold || 50) ? 'Free' : `$${deliveryCost.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="checkout-page__summary-row checkout-page__summary-row--discount">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="checkout-page__summary-divider"></div>
              <div className="checkout-page__summary-row checkout-page__summary-row--total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="checkout-page__summary-policies">
              <Link to="/returns">Shipping Policy</Link>
              <Link to="/returns">Returns & Refunds</Link>
              <Link to="/about">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
