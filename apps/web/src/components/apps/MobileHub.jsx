import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Star, Check, ShoppingCart, Filter, ArrowRightLeft, X, Battery, Cpu, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

// --- Mock Data ---
const FEATURED_PHONES = [
  {
    id: 1,
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    price: 159900,
    rating: 4.8,
    reviews: 1250,
    specs: {
      processor: 'A17 Pro',
      camera: '48MP + 12MP + 12MP',
      battery: '4422 mAh',
      display: '6.7" Super Retina XDR',
      storage: '256GB'
    },
    tags: ['Premium', '5G', 'Best Camera'],
    image: 'https://images.unsplash.com/photo-1695048064980-cbdc9c152505',
    imageAlt: 'Titanium iPhone 15 Pro Max back view showing its sleek camera system',
    colors: ['#4b4b4b', '#f2f2f2', '#1a1a1a']
  },
  {
    id: 2,
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    price: 129999,
    rating: 4.7,
    reviews: 890,
    specs: {
      processor: 'Snapdragon 8 Gen 3',
      camera: '200MP + 50MP + 12MP',
      battery: '5000 mAh',
      display: '6.8" QHD+ Dynamic AMOLED',
      storage: '512GB'
    },
    tags: ['S-Pen', 'AI Features', 'Android King'],
    image: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00',
    imageAlt: 'Samsung Galaxy S24 Ultra displaying its large screen and professional design',
    colors: ['#f5f5f5', '#333333', '#e6c300']
  },
  {
    id: 3,
    brand: 'Google',
    model: 'Pixel 8 Pro',
    price: 106999,
    rating: 4.6,
    reviews: 640,
    specs: {
      processor: 'Google Tensor G3',
      camera: '50MP + 48MP + 48MP',
      battery: '5050 mAh',
      display: '6.7" LTPO OLED',
      storage: '128GB'
    },
    tags: ['Clean Android', 'AI Camera', 'Best Software'],
    image: 'https://images.unsplash.com/photo-1697514420922-bf66526448c7',
    imageAlt: 'Google Pixel 8 Pro showcasing its unique camera bar and elegant finish',
    colors: ['#e8e8e8', '#383838', '#8cb4f5']
  },
  {
    id: 4,
    brand: 'OnePlus',
    model: 'OnePlus 12',
    price: 64999,
    rating: 4.5,
    reviews: 450,
    specs: {
      processor: 'Snapdragon 8 Gen 3',
      camera: '50MP + 64MP + 48MP',
      battery: '5400 mAh',
      display: '6.82" ProXDR',
      storage: '256GB'
    },
    tags: ['Fast Charging', 'Flagship Killer', 'Value'],
    image: 'https://images.unsplash.com/photo-1658756655599-80410dbba1ec',
    imageAlt: 'OnePlus 12 emerald green back with high-performance specs',
    colors: ['#0f392b', '#1a1a1a']
  },
  {
    id: 5,
    brand: 'Nothing',
    model: 'Nothing Phone (2)',
    price: 36999,
    rating: 4.3,
    reviews: 320,
    specs: {
      processor: 'Snapdragon 8+ Gen 1',
      camera: '50MP + 50MP',
      battery: '4700 mAh',
      display: '6.7" Flexible OLED',
      storage: '256GB'
    },
    tags: ['Unique Design', 'Glyph Interface', 'Mid-Range'],
    image: 'https://images.unsplash.com/photo-1694198336042-7199858912d3',
    imageAlt: 'Nothing Phone 2 with unique transparent back and glyph lighting',
    colors: ['#ffffff', '#222222']
  },
  {
    id: 6,
    brand: 'Xiaomi',
    model: 'Xiaomi 14 Ultra',
    price: 99999,
    rating: 4.6,
    reviews: 210,
    specs: {
      processor: 'Snapdragon 8 Gen 3',
      camera: '50MP Quad Leica',
      battery: '5000 mAh',
      display: '6.73" AMOLED',
      storage: '512GB'
    },
    tags: ['Leica Camera', 'Photography', 'Premium Build'],
    image: 'https://images.unsplash.com/photo-1598327105686-be444f3dc064',
    imageAlt: 'Xiaomi 14 Ultra featuring its massive Leica-branded camera module',
    colors: ['#000000', '#ffffff']
  }
];

