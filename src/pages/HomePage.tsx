import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductGrid } from '../components/ProductGrid';
import { MarketingBanner } from '../components/MarketingBanner';
import { FlashSale } from '../components/FlashSale';
import { FeatureBar } from '../components/FeatureBar';
import './HomePage.css';

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <MarketingBanner />
      <HeroSection />
      <FeatureBar />
      <CategoryGrid />
      <ProductGrid title="New Arrivals" viewAllLink="/collection?category=all" limit={6} />
      <ProductGrid title="Fashion" viewAllLink="/collection?category=Fashion" limit={4} category="Fashion" />
      <ProductGrid title="Electronics" viewAllLink="/collection?category=Electronics" limit={4} category="Electronics" />
      <FlashSale />
      <ProductGrid title="Best Sellers" viewAllLink="/collection?category=all" limit={6} />
    </div>
  );
};
