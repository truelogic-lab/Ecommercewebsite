import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Grid, List, Filter, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products, categories } from '../data/products';
import './CollectionPage.css';

export const CollectionPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    const normalized = category.toLowerCase() === 'all' ? 'all' : category;
    setSelectedCategory(normalized);
    const params: Record<string, string> = { category: normalized };
    if (searchQuery) {
      params.search = searchQuery;
    }
    setSearchParams(params);
    setShowFilters(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const params: Record<string, string> = {};
    if (selectedCategory !== 'all') {
      params.category = selectedCategory;
    }
    if (query.trim()) {
      params.search = query.trim();
    }
    setSearchParams(params);
  };

  const clearSearch = () => {
    setSearchQuery('');
    const params: Record<string, string> = {};
    if (selectedCategory !== 'all') {
      params.category = selectedCategory;
    }
    setSearchParams(params);
  };

  return (
    <div className="collection-page">
      <div className="collection-page__container">
        <Link to="/" className="collection-page__back">
          <ArrowLeft size={18} strokeWidth={1.5} />
          Back to Site
        </Link>

        <div className="collection-page__header">
          <h1 className="collection-page__title">Explore Collection</h1>
          <p className="collection-page__subtitle">Browse products by category</p>
        </div>

        <div className="collection-page__controls">
          <div className="collection-page__search">
            <Search size={18} strokeWidth={1.5} className="collection-page__search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="collection-page__search-input"
            />
            {searchQuery && (
              <button className="collection-page__search-clear" onClick={clearSearch}>
                <X size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>
          <div className="collection-page__controls-right">
            <button 
              className="collection-page__filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} strokeWidth={1.5} />
              <span>Filter</span>
            </button>
            <div className="collection-page__view-toggle">
              <button 
                className={`collection-page__view-btn ${viewMode === 'grid' ? 'collection-page__view-btn--active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid size={18} strokeWidth={1.5} />
              </button>
              <button 
                className={`collection-page__view-btn ${viewMode === 'list' ? 'collection-page__view-btn--active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        <div className={`collection-page__filters ${showFilters ? 'collection-page__filters--open' : ''}`}>
          <div className="collection-page__filters-content">
            <span className="collection-page__filters-label">Categories:</span>
            <div className="collection-page__filters-list">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`collection-page__filter-chip ${selectedCategory === (category.toLowerCase() === 'all' ? 'all' : category) ? 'collection-page__filter-chip--active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="collection-page__results">
          <span className="collection-page__results-count">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </span>
        </div>

        <div className={`collection-page__products ${viewMode === 'list' ? 'collection-page__products--list' : ''}`}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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
            ))
          ) : (
            <div className="collection-page__empty">
              <p className="collection-page__empty-text">No products found matching your criteria.</p>
              <button 
                className="collection-page__empty-btn"
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setSearchParams({}); }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
