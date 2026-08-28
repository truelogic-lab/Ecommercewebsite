import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap } from 'lucide-react';
import './MarketingBanner.css';

export const MarketingBanner: React.FC = () => {
  return (
    <section className="marketing-banner">
      <div className="marketing-banner__container">
        <div className="marketing-banner__image-wrapper">
          <div className="marketing-banner__image-container">
            <svg 
              className="marketing-banner__vector"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="400" height="400" rx="16" fill="#f1f5f9" />
              
              {/* Person silhouette - professional pointing */}
              <g transform="translate(100, 60)">
                {/* Body/suit */}
                <rect x="60" y="120" width="120" height="160" rx="12" fill="#1e293b" />
                <rect x="70" y="125" width="100" height="30" rx="4" fill="#334155" />
                <rect x="80" y="160" width="80" height="50" rx="4" fill="#334155" />
                
                {/* Head */}
                <circle cx="120" cy="70" r="50" fill="#e2e8f0" />
                <circle cx="105" cy="60" r="6" fill="#475569" />
                <circle cx="135" cy="60" r="6" fill="#475569" />
                <path d="M100 85 Q120 95 140 85" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                
                {/* Hair */}
                <path d="M70 60 Q80 30 120 30 Q160 30 170 60" fill="#1e293b" />
                
                {/* Left arm pointing forward */}
                <g transform="rotate(-30, 60, 140)">
                  <rect x="10" y="130" width="60" height="20" rx="8" fill="#1e293b" />
                  <circle cx="10" cy="140" r="12" fill="#e2e8f0" />
                </g>
                
                {/* Right arm relaxed */}
                <g transform="rotate(15, 180, 140)">
                  <rect x="170" y="130" width="50" height="20" rx="8" fill="#1e293b" />
                  <circle cx="220" cy="140" r="12" fill="#e2e8f0" />
                </g>
                
                {/* Legs */}
                <rect x="75" y="280" width="30" height="60" rx="6" fill="#1e293b" />
                <rect x="135" y="280" width="30" height="60" rx="6" fill="#1e293b" />
                
                {/* Shoes */}
                <rect x="70" y="335" width="40" height="15" rx="6" fill="#475569" />
                <rect x="130" y="335" width="40" height="15" rx="6" fill="#475569" />
                
                {/* Tie */}
                <rect x="115" y="155" width="10" height="40" rx="2" fill="#6366f1" />
              </g>
              
              {/* Arrow/pointer from person to right side */}
              <g transform="translate(250, 200)">
                <circle cx="0" cy="0" r="60" fill="#6366f1" opacity="0.12" />
                <circle cx="0" cy="0" r="40" fill="#6366f1" opacity="0.20" />
                <circle cx="0" cy="0" r="24" fill="#6366f1" />
                <path d="M-8 -8 L8 0 L-8 8 Z" fill="#ffffff" />
              </g>
              
              {/* Floating badge elements */}
              <g transform="translate(280, 80)">
                <rect x="0" y="0" width="90" height="32" rx="16" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
                <rect x="8" y="8" width="16" height="16" rx="8" fill="#f59e0b" />
                <text x="30" y="21" fontSize="12" fontWeight="600" fill="#1e293b">Top Rated</text>
              </g>
              
              <g transform="translate(20, 260)">
                <rect x="0" y="0" width="100" height="32" rx="16" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
                <rect x="8" y="8" width="16" height="16" rx="8" fill="#8b5cf6" />
                <text x="30" y="21" fontSize="12" fontWeight="600" fill="#1e293b">Best Seller</text>
              </g>
              
              {/* ShopVerse logo badge */}
              <g transform="translate(140, 300)">
                <rect x="0" y="0" width="120" height="50" rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
                <text x="60" y="22" fontSize="16" fontWeight="800" fill="#ffffff" textAnchor="middle">ShopVerse</text>
                <text x="60" y="40" fontSize="10" fontWeight="500" fill="#a78bfa" textAnchor="middle" letterSpacing="1">★ VERIFIED STORE</text>
              </g>
              
              {/* Decorative circles */}
              <circle cx="340" cy="340" r="8" fill="#6366f1" opacity="0.3" />
              <circle cx="360" cy="320" r="4" fill="#6366f1" opacity="0.2" />
              <circle cx="30" cy="30" r="6" fill="#f59e0b" opacity="0.25" />
              <circle cx="50" cy="50" r="3" fill="#f59e0b" opacity="0.15" />
              
              {/* Pointing arrow from person to logo */}
              <path d="M200 250 C230 230, 260 230, 280 250" stroke="#6366f1" strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
            </svg>
            
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
            Summer Sale <br />
            <span className="marketing-banner__highlight">Up to 50% Off</span>
          </h2>
          <p className="marketing-banner__description">
            Don't miss out on our biggest sale of the year. Shop now and save big on your favorite products.
          </p>
          <Link to="/collection" className="marketing-banner__btn">
            Shop Now
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
