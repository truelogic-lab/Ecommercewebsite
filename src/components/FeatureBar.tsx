import React from 'react';
import { Truck, Lock, RotateCcw, Headphones } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import './FeatureBar.css';

export const FeatureBar: React.FC = () => {
  const { settings } = useAdmin();

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: `On orders over $${settings.freeShippingThreshold || 50}`
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      description: '100% secure checkout'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Always here to help'
    }
  ];

  return (
    <div className="feature-bar">
      <div className="feature-bar__container">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="feature-bar__item">
              <Icon className="feature-bar__icon" size={24} strokeWidth={1.5} />
              <div className="feature-bar__content">
                <span className="feature-bar__title">{feature.title}</span>
                <span className="feature-bar__description">{feature.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
