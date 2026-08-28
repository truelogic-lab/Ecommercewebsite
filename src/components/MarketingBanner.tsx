import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import './MarketingBanner.css';

export const MarketingBanner: React.FC = () => {
  const { homepageSettings } = useAdmin();

  const {
    marketingBannerTitle = 'Summer Sale Up to 50% Off',
    marketingBannerSubtitle = 'Don\'t miss out on our biggest sale of the year.',
    marketingBannerButtonText = 'Shop Now',
    marketingBannerButtonLink = '/collection'
  } = homepageSettings;

  return (
    <section className="marketing-banner">
      <div className="marketing-banner__container">
        <div className="marketing-banner__image-wrapper">
          <div className="marketing-banner__image-container">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=600&fit=crop&crop=center&bg=transparent"
              alt="Professional pointing"
              className="marketing-banner__image"
              loading="lazy"
            />
            <div className="marketing-banner__image-overlay">
              <div className="marketing-banner__floating-card marketing-banner__floating-card--top">
                <Star size={14} className="marketing-banner__floating-icon" fill="#f59e0b" color="#f59e0b" />
                <span>Top Rated</span>
              </div>
              <div className="marketing-banner__floating-card marketing-banner__floating-card--bottom">
                <Zap size={14} className="marketing-banner__floating-icon" color="#8b5cf6" />
                <span>Best Seller</span>
              </div>
              <div className="marketing-banner__logo-badge">
                <span className="marketing-banner__logo-badge-text">ShopVerse</span>
                <span className="marketing-banner__logo-badge-sub">Verified Store</span>
              </div>
            </div>
          </div>
        </div>
        <div className="marketing-banner__content">
          <div className="marketing-banner__badge">Limited Time Offer</div>
          <h2 className="marketing-banner__title">
            {marketingBannerTitle}
          </h2>
          <p className="marketing-banner__description">{marketingBannerSubtitle}</p>
          <Link to={marketingBannerButtonLink} className="marketing-banner__btn">
            {marketingBannerButtonText}
            <ArrowRight size={18} strokeWidth={1.5} />
          </Link>
          <div className="marketing-banner__stats">
            <div className="marketing-banner__stat">
              <span className="marketing-banner__stat-number">24h</span>
              <span className="marketing-banner__stat-label">Sale Duration</span>
            </div>
            <div className="marketing-banner__stat-divider"></div>
            <div className="marketing-banner__stat">
              <span className="marketing-banner__stat-number">500+</span>
              <span className="marketing-banner__stat-label">Items on Sale</span>
            </div>
            <div className="marketing-banner__stat-divider"></div>
            <div className="marketing-banner__stat">
              <span className="marketing-banner__stat-number">4.8</span>
              <span className="marketing-banner__stat-label">Customer Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
