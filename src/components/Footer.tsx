import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          <div className="footer__section">
            <h3 className="footer__heading">ShopVerse</h3>
            <p className="footer__text">Discover products you'll love. Curated for modern lifestyles.</p>
          </div>
          <div className="footer__section">
            <h4 className="footer__subheading">Shop</h4>
            <ul className="footer__list">
              <li><Link to="/" className="footer__link">New Arrivals</Link></li>
              <li><Link to="/" className="footer__link">Best Sellers</Link></li>
              <li><Link to="/" className="footer__link">Flash Sales</Link></li>
            </ul>
          </div>
          <div className="footer__section">
            <h4 className="footer__subheading">Support</h4>
            <ul className="footer__list">
              <li><Link to="/help" className="footer__link">Help Center</Link></li>
              <li><Link to="/returns" className="footer__link">Returns</Link></li>
              <li><Link to="/contact" className="footer__link">Contact</Link></li>
            </ul>
          </div>
          <div className="footer__section">
            <h4 className="footer__subheading">Company</h4>
            <ul className="footer__list">
              <li><Link to="/about" className="footer__link">About</Link></li>
              <li><Link to="/careers" className="footer__link">Careers</Link></li>
              <li><Link to="/contact" className="footer__link">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copyright">&copy; 2026 ShopVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
