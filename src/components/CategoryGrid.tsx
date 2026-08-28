import React from 'react';
import { Shirt, Smartphone, Sparkles, Dumbbell, Home, Watch, Coffee, Leaf, BookOpen, Package, ShoppingBag } from 'lucide-react';
import './CategoryGrid.css';

interface CategoryGridProps {
  categories?: string[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Fashion': <Shirt className="category-grid__item-icon" size={28} strokeWidth={1.5} />,
  'Electronics': <Smartphone className="category-grid__item-icon" size={28} strokeWidth={1.5} />,
  'Beauty': <Sparkles className="category-grid__item-icon" size={28} strokeWidth={1.5} />,
  'Fitness': <Dumbbell className="category-grid__item-icon" size={28} strokeWidth={1.5} />,
  'Home Decor': <Home className="category-grid__item-icon" size={28} strokeWidth={1.5} />,
  'Accessories': <Watch className="category-grid__item-icon" size={28} strokeWidth={1.5} />,
  'Kitchen': <Coffee className="category-grid__item-icon" size={28} strokeWidth={1.5} />,
  'Garden': <Leaf className="category-grid__item-icon" size={28} strokeWidth={1.5} />,
  'Toys': <Package className="category-grid__item-icon" size={28} strokeWidth={1.5} />,
  'Books': <BookOpen className="category-grid__item-icon" size={28} strokeWidth={1.5} />,
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const defaultCategories = ['Fashion', 'Electronics', 'Beauty', 'Fitness', 'Home Decor', 'Accessories'];
  const displayCategories = categories || defaultCategories;

  return (
    <section className="category-grid">
      <div className="category-grid__container">
        <h2 className="category-grid__title">Shop by Categories</h2>
        <div className="category-grid__grid">
          {displayCategories.map((category, index) => {
            const Icon = categoryIcons[category];
            return (
              <button key={index} className="category-grid__item">
                {Icon || <ShoppingBag className="category-grid__item-icon" size={28} strokeWidth={1.5} />}
                <span className="category-grid__item-name">{category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
