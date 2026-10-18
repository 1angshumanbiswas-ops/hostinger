import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Star, Clock, Mail, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import EcomHeader from '@/components/ecommerce/EcomHeader';
import EcomFooter from '@/components/ecommerce/EcomFooter';
import ProductCard from '@/components/ecommerce/ProductCard';
import { categories } from '@/data/categories';
import { products, getFeaturedProducts, getTrendingProducts } from '@/data/products';
import { formatPrice } from '@/utils/productUtils';
import { useToast } from '@/hooks/use-toast';

const EcomHomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [flashSaleTime, setFlashSaleTime] = useState({ hours: 2, minutes: 30, seconds: 0 });

  const featuredProducts = getFeaturedProducts().slice(0, 6);
  const trendingProducts = getTrendingProducts().slice(0, 6);

  // Flash sale countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSaleTime(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast({
        title: 'Subscribed!',
        description: 'Thank you for subscribing to our newsletter.'
      });
      setEmail('');
    }
  };

  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Amazing shopping experience! Fast delivery and excellent product quality.',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Rahul Kumar',
      rating: 5,
      comment: 'Best prices in the market. I always find great deals here!',
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'Anjali Verma',
      rating: 4,
      comment: 'Great variety of products. Customer service is very responsive.',
      date: '3 weeks ago'
    },
    {
      id: 4,
      name: 'Vikram Singh',
      rating: 5,
      comment: 'Reliable and trustworthy. My go-to online store for everything!',
      date: '1 week ago'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Mystore.com - Your One-Stop Online Shopping Destination</title>
        <meta name="description" content="Shop the best products at unbeatable prices. Electronics, Fashion, Groceries, Home & Kitchen, Sports, Beauty and more with fast delivery." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <EcomHeader />

        {/* Hero Banner */}
        <section className="relative h-[500px] md:h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1677693944335-178ba4f745d2"
              alt="Welcome to Mystore.com"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          </div>
          
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-white"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                Welcome to Mystore.com
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-gray-100">
                Your One-Stop Online Shopping Destination
              </p>
              <p className="text-lg mb-8 text-gray-200">
                Discover amazing deals on Electronics, Fashion, Groceries & more. Free shipping on orders above ₹5,000!
              </p>
              <Button
                onClick={() => navigate('/products')}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white text-lg px-8"
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Categories Showcase */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
              <p className="text-gray-600 text-lg">Explore our wide range of products</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ y: -8 }}
                    onClick={() => navigate(`/products?category=${category.slug}`)}
                    className="cursor-pointer group"
                  >
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center hover:border-primary hover:shadow-xl transition-all duration-300">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Flash Sale */}
        <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                  <h2 className="text-3xl md:text-4xl font-bold">Flash Sale</h2>
                </div>
                <p className="text-gray-600">Limited time offers - Grab them before they're gone!</p>
              </div>
              
              <div className="flex items-center gap-4">
                <Clock className="w-6 h-6 text-red-600" />
                <div className="flex gap-2">
                  {['hours', 'minutes', 'seconds'].map((unit) => (
                    <div key={unit} className="bg-white rounded-lg p-3 shadow-md min-w-[70px] text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {String(flashSaleTime[unit]).padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-600 uppercase">{unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.filter(p => p.discount > 15).slice(0, 4).map((product) => (
                <div key={product.id} className="relative">
                  <Badge className="absolute top-2 left-2 z-10 bg-red-600 text-white text-lg font-bold animate-pulse">
                    {product.discount}% OFF
                  </Badge>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
              <p className="text-gray-600 text-lg">Handpicked products just for you</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button
                onClick={() => navigate('/products')}
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Trending Products */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">Trending Now</h2>
              </div>
              <p className="text-gray-600 text-lg">Most popular products this week</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-gray-600 text-lg">Real reviews from real shoppers</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  whileHover={{ y: -4 }}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">{testimonial.comment}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Mail className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-lg mb-8 text-green-50">
                Get exclusive deals, new product alerts, and special offers delivered to your inbox!
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 bg-white text-gray-900 border-0 focus-visible:ring-white"
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 h-12 px-8"
                >
                  Subscribe
                </Button>
              </form>
              
              <p className="text-sm mt-4 text-green-100">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </div>
        </section>

        <EcomFooter />
      </div>
    </>
  );
};

export default EcomHomePage;