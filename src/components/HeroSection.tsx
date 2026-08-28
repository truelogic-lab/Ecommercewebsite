import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Users, Star } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import './HeroSection.css';

export const HeroSection: React.FC = () => {
  const { addItem } = useCartContext();
  const { homepageSettings } = useAdmin();

  const handleShopNow = () => {
    const featuredProduct = {
      id: 100,
      name: 'Wireless Headphone',
      price: 39.99,
      reviews: 50000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop&crop=center'
    };
    addItem(featuredProduct);
  };

  const {
    heroTitle = 'Discover Products You\'ll Love',
    heroSubtitle = 'Shop the latest trending products curated for modern lifestyles.',
    heroButtonText = 'Shop Now',
    heroButtonLink = '/collection'
  } = homepageSettings;

  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1 className="hero__title">{heroTitle}</h1>
          <p className="hero__description">{heroSubtitle}</p>
          <div className="hero__actions">
            <button className="hero__btn-primary" onClick={handleShopNow}>
              <ShoppingCart size={18} strokeWidth={1.5} />
              {heroButtonText}
            </button>
            <Link to={heroButtonLink} className="hero__btn-secondary">
              Explore Collection
            </Link>
          </div>
          <div className="hero__featured">
            <div className="hero__featured-item">
              <span className="hero__featured-price">$39.99</span>
              <span className="hero__featured-label">Wireless Headphone</span>
            </div>
            <div className="hero__featured-divider"></div>
            <div className="hero__featured-item">
              <Users size={16} className="hero__featured-icon" strokeWidth={1.5} />
              <span className="hero__featured-stat">50,000+</span>
              <span className="hero__featured-label">Customers worldwide</span>
            </div>
          </div>
        </div>
        <div className="hero__image-wrapper">
          <div className="hero__image-container">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&crop=center" 
              alt="Featured product showcase"
              className="hero__image"
              loading="lazy"
            />
            <div className="hero__image-overlay">
              <div className="hero__overlay-content">
                <div className="hero__overlay-badge">Best Seller</div>
                <div className="hero__overlay-rating">
                  <Star size={16} className="hero__overlay-star" fill="#f59e0b" color="#f59e0b" />
                  <span>4.8</span>
                  <span className="hero__overlay-reviews">(12.4k reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
