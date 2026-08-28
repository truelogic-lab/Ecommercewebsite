import React from 'react';
import { Shirt, Smartphone, Sparkles, Dumbbell, Home, Watch } from 'lucide-react';
import './CategoryGrid.css';

export const CategoryGrid: React.FC = () => {
  const categories = [
    { name: 'Fashion', icon: Shirt },
    { name: 'Electronics', icon: Smartphone },
    { name: 'Beauty', icon: Sparkles },
    { name: 'Fitness', icon: Dumbbell },
    { name: 'Home Decor', icon: Home },
    { name: 'Accessories', icon: Watch }
  ];

  return (
    <section className="category-grid">
      <div className="category-grid__container">
        <h2 className="category-grid__title">Shop by Categories</h2>
        <div className="category-grid__grid">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <button key={index} className="category-grid__item">
                <Icon className="category-grid__item-icon" size={28} strokeWidth={1.5} />
                <span className="category-grid__item-name">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
