import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Package, Clock, CreditCard } from 'lucide-react';
import './ReturnsPage.css';

export const ReturnsPage: React.FC = () => {
  const steps = [
    { icon: Package, title: 'Request Return', description: 'Submit a return request from your order history.' },
    { icon: Clock, title: 'Get Approval', description: 'We will review and approve your return within 24 hours.' },
    { icon: Package, title: 'Ship Back', description: 'Package and ship the item back to us using the provided label.' },
    { icon: CreditCard, title: 'Get Refund', description: 'Refund will be processed within 5-7 business days.' },
  ];

  return (
    <div className="returns-page">
      <div className="returns-page__container">
        <Link to="/" className="returns-page__back">
          <ArrowLeft size={18} strokeWidth={1.5} />
          Back to Shop
        </Link>
        <h1 className="returns-page__title">Returns</h1>
        <p className="returns-page__subtitle">30-day return policy for all unused items</p>

        <div className="returns-page__policy">
          <div className="returns-page__policy-card">
            <h2 className="returns-page__policy-title">Our Return Policy</h2>
            <p className="returns-page__policy-text">
              We want you to love every purchase. If you are not completely satisfied, 
              you can return any item within 30 days of delivery for a full refund.
            </p>
            <ul className="returns-page__policy-list">
              <li><CheckCircle size={16} strokeWidth={1.5} /> Items must be unused and in original packaging</li>
              <li><CheckCircle size={16} strokeWidth={1.5} /> Return shipping is free for orders over $50</li>
              <li><CheckCircle size={16} strokeWidth={1.5} /> Refunds processed within 5-7 business days</li>
            </ul>
          </div>
        </div>

        <div className="returns-page__steps">
          <h2 className="returns-page__steps-title">How to Return</h2>
          <div className="returns-page__steps-grid">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="returns-page__step">
                  <div className="returns-page__step-number">{index + 1}</div>
                  <Icon className="returns-page__step-icon" size={24} strokeWidth={1.5} />
                  <h3 className="returns-page__step-title">{step.title}</h3>
                  <p className="returns-page__step-description">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="returns-page__contact">
          <p className="returns-page__contact-text">Need help? Contact our support team.</p>
          <Link to="/help" className="returns-page__contact-btn">Contact Support</Link>
        </div>
      </div>
    </div>
  );
};
