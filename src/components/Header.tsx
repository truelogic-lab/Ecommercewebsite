import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, BadgeCheck, X, Loader2, Package } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { sanitizeHTML, preventXSS } from '../middleware/security';
import './Header.css';

export const Header: React.FC = () => {
  const { getTotalItems } = useCartContext();
  const { settings } = useAdmin();
  const totalItems = getTotalItems();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Security: Prevent XSS in search
  const sanitizedStoreName = settings?.storeName ? sanitizeHTML(settings.storeName) : 'ShopVerse';
  const safeStoreName = preventXSS(sanitizedStoreName);

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
    // Security: Sanitize search query
    const sanitizedQuery = sanitizeHTML(query);
    setSearchQuery(sanitizedQuery);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (sanitizedQuery.trim().length > 0) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        setIsSearching(false);
        // Security: URL encode the search query
        navigate(`/collection?search=${encodeURIComponent(sanitizedQuery.trim())}`);
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
      const sanitizedQuery = sanitizeHTML(searchQuery);
      navigate(`/collection?search=${encodeURIComponent(sanitizedQuery.trim())}`);
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

  // Security: Escape user-generated content in store name
  const storeName = safeStoreName;

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo" aria-label={`${storeName} home`}>
          <span className="header__logo-text">{storeName}</span>
          <BadgeCheck className="header__verify-badge" size={18} strokeWidth={1.5} fill="#3b82f6" color="#ffffff" />
        </Link>
        <nav className="header__nav" role="navigation" aria-label="Main navigation">
          <Link to="/" className="header__nav-link" aria-label="Home">Home</Link>
          <Link to="/collection" className="header__nav-link" aria-label="Shop products">Shop</Link>
          <Link to="/track-order" className="header__nav-link header__nav-link--track" aria-label="Track your order">
            <Package size={16} strokeWidth={1.5} />
            Track Order
          </Link>
          <Link to="/deals" className="header__nav-link" aria-label="View deals">Deals</Link>
        </nav>
        <div className="header__actions">
          <button 
            className="header__icon-btn" 
            aria-label={isSearchOpen ? "Close search" : "Search products"}
            onClick={handleSearchToggle}
          >
            {isSearchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
          </button>
          <Link to="/track-order" className="header__icon-btn header__icon-btn--track" aria-label="Track Order">
            <Package size={20} strokeWidth={1.5} />
          </Link>
          <Link to="/cart" className="header__icon-btn" aria-label={`Cart: ${totalItems} items`}>
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="header__cart-badge" aria-label={`${totalItems} items in cart`}>
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
      <div className={`header__search-overlay ${isSearchOpen ? 'header__search-overlay--open' : ''}`} role="search">
        <div className="header__search-container">
          <div className="header__search-wrapper">
            <Search size={18} strokeWidth={1.5} className="header__search-icon" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="search"
              placeholder={`Search ${storeName} products...`}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="header__search-input"
              aria-label="Search products"
              autoComplete="off"
              maxLength={100}
            />
            {isSearching && (
              <Loader2 size={18} strokeWidth={1.5} className="header__search-spinner" aria-hidden="true" />
            )}
            {searchQuery && !isSearching && (
              <button className="header__search-clear" onClick={handleClear} aria-label="Clear search">
                <X size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>
          <button className="header__search-close" onClick={handleSearchToggle} aria-label="Cancel search">
            Cancel
          </button>
        </div>
      </div>
    </header>
  );
};
