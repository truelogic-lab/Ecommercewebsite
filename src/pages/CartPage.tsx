import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import './CartPage.css';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartContext();

  const handleProceedToCheckout = () => {
    if (items.length > 0) {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page__container">
          <h1 className="cart-page__title">Your Cart</h1>
          <div className="cart-page__empty">
            <p className="cart-page__empty-text">Your cart is empty.</p>
            <Link to="/" className="cart-page__empty-btn">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        <h1 className="cart-page__title">Your Cart</h1>
        <div className="cart-page__grid">
          <div className="cart-page__items">
            {items.map((item) => (
              <div key={item.id} className="cart-page__item">
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center'} 
                  alt={item.name}
                  className="cart-page__item-image"
                />
                <div className="cart-page__item-details">
                  <h3 className="cart-page__item-name">{item.name}</h3>
                  <p className="cart-page__item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="cart-page__item-actions">
                  <div className="cart-page__item-quantity">
                    <button 
                      className="cart-page__qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="cart-page__qty-value">{item.quantity}</span>
                    <button 
                      className="cart-page__qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="cart-page__remove-btn"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-page__summary">
            <h2 className="cart-page__summary-title">Order Summary</h2>
            <div className="cart-page__summary-row">
              <span>Subtotal</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="cart-page__summary-row">
              <span>Shipping</span>
              <span>{getTotalPrice() > 50 ? 'Free' : '$5.00'}</span>
            </div>
            <div className="cart-page__summary-divider"></div>
            <div className="cart-page__summary-row cart-page__summary-total">
              <span>Total</span>
              <span>${(getTotalPrice() + (getTotalPrice() > 50 ? 0 : 5)).toFixed(2)}</span>
            </div>
            <button 
              className="cart-page__checkout-btn" 
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
            <button className="cart-page__clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
            <Link to="/" className="cart-page__continue-link">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