const FilterSheet = ({ isOpen, onOpenChange, filters, setFilters }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Mobiles</SheetTitle>
          <SheetDescription>
            Narrow down your search by brand, price, and features.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Brand Filter */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-slate-900">Brands</h4>
            <div className="space-y-2">
              {['Apple', 'Samsung', 'Google', 'OnePlus', 'Nothing', 'Xiaomi'].map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`brand-${brand}`} 
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={(checked) => {
                      setFilters(prev => ({
                        ...prev,
                        brands: checked 
                          ? [...prev.brands, brand]
                          : prev.brands.filter(b => b !== brand)
                      }));
                    }}
                  />
                  <label htmlFor={`brand-${brand}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-4">
             <h4 className="font-medium text-sm text-slate-900">Price Range (₹)</h4>
             <Slider 
                defaultValue={[0, 200000]} 
                max={200000} 
                step={5000}
                value={filters.priceRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
             />
             <div className="flex justify-between text-xs text-slate-500">
                <span>₹{filters.priceRange[0].toLocaleString()}</span>
                <span>₹{filters.priceRange[1].toLocaleString()}</span>
             </div>
          </div>

          {/* Min Rating */}
           <div className="space-y-3">
            <h4 className="font-medium text-sm text-slate-900">Minimum Rating</h4>
            <div className="flex gap-2">
               {[3, 4, 4.5].map((rating) => (
                  <Button 
                    key={rating}
                    variant={filters.minRating === rating ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                    className="flex-1"
                  >
                    {rating}+ <Star className="w-3 h-3 ml-1 fill-current" />
                  </Button>
               ))}
            </div>
          </div>
        </div>

        <SheetFooter>
           <div className="flex w-full gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setFilters({ brands: [], priceRange: [0, 200000], minRating: 0 })}>Reset</Button>
              <SheetClose asChild>
                <Button type="submit" className="flex-1">Apply Filters</Button>
              </SheetClose>
           </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const ComparisonBar = ({ selectedPhones, phones, onClear, onRemove }) => {
  if (selectedPhones.length === 0) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-4 rounded-xl shadow-2xl z-50 w-[90%] max-w-3xl border border-slate-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="flex -space-x-2">
              {selectedPhones.map(id => {
                const phone = phones.find(p => p.id === id);
                return (
                  <div key={id} className="relative w-10 h-10 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center overflow-hidden">
                     {phone?.image ? (
                       <img 
                         src={phone.image} 
                         alt={phone.model} 
                         className="w-full h-full object-cover" 
                         onError={(e) => {
                           e.target.onerror = null;
                           e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&q=80'; // Fallback image
                         }}
                       />
                     ) : (
                       <Smartphone className="w-5 h-5 text-slate-400" />
                     )}
                  </div>
                );
              })}
           </div>
           <div>
             <h4 className="font-bold text-sm">Compare ({selectedPhones.length}/3)</h4>
             <p className="text-xs text-slate-400">Select up to 3 devices to compare specs</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" onClick={onClear} className="text-slate-300 hover:text-white hover:bg-slate-800">Clear</Button>
           <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Compare Now</Button>
        </div>
      </div>
    </motion.div>
  );
};

const MobileHub = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: [0, 200000],
    minRating: 0
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [compareList, setCompareList] = useState([]);

  // Filter Logic
  const filteredProducts = FEATURED_PHONES.filter(phone => {
    const brandMatch = filters.brands.length === 0 || filters.brands.includes(phone.brand);
    const priceMatch = phone.price >= filters.priceRange[0] && phone.price <= filters.priceRange[1];
    const ratingMatch = phone.rating >= filters.minRating;
    return brandMatch && priceMatch && ratingMatch;
  });

  const toggleCompare = (id) => {
    if (compareList.includes(id)) {
      setCompareList(prev => prev.filter(pId => pId !== id));
    } else {
      if (compareList.length >= 3) {
        toast({
          title: "Comparison Limit Reached",
          description: "You can compare up to 3 devices at a time.",
          variant: "destructive"
        });
        return;
      }
      setCompareList(prev => [...prev, id]);
      toast({
        title: "Added to Compare",
        description: "Device added to comparison list.",
      });
    }
  };

  const handleBuyNow = (phoneModel) => {
    toast({
      title: "Feature Coming Soon!",
      description: `Checkout integration for ${phoneModel} is currently under development.`,
    });
  };

  return (
    <div className="space-y-6 relative pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Featured Mobiles</h2>
           <p className="text-sm text-slate-500">Compare specifications and find your perfect device</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none gap-2" onClick={() => setIsFilterOpen(true)}>
            <Filter className="w-4 h-4" /> Filter
            {(filters.brands.length > 0 || filters.minRating > 0) && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                !
              </Badge>
            )}
          </Button>
          <Button 
            variant={compareList.length > 0 ? "default" : "outline"} 
            className="flex-1 sm:flex-none gap-2"
            onClick={() => {
              if (compareList.length < 2) {
                 toast({ description: "Select at least 2 devices to compare." });
              }
            }}
          >
            <ArrowRightLeft className="w-4 h-4" /> Compare
            {compareList.length > 0 && <Badge className="ml-1 bg-white text-slate-900 hover:bg-white">{compareList.length}</Badge>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <motion.div 
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Product Image Area */}
              <div className="relative bg-slate-50 h-64 flex items-center justify-center p-8 group-hover:bg-slate-100 transition-colors">
                <div className="w-full h-full relative z-10 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                   <img 
                    alt={product.imageAlt} 
                    className="max-h-full max-w-full object-contain drop-shadow-lg rounded-lg" 
                    src={product.image} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'; // Fallback image
                    }}
                   />
                </div>
                
                {/* Floating Tags */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                   {product.tags.slice(0, 2).map(tag => (
                     <span key={tag} className="bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-md shadow-sm text-slate-700 border border-slate-100">
                       {tag}
                     </span>
                   ))}
                </div>

                {/* Compare Checkbox Overlay */}
                <div className="absolute top-4 right-4 z-20">
                   <Checkbox 
                     checked={compareList.includes(product.id)}
                     onCheckedChange={() => toggleCompare(product.id)}
                     className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-5 h-5 border-2 border-slate-300 bg-white"
                   />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">{product.brand}</p>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{product.model}</h3>
                  </div>
                  <div className="flex flex-col items-end">
                     <div className="flex items-center bg-green-50 px-2 py-1 rounded-md border border-green-100 mb-1">
                        <span className="text-sm font-bold text-green-700 mr-1">{product.rating}</span>
                        <Star className="w-3 h-3 text-green-600 fill-green-600" />
                     </div>
                     <span className="text-[10px] text-slate-400">{product.reviews} reviews</span>
                  </div>
                </div>
                
                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 my-5 py-4 border-y border-slate-100">
                   <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Cpu className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{product.specs.processor}</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Battery className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{product.specs.battery}</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Camera className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">Triple Cam</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{product.specs.storage}</span>
                   </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                     <span className="text-xs text-slate-400 line-through">₹{(product.price * 1.1).toFixed(0)}</span>
                     <span className="text-xl font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                    onClick={() => handleBuyNow(product.model)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Buy Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredProducts.length === 0 && (
           <div className="col-span-full py-20 text-center flex flex-col items-center justify-center text-slate-500">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                 <Filter className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Mobiles Found</h3>
              <p className="max-w-xs mx-auto mt-2 text-sm">Try adjusting your filters to see more results.</p>
              <Button 
                variant="link" 
                className="mt-4 text-blue-600"
                onClick={() => setFilters({ brands: [], priceRange: [0, 200000], minRating: 0 })}
              >
                 Clear all filters
              </Button>
           </div>
        )}
      </div>

      <FilterSheet 
        isOpen={isFilterOpen} 
        onOpenChange={setIsFilterOpen} 
        filters={filters}
        setFilters={setFilters}
      />

      <AnimatePresence>
         {compareList.length > 0 && (
            <ComparisonBar 
              selectedPhones={compareList} 
              phones={FEATURED_PHONES}
              onClear={() => setCompareList([])}
              onRemove={toggleCompare}
            />
         )}
      </AnimatePresence>
    </div>
  );
};

export default MobileHub;