import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { sanitizeHTML, preventXSS } from '../middleware/security';
import { BadgeCheck } from 'lucide-react';
import './Footer.css';

export const Footer: React.FC = () => {
  const { settings } = useAdmin();
  
  // Security: Sanitize all user-generated content
  const rawStoreName = settings?.storeName || 'ShopVerse';
  const rawStoreEmail = settings?.storeEmail || 'support@shopverse.com';
  
  const storeName = preventXSS(sanitizeHTML(rawStoreName));
  const storeEmail = preventXSS(sanitizeHTML(rawStoreEmail));
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__grid">
          <div className="footer__section">
            <div className="footer__brand">
              <h3 className="footer__heading">{storeName}</h3>
              <BadgeCheck className="footer__verify-badge" size={18} strokeWidth={1.5} fill="#3b82f6" color="#ffffff" />
            </div>
            <p className="footer__text">Discover products you'll love. Curated for modern lifestyles.</p>
            <p className="footer__text footer__text--email" aria-label={`Email: ${storeEmail}`}>
              {storeEmail}
            </p>
          </div>
          <div className="footer__section">
            <h4 className="footer__subheading">Shop</h4>
            <ul className="footer__list" role="list">
              <li><Link to="/" className="footer__link" aria-label="New Arrivals">New Arrivals</Link></li>
              <li><Link to="/" className="footer__link" aria-label="Best Sellers">Best Sellers</Link></li>
              <li><Link to="/" className="footer__link" aria-label="Flash Sales">Flash Sales</Link></li>
            </ul>
          </div>
          <div className="footer__section">
            <h4 className="footer__subheading">Support</h4>
            <ul className="footer__list" role="list">
              <li><Link to="/help" className="footer__link" aria-label="Help Center">Help Center</Link></li>
              <li><Link to="/returns" className="footer__link" aria-label="Returns Policy">Returns</Link></li>
              <li><Link to="/contact" className="footer__link" aria-label="Contact Us">Contact</Link></li>
            </ul>
          </div>
          <div className="footer__section">
            <h4 className="footer__subheading">Company</h4>
            <ul className="footer__list" role="list">
              <li><Link to="/about" className="footer__link" aria-label="About Us">About</Link></li>
              <li><Link to="/careers" className="footer__link" aria-label="Careers">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              &copy; {currentYear} {storeName}. All rights reserved.
            </p>
            <div className="footer__trust-badge">
              <BadgeCheck size={14} strokeWidth={1.5} fill="#3b82f6" color="#ffffff" />
              <span>Verified Store</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
