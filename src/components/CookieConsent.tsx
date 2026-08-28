import React, { useState, useEffect } from 'react';
import { X, Cookie, Check, Shield, Info } from 'lucide-react';
import './CookieConsent.css';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent__container">
        <div className="cookie-consent__header">
          <Cookie size={24} className="cookie-consent__icon" strokeWidth={1.5} />
          <h3 className="cookie-consent__title">We value your privacy</h3>
          <button 
            className="cookie-consent__close"
            onClick={handleReject}
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <p className="cookie-consent__text">
          We use cookies to enhance your browsing experience, serve personalized content, 
          and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
        </p>
        <button 
          className="cookie-consent__toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Info size={14} strokeWidth={1.5} />
          {isExpanded ? 'Hide details' : 'Learn more about cookies'}
        </button>
        {isExpanded && (
          <div className="cookie-consent__details">
            <div className="cookie-consent__detail-item">
              <Check size={16} className="cookie-consent__detail-icon" strokeWidth={2} />
              <div>
                <span className="cookie-consent__detail-label">Essential cookies</span>
                <span className="cookie-consent__detail-desc">Required for basic site functionality</span>
              </div>
            </div>
            <div className="cookie-consent__detail-item">
              <Check size={16} className="cookie-consent__detail-icon" strokeWidth={2} />
              <div>
                <span className="cookie-consent__detail-label">Analytics cookies</span>
                <span className="cookie-consent__detail-desc">Help us understand how you use our site</span>
              </div>
            </div>
            <div className="cookie-consent__detail-item">
              <Check size={16} className="cookie-consent__detail-icon" strokeWidth={2} />
              <div>
                <span className="cookie-consent__detail-label">Marketing cookies</span>
                <span className="cookie-consent__detail-desc">Used to deliver relevant advertisements</span>
              </div>
            </div>
          </div>
        )}
        <div className="cookie-consent__actions">
          <button 
            className="cookie-consent__btn cookie-consent__btn--accept"
            onClick={handleAccept}
          >
            <Check size={18} strokeWidth={1.5} />
            Accept All
          </button>
          <button 
            className="cookie-consent__btn cookie-consent__btn--reject"
            onClick={handleReject}
          >
            Reject All
          </button>
        </div>
      </div>
    </div>
  );
};
