import React, { useState, useEffect } from 'react';
import { Check, Clock } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import './FlashSale.css';

export const FlashSale: React.FC = () => {
  const [time, setTime] = useState({ days: 2, hours: 15, minutes: 45, seconds: 30 });
  const { addItem } = useCartContext();
  const { homepageSettings } = useAdmin();

  const {
    flashSaleTitle = 'Flash Sale',
    flashSaleBadge = 'Up To 70% Off',
    flashSaleDiscount = '70'
  } = homepageSettings;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds -= 1;
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
          if (minutes < 0) {
            minutes = 59;
            hours -= 1;
            if (hours < 0) {
              hours = 23;
              days -= 1;
              if (days < 0) {
                days = 0;
                hours = 0;
                minutes = 0;
                seconds = 0;
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  const handleShopNow = () => {
    const flashProduct = {
      id: 999,
      name: 'Flash Sale Item',
      price: 29.99,
      reviews: 200,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center'
    };
    addItem(flashProduct);
  };

  return (
    <section className="flash-sale">
      <div className="flash-sale__container">
        <div className="flash-sale__content">
          <div className="flash-sale__header">
            <h2 className="flash-sale__title">{flashSaleTitle}</h2>
            <span className="flash-sale__badge">{flashSaleBadge}</span>
          </div>
          <div className="flash-sale__timer">
            <Clock className="flash-sale__timer-icon" size={20} strokeWidth={1.5} />
            <div className="flash-sale__timer-unit">
              <span className="flash-sale__timer-value">{formatNumber(time.days)}</span>
              <span className="flash-sale__timer-label">Days</span>
            </div>
            <span className="flash-sale__timer-separator">:</span>
            <div className="flash-sale__timer-unit">
              <span className="flash-sale__timer-value">{formatNumber(time.hours)}</span>
              <span className="flash-sale__timer-label">Hours</span>
            </div>
            <span className="flash-sale__timer-separator">:</span>
            <div className="flash-sale__timer-unit">
              <span className="flash-sale__timer-value">{formatNumber(time.minutes)}</span>
              <span className="flash-sale__timer-label">Mins</span>
            </div>
            <span className="flash-sale__timer-separator">:</span>
            <div className="flash-sale__timer-unit">
              <span className="flash-sale__timer-value">{formatNumber(time.seconds)}</span>
              <span className="flash-sale__timer-label">Secs</span>
            </div>
          </div>
          <button className="flash-sale__btn" onClick={handleShopNow}>Shop Now</button>
        </div>
        <div className="flash-sale__features">
          <div className="flash-sale__feature">
            <Check className="flash-sale__feature-icon" size={16} strokeWidth={2.5} />
            <span className="flash-sale__feature-text">Premium Quality</span>
            <span className="flash-sale__feature-sub">Guaranteed best materials</span>
          </div>
          <div className="flash-sale__feature">
            <Check className="flash-sale__feature-icon" size={16} strokeWidth={2.5} />
            <span className="flash-sale__feature-text">Fast Delivery</span>
            <span className="flash-sale__feature-sub">Quick and reliable shipping</span>
          </div>
          <div className="flash-sale__feature">
            <Check className="flash-sale__feature-icon" size={16} strokeWidth={2.5} />
            <span className="flash-sale__feature-text">Secure Checkout</span>
            <span className="flash-sale__feature-sub">Your data is protected</span>
          </div>
          <div className="flash-sale__feature">
            <Check className="flash-sale__feature-icon" size={16} strokeWidth={2.5} />
            <span className="flash-sale__feature-text">Customer Satisfaction</span>
            <span className="flash-sale__feature-sub">Top rated by our customers</span>
          </div>
        </div>
      </div>
    </section>
  );
};
