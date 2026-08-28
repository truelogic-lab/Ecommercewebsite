import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Users, Package, Heart } from 'lucide-react';
import './AboutPage.css';

export const AboutPage: React.FC = () => {
  const values = [
    { icon: Award, title: 'Quality First', description: 'We curate only the best products for our customers.' },
    { icon: Users, title: 'Customer Focused', description: 'Your satisfaction is our top priority.' },
    { icon: Package, title: 'Fast Delivery', description: 'Quick and reliable shipping worldwide.' },
    { icon: Heart, title: 'Passionate Team', description: 'We love what we do and it shows in our service.' },
  ];

  return (
    <div className="about-page">
      <div className="about-page__container">
        <Link to="/" className="about-page__back">
          <ArrowLeft size={18} strokeWidth={1.5} />
          Back to Shop
        </Link>
        <h1 className="about-page__title">About ShopVerse</h1>
        
        <div className="about-page__story">
          <div className="about-page__story-content">
            <h2 className="about-page__story-title">Our Story</h2>
            <p className="about-page__story-text">
              ShopVerse was founded with a simple mission: to bring the best products 
              to modern lifestyles. We believe that shopping should be an experience 
              — joyful, seamless, and inspiring.
            </p>
            <p className="about-page__story-text">
              From our headquarters, we curate a collection of products that combine 
              quality, design, and value. Every item is handpicked to ensure it meets 
              our high standards.
            </p>
          </div>
        </div>

        <div className="about-page__values">
          <h2 className="about-page__values-title">Our Values</h2>
          <div className="about-page__values-grid">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="about-page__value">
                  <Icon className="about-page__value-icon" size={32} strokeWidth={1.5} />
                  <h3 className="about-page__value-title">{value.title}</h3>
                  <p className="about-page__value-description">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="about-page__stats">
          <div className="about-page__stat">
            <span className="about-page__stat-number">50,000+</span>
            <span className="about-page__stat-label">Happy Customers</span>
          </div>
          <div className="about-page__stat">
            <span className="about-page__stat-number">1,000+</span>
            <span className="about-page__stat-label">Products</span>
          </div>
          <div className="about-page__stat">
            <span className="about-page__stat-number">50+</span>
            <span className="about-page__stat-label">Countries</span>
          </div>
          <div className="about-page__stat">
            <span className="about-page__stat-number">4.8</span>
            <span className="about-page__stat-label">Average Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};
