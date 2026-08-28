export interface Product {
  id: number;
  name: string;
  price: number;
  reviews: number;
  image: string;
  description?: string;
  category?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  discountPercentage?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'popularity';
export type ViewMode = 'grid' | 'list';
