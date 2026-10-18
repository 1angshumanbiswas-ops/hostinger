export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const calculateCartSubtotal = (items) => {
  return items.reduce((sum, item) => {
    const product = item.product || item;
    return sum + (product.price * item.quantity);
  }, 0);
};

export const calculateTax = (subtotal, taxRate = 0.18) => {
  return Math.round(subtotal * taxRate);
};

export const calculateShipping = (subtotal, freeShippingThreshold = 500) => {
  return subtotal >= freeShippingThreshold ? 0 : 50;
};

export const calculateTotal = (subtotal, tax, shipping, discount = 0) => {
  return subtotal + tax + shipping - discount;
};

export const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `MSC${timestamp}${random}`;
};

export const getStockStatus = (stock) => {
  if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600', available: false };
  if (stock < 10) return { label: `Only ${stock} left`, color: 'text-orange-600', available: true };
  return { label: 'In Stock', color: 'text-green-600', available: true };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validatePincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getEstimatedDeliveryDate = (shippingMethod = 'standard') => {
  const days = {
    standard: 7,
    express: 3,
    overnight: 1
  };
  
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days[shippingMethod]);
  
  return deliveryDate;
};

export const getOrderStatus = (status) => {
  const statusMap = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    processing: { label: 'Processing', color: 'bg-orange-100 text-orange-800' },
    shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  };
  
  return statusMap[status] || statusMap.pending;
};

export const applyCouponCode = (code, subtotal) => {
  const coupons = {
    'SAVE10': { type: 'percentage', value: 10, minAmount: 500 },
    'SAVE20': { type: 'percentage', value: 20, minAmount: 1000 },
    'WELCOME5': { type: 'percentage', value: 5, minAmount: 0 }
  };
  
  const coupon = coupons[code.toUpperCase()];
  
  if (!coupon) {
    return { valid: false, message: 'Invalid coupon code', discount: 0 };
  }
  
  if (subtotal < coupon.minAmount) {
    return { 
      valid: false, 
      message: `Minimum order of ${formatCurrency(coupon.minAmount)} required`, 
      discount: 0 
    };
  }
  
  const discount = coupon.type === 'percentage' 
    ? Math.round((subtotal * coupon.value) / 100)
    : coupon.value;
  
  return { 
    valid: true, 
    message: 'Coupon applied successfully', 
    discount,
    code: code.toUpperCase()
  };
};