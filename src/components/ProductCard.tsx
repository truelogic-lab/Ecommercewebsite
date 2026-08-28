import React, { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import './ProductCard.css';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  reviews: number;
  image: string;
  originalPrice?: number;
  rating?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  id, 
  name, 
  price, 
  reviews, 
  image, 
  originalPrice,
  rating = 4.5
}) => {
  const { addItem } = useCartContext();
  const [isHovered, setIsHovered] = useState(false);
  const formattedPrice = price.toFixed(2);
  const formattedOriginal = originalPrice ? originalPrice.toFixed(2) : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, reviews, image });
  };

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={14} 
          className={`product-card__star ${i < fullStars ? 'product-card__star--filled' : ''}`} 
          fill={i < fullStars ? '#f59e0b' : 'none'} 
        />
      );
    }
    return stars;
  };

  return (
    <Link to={`/product/${id}`} className="product-card__link">
      <article 
        className="product-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="product-card__image-wrapper">
          <img 
            src={image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center'} 
            alt={name}
            className={`product-card__image ${isHovered ? 'product-card__image--hover' : ''}`}
            loading="lazy"
          />
          {discount > 0 && (
            <span className="product-card__discount-badge">-{discount}%</span>
          )}
        </div>
        <div className="product-card__content">
          <h3 className="product-card__name">{name}</h3>
          <div className="product-card__rating">
            <div className="product-card__stars">{renderStars()}</div>
            <span className="product-card__reviews">({reviews})</span>
          </div>
          <div className="product-card__price-row">
            <span className="product-card__price">${formattedPrice}</span>
            {formattedOriginal && (
              <span className="product-card__original-price">${formattedOriginal}</span>
            )}
          </div>
          <button className="product-card__add-btn" onClick={handleAddToCart}>
            <ShoppingCart size={16} strokeWidth={1.5} />
            Add to Cart
          </button>
        </div>
      </article>
    </Link>
  );
};
