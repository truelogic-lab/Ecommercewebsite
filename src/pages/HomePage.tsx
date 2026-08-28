import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductGrid } from '../components/ProductGrid';
import { MarketingBanner } from '../components/MarketingBanner';
import { FlashSale } from '../components/FlashSale';
import { FeatureBar } from '../components/FeatureBar';
import { useAdmin } from '../context/AdminContext';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const { products, homepageSettings } = useAdmin();
  const [allProducts, setAllProducts] = useState(products);

  useEffect(() => {
    setAllProducts(products);
  }, [products]);

  const fashionProducts = allProducts.filter(p => p.category === 'Fashion');
  const electronicsProducts = allProducts.filter(p => p.category === 'Electronics');
  const newArrivals = allProducts.slice(0, 6);
  const bestSellers = allProducts.slice(6, 12);

  // Get featured categories from admin settings
  const featuredCategories = homepageSettings.featuredCategories || ['Fashion', 'Electronics', 'Beauty', 'Fitness', 'Home Decor', 'Accessories'];

  return (
    <div className="home-page">
      <MarketingBanner />
      <HeroSection />
      <FeatureBar />
      <CategoryGrid categories={featuredCategories} />
      {homepageSettings.showNewArrivals && (
        <ProductGrid 
          title={homepageSettings.newArrivalsTitle || 'New Arrivals'} 
          viewAllLink="/collection?category=all" 
          limit={6}
          products={newArrivals}
        />
      )}
      <ProductGrid 
        title="Fashion" 
        viewAllLink="/collection?category=Fashion" 
        limit={4}
        products={fashionProducts}
      />
      <ProductGrid 
        title="Electronics" 
        viewAllLink="/collection?category=Electronics" 
        limit={4}
        products={electronicsProducts}
      />
      <FlashSale />
      {homepageSettings.showBestSellers && (
        <ProductGrid 
          title={homepageSettings.bestSellersTitle || 'Best Sellers'} 
          viewAllLink="/collection?category=all" 
          limit={6}
          products={bestSellers}
        />
      )}
    </div>
  );
};
