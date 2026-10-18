import { Package, Shirt, ShoppingBag, Home, Dumbbell, Sparkles } from 'lucide-react';

export const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    icon: Package,
    description: 'Latest gadgets and electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    slug: 'fashion',
    icon: Shirt,
    description: 'Trending fashion and apparel',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'grocery',
    name: 'Grocery',
    slug: 'grocery',
    icon: ShoppingBag,
    description: 'Fresh groceries delivered',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    icon: Home,
    description: 'Everything for your home',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    slug: 'sports',
    icon: Dumbbell,
    description: 'Sports equipment and fitness gear',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'beauty',
    name: 'Beauty & Care',
    slug: 'beauty',
    icon: Sparkles,
    description: 'Beauty and personal care products',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
    color: 'from-purple-500 to-purple-600'
  }
];

export const getCategoryById = (id) => {
  return categories.find(cat => cat.id === id);
};

export const getCategoryBySlug = (slug) => {
  return categories.find(cat => cat.slug === slug);
};