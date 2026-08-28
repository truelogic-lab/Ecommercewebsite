import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Truck, RotateCcw, Shield, Minus, Plus, Check } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import './ProductDetailPage.css';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartContext();
  const { products } = useAdmin();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = () => {
      setLoading(true);
      const productData = products.find(p => p.id === Number(id));
      if (productData) {
        setProduct(productData);
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, products]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        reviews: product.reviews,
        image: product.image
      }, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-page__container">
          <div className="product-detail-page__loading">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-page__container">
          <h1>Product not found</h1>
          <Link to="/" className="product-detail-page__back-btn">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="product-detail-page">
      <div className="product-detail-page__container">
        <button className="product-detail-page__back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} strokeWidth={1.5} />
          Back
        </button>

        <div className="product-detail-page__grid">
          <div className="product-detail-page__image-wrapper">
            <img 
              src={product.image} 
              alt={product.name}
              className="product-detail-page__image"
            />
            {discount > 0 && (
              <span className="product-detail-page__discount-badge">-{discount}%</span>
            )}
            {!product.inStock && (
              <span className="product-detail-page__out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="product-detail-page__info">
            <div className="product-detail-page__category">{product.category}</div>
            <h1 className="product-detail-page__product-name">{product.name}</h1>
            
            <div className="product-detail-page__rating">
              <div className="product-detail-page__stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={`product-detail-page__star ${i < Math.floor(product.rating || 0) ? 'product-detail-page__star--filled' : ''}`}
                    fill={i < Math.floor(product.rating || 0) ? '#f59e0b' : 'none'}
                  />
                ))}
              </div>
              <span className="product-detail-page__rating-text">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="product-detail-page__price-row">
              <span className="product-detail-page__price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="product-detail-page__original-price">${product.originalPrice.toFixed(2)}</span>
              )}
              <span className={`product-detail-page__stock-status ${!product.inStock ? 'product-detail-page__stock-status--out' : ''}`}>
                {product.inStock ? (
                  <><Check size={14} strokeWidth={2} /> In Stock</>
                ) : (
                  'Out of Stock'
                )}
              </span>
            </div>

            <p className="product-detail-page__description">{product.description}</p>

            {product.features && product.features.length > 0 && (
              <div className="product-detail-page__features">
                <h4 className="product-detail-page__features-title">Features</h4>
                <ul className="product-detail-page__features-list">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="product-detail-page__feature-item">
                      <Check size={14} className="product-detail-page__feature-check" strokeWidth={2} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="product-detail-page__options">
                <label className="product-detail-page__options-label">Size</label>
                <div className="product-detail-page__options-group">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      className={`product-detail-page__option-btn ${selectedSize === size ? 'product-detail-page__option-btn--active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="product-detail-page__options">
                <label className="product-detail-page__options-label">Color</label>
                <div className="product-detail-page__options-group">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      className={`product-detail-page__option-btn ${selectedColor === color ? 'product-detail-page__option-btn--active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-detail-page__actions">
              <div className="product-detail-page__quantity">
                <button 
                  className="product-detail-page__qty-btn"
                  onClick={() => handleQuantityChange(-1)}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} strokeWidth={1.5} />
                </button>
                <span className="product-detail-page__qty-value">{quantity}</span>
                <button 
                  className="product-detail-page__qty-btn"
                  onClick={() => handleQuantityChange(1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} strokeWidth={1.5} />
                </button>
              </div>
              <button 
                className={`product-detail-page__add-cart-btn ${!product.inStock ? 'product-detail-page__add-cart-btn--disabled' : ''}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart size={18} strokeWidth={1.5} />
                {!product.inStock ? 'Out of Stock' : addedToCart ? 'Added!' : 'Add to Cart'}
              </button>
            </div>

            <div className="product-detail-page__trust">
              <div className="product-detail-page__trust-item">
                <Truck size={16} strokeWidth={1.5} />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="product-detail-page__trust-item">
                <RotateCcw size={16} strokeWidth={1.5} />
                <span>30-day return policy</span>
              </div>
              <div className="product-detail-page__trust-item">
                <Shield size={16} strokeWidth={1.5} />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
