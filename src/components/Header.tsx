import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, BadgeCheck, X, Loader2, Package } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import './Header.css';

export const Header: React.FC = () => {
  const { getTotalItems } = useCartContext();
  const totalItems = getTotalItems();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length > 0) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        setIsSearching(false);
        navigate(`/collection?search=${encodeURIComponent(query.trim())}`);
        setIsSearchOpen(false);
        setSearchQuery('');
      }, 800);
    } else {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim().length > 0) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      setIsSearching(false);
      navigate(`/collection?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setIsSearching(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <span className="header__logo-text">ShopVerse</span>
          <BadgeCheck className="header__verify-badge" size={18} strokeWidth={1.5} fill="#3b82f6" color="#ffffff" />
        </Link>
        <nav className="header__nav">
          <Link to="/" className="header__nav-link">Home</Link>
          <Link to="/collection" className="header__nav-link">Shop</Link>
          <Link to="/track-order" className="header__nav-link header__nav-link--track">
            <Package size={16} strokeWidth={1.5} />
            Track Order
          </Link>
          <Link to="/deals" className="header__nav-link">Deals</Link>
        </nav>
        <div className="header__actions">
          <button 
            className="header__icon-btn" 
            aria-label="Search"
            onClick={handleSearchToggle}
          >
            {isSearchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
          </button>
          <Link to="/track-order" className="header__icon-btn header__icon-btn--track" aria-label="Track Order">
            <Package size={20} strokeWidth={1.5} />
          </Link>
          <Link to="/cart" className="header__icon-btn" aria-label="Cart">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="header__cart-badge">{totalItems}</span>
            )}
          </Link>
        </div>
      </div>
      <div className={`header__search-overlay ${isSearchOpen ? 'header__search-overlay--open' : ''}`}>
        <div className="header__search-container">
          <div className="header__search-wrapper">
            <Search size={18} strokeWidth={1.5} className="header__search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="header__search-input"
            />
            {isSearching && (
              <Loader2 size={18} strokeWidth={1.5} className="header__search-spinner" />
            )}
            {searchQuery && !isSearching && (
              <button className="header__search-clear" onClick={handleClear}>
                <X size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>
          <button className="header__search-close" onClick={handleSearchToggle}>
            Cancel
          </button>
        </div>
      </div>
    </header>
  );
};
