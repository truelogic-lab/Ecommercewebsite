import React from 'react';
import { ProductCard } from './ProductCard';
import { products } from '../data/products';
import './ProductGrid.css';

interface ProductGridProps {
  title: string;
  viewAllLink?: string;
  limit?: number;
  category?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ title, viewAllLink, limit = 6, category }) => {
  let filteredProducts = products;
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  const displayProducts = filteredProducts.slice(0, limit);

  return (
    <section className="product-grid">
      <div className="product-grid__container">
        <div className="product-grid__header">
          <h2 className="product-grid__title">{title}</h2>
          {viewAllLink && (
            <a href={viewAllLink} className="product-grid__view-all">View All</a>
          )}
        </div>
        <div className="product-grid__grid">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              reviews={product.reviews}
              image={product.image}
              originalPrice={product.originalPrice}
              rating={product.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
