export const filterProducts = (products, filters) => {
  let filtered = [...products];

  // Category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  // Price range filter
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice);
  }

  // Rating filter
  if (filters.minRating) {
    filtered = filtered.filter(p => p.rating >= filters.minRating);
  }

  // Brand filter
  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter(p => filters.brands.includes(p.brand));
  }

  // In stock filter
  if (filters.inStockOnly) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  // Search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.brand?.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query)
    );
  }

  return filtered;
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-low-high':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high-low':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.reverse();
    case 'popular':
      return sorted.sort((a, b) => b.reviews - a.reviews);
    case 'discount':
      return sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    default:
      return sorted;
  }
};

export const calculateDiscount = (original, current) => {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

export const getStockStatus = (stock) => {
  if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600' };
  if (stock < 10) return { label: `Only ${stock} left`, color: 'text-orange-600' };
  return { label: 'In Stock', color: 'text-green-600' };
};

export const getBrandList = (products) => {
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  return brands.sort();
};

export const getPriceRange = (products) => {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map(p => p.price);
  return {
    min: Math.floor(Math.min(...prices) / 1000) * 1000,
    max: Math.ceil(Math.max(...prices) / 1000) * 1000
  };
};

export const getRelatedProducts = (product, allProducts, limit = 4) => {
  return allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
};

export const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

export const calculateCartSubtotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const calculateTax = (subtotal, taxRate = 0.18) => {
  return Math.round(subtotal * taxRate);
};

export const calculateShipping = (subtotal, threshold = 5000) => {
  return subtotal >= threshold ? 0 : 99;
};

export const calculateTotal = (subtotal, tax, shipping, discount = 0) => {
  return subtotal + tax + shipping - discount;
};