export const products = [
  // Electronics
  {
    id: 'elec-1',
    name: 'Apple iPhone 15 Pro',
    slug: 'apple-iphone-15-pro',
    price: 129900,
    originalPrice: 134900,
    discount: 4,
    image: 'https://images.unsplash.com/photo-1696446702183-cbd90e57cc88?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 234,
    stock: 45,
    description: 'The most advanced iPhone ever with titanium design and A17 Pro chip.',
    category: 'electronics',
    brand: 'Apple',
    isFeatured: true,
    isTrending: true,
    specifications: {
      'Display': '6.1-inch Super Retina XDR',
      'Chip': 'A17 Pro',
      'Camera': '48MP Main + 12MP Ultra Wide',
      'Storage': '256GB'
    }
  },
  {
    id: 'elec-2',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    price: 124999,
    originalPrice: 129999,
    discount: 4,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 189,
    stock: 32,
    description: 'Premium flagship with S Pen and incredible camera system.',
    category: 'electronics',
    brand: 'Samsung',
    isFeatured: true,
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'Camera': '200MP Main',
      'RAM': '12GB'
    }
  },
  {
    id: 'elec-3',
    name: 'Sony WH-1000XM5 Headphones',
    slug: 'sony-wh-1000xm5',
    price: 29990,
    originalPrice: 34990,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop',
    rating: 4.9,
    reviews: 567,
    stock: 78,
    description: 'Industry-leading noise cancellation with premium sound quality.',
    category: 'electronics',
    brand: 'Sony',
    isTrending: true,
    specifications: {
      'Type': 'Over-ear wireless',
      'Battery': '30 hours',
      'Connectivity': 'Bluetooth 5.2',
      'Features': 'Active Noise Cancellation'
    }
  },
  {
    id: 'elec-4',
    name: 'Apple MacBook Air M3',
    slug: 'macbook-air-m3',
    price: 114900,
    originalPrice: 119900,
    discount: 4,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 342,
    stock: 23,
    description: 'Strikingly thin and fast with M3 chip for incredible performance.',
    category: 'electronics',
    brand: 'Apple',
    isFeatured: true,
    specifications: {
      'Chip': 'Apple M3',
      'Display': '13.6-inch Liquid Retina',
      'Memory': '8GB',
      'Storage': '256GB SSD'
    }
  },
  {
    id: 'elec-5',
    name: 'iPad Pro 12.9-inch M2',
    slug: 'ipad-pro-129-m2',
    price: 109900,
    originalPrice: 112900,
    discount: 3,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 198,
    stock: 34,
    description: 'Ultimate iPad experience with M2 chip and stunning display.',
    category: 'electronics',
    brand: 'Apple',
    specifications: {
      'Display': '12.9-inch Liquid Retina XDR',
      'Chip': 'Apple M2',
      'Storage': '256GB',
      'Connectivity': 'Wi-Fi 6E'
    }
  },
  {
    id: 'elec-6',
    name: 'Samsung 55" QLED 4K TV',
    slug: 'samsung-55-qled-4k',
    price: 64990,
    originalPrice: 74990,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 267,
    stock: 19,
    description: 'Quantum Dot technology with stunning 4K resolution.',
    category: 'electronics',
    brand: 'Samsung',
    isTrending: true,
    specifications: {
      'Screen Size': '55 inches',
      'Resolution': '4K Ultra HD',
      'Technology': 'QLED',
      'Refresh Rate': '120Hz'
    }
  },
  {
    id: 'elec-7',
    name: 'Canon EOS R6 Mark II',
    slug: 'canon-eos-r6-mark-ii',
    price: 239999,
    originalPrice: 249999,
    discount: 4,
    image: 'https://images.unsplash.com/photo-1606980596584-5656b5fe1954?w=500&h=500&fit=crop',
    rating: 4.9,
    reviews: 124,
    stock: 8,
    description: 'Professional full-frame mirrorless camera with advanced autofocus.',
    category: 'electronics',
    brand: 'Canon',
    specifications: {
      'Sensor': '24.2MP Full-Frame CMOS',
      'Video': '4K 60p',
      'Autofocus': 'Dual Pixel CMOS AF II',
      'Stabilization': 'In-body 5-axis'
    }
  },
  {
    id: 'elec-8',
    name: 'Dell XPS 15 Laptop',
    slug: 'dell-xps-15',
    price: 149999,
    originalPrice: 159999,
    discount: 6,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 289,
    stock: 15,
    description: 'Premium laptop with stunning InfinityEdge display.',
    category: 'electronics',
    brand: 'Dell',
    specifications: {
      'Processor': 'Intel Core i7-13700H',
      'RAM': '16GB DDR5',
      'Storage': '512GB SSD',
      'Display': '15.6" FHD+'
    }
  },
  {
    id: 'elec-9',
    name: 'Apple Watch Series 9',
    slug: 'apple-watch-series-9',
    price: 41900,
    originalPrice: 44900,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 456,
    stock: 67,
    description: 'Advanced health features with always-on Retina display.',
    category: 'electronics',
    brand: 'Apple',
    isFeatured: true,
    specifications: {
      'Display': 'Always-On Retina LTPO',
      'Chip': 'S9 SiP',
      'Sensors': 'ECG, Blood Oxygen',
      'Water Resistance': '50 meters'
    }
  },
  {
    id: 'elec-10',
    name: 'Bose SoundLink Revolve+',
    slug: 'bose-soundlink-revolve-plus',
    price: 24990,
    originalPrice: 29990,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 334,
    stock: 42,
    description: 'Portable Bluetooth speaker with 360-degree sound.',
    category: 'electronics',
    brand: 'Bose',
    specifications: {
      'Type': 'Portable Bluetooth Speaker',
      'Battery': '16 hours',
      'Water Resistance': 'IPX4',
      'Connectivity': 'Bluetooth, NFC'
    }
  },

  // Fashion
  {
    id: 'fash-1',
    name: "Levi's 501 Original Jeans",
    slug: 'levis-501-jeans',
    price: 3999,
    originalPrice: 4999,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 678,
    stock: 156,
    description: 'Iconic straight-fit jeans with button fly.',
    category: 'fashion',
    brand: "Levi's",
    isTrending: true,
    specifications: {
      'Fit': 'Straight',
      'Material': '100% Cotton Denim',
      'Closure': 'Button Fly',
      'Wash': 'Medium Blue'
    }
  },
  {
    id: 'fash-2',
    name: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    price: 12995,
    originalPrice: 14995,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 892,
    stock: 89,
    description: 'Lifestyle shoes with Max Air cushioning.',
    category: 'fashion',
    brand: 'Nike',
    isFeatured: true,
    specifications: {
      'Type': 'Lifestyle Sneakers',
      'Cushioning': 'Max Air Unit',
      'Upper': 'Mesh and Synthetic',
      'Sole': 'Rubber'
    }
  },
  {
    id: 'fash-3',
    name: 'Adidas Originals Hoodie',
    slug: 'adidas-hoodie',
    price: 3499,
    originalPrice: 4499,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 445,
    stock: 234,
    description: 'Classic pullover hoodie with kangaroo pocket.',
    category: 'fashion',
    brand: 'Adidas',
    specifications: {
      'Material': '70% Cotton, 30% Polyester',
      'Fit': 'Regular',
      'Features': 'Kangaroo Pocket, Drawstring Hood',
      'Care': 'Machine Wash'
    }
  },
  {
    id: 'fash-4',
    name: 'Ray-Ban Aviator Sunglasses',
    slug: 'rayban-aviator',
    price: 8990,
    originalPrice: 10990,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 1234,
    stock: 67,
    description: 'Classic aviator sunglasses with 100% UV protection.',
    category: 'fashion',
    brand: 'Ray-Ban',
    isFeatured: true,
    specifications: {
      'Lens': 'Glass G-15',
      'Frame': 'Metal',
      'UV Protection': '100%',
      'Polarized': 'Yes'
    }
  },
  {
    id: 'fash-5',
    name: 'Zara Printed Midi Dress',
    slug: 'zara-midi-dress',
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop',
    rating: 4.4,
    reviews: 567,
    stock: 123,
    description: 'Flowy midi dress with floral print.',
    category: 'fashion',
    brand: 'Zara',
    specifications: {
      'Length': 'Midi',
      'Pattern': 'Floral',
      'Sleeve': 'Short Sleeve',
      'Occasion': 'Casual, Party'
    }
  },
  {
    id: 'fash-6',
    name: 'H&M Slim Fit Chinos',
    slug: 'hm-chinos',
    price: 1999,
    originalPrice: 2499,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=500&fit=crop',
    rating: 4.3,
    reviews: 389,
    stock: 234,
    description: 'Versatile chino pants in slim fit.',
    category: 'fashion',
    brand: 'H&M',
    specifications: {
      'Fit': 'Slim',
      'Material': 'Cotton Twill',
      'Pockets': 'Side and Back',
      'Closure': 'Zip Fly'
    }
  },
  {
    id: 'fash-7',
    name: 'Puma Running Jacket',
    slug: 'puma-jacket',
    price: 2799,
    originalPrice: 3499,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 267,
    stock: 156,
    description: 'Lightweight running jacket with reflective details.',
    category: 'fashion',
    brand: 'Puma',
    specifications: {
      'Material': 'Polyester',
      'Features': 'Reflective Trim, Zip Pockets',
      'Weather': 'Wind Resistant',
      'Fit': 'Athletic'
    }
  },
  {
    id: 'fash-8',
    name: 'Tommy Hilfiger Polo Shirt',
    slug: 'tommy-polo',
    price: 2499,
    originalPrice: 2999,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 512,
    stock: 289,
    description: 'Classic polo shirt with signature flag logo.',
    category: 'fashion',
    brand: 'Tommy Hilfiger',
    specifications: {
      'Material': 'Cotton Pique',
      'Collar': 'Ribbed Polo',
      'Fit': 'Regular',
      'Logo': 'Embroidered Flag'
    }
  },
  {
    id: 'fash-9',
    name: 'Calvin Klein Leather Belt',
    slug: 'ck-belt',
    price: 1999,
    originalPrice: 2499,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1624222247344-406a3a9b7f8c?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 234,
    stock: 345,
    description: 'Genuine leather belt with reversible buckle.',
    category: 'fashion',
    brand: 'Calvin Klein',
    specifications: {
      'Material': 'Genuine Leather',
      'Width': '35mm',
      'Buckle': 'Reversible',
      'Color': 'Black/Brown'
    }
  },
  {
    id: 'fash-10',
    name: 'Michael Kors Handbag',
    slug: 'mk-handbag',
    price: 14999,
    originalPrice: 19999,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 678,
    stock: 45,
    description: 'Premium leather tote bag with gold hardware.',
    category: 'fashion',
    brand: 'Michael Kors',
    isFeatured: true,
    specifications: {
      'Material': 'Saffiano Leather',
      'Closure': 'Magnetic Snap',
      'Compartments': 'Multiple',
      'Hardware': 'Gold-tone'
    }
  },

  // Grocery
  {
    id: 'groc-1',
    name: 'Organic Quinoa 1kg',
    slug: 'organic-quinoa',
    price: 399,
    originalPrice: 499,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 345,
    stock: 456,
    description: 'Premium organic quinoa rich in protein and fiber.',
    category: 'grocery',
    brand: 'Organic India',
    specifications: {
      'Weight': '1kg',
      'Type': 'Organic',
      'Protein': 'High',
      'Origin': 'India'
    }
  },
  {
    id: 'groc-2',
    name: 'Extra Virgin Olive Oil 500ml',
    slug: 'olive-oil',
    price: 599,
    originalPrice: 699,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 567,
    stock: 234,
    description: 'Cold-pressed extra virgin olive oil from Mediterranean.',
    category: 'grocery',
    brand: 'Borges',
    specifications: {
      'Volume': '500ml',
      'Type': 'Extra Virgin',
      'Processing': 'Cold Pressed',
      'Origin': 'Spain'
    }
  },
  {
    id: 'groc-3',
    name: 'Basmati Rice 5kg',
    slug: 'basmati-rice',
    price: 699,
    originalPrice: 799,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 890,
    stock: 678,
    description: 'Premium aged basmati rice with long grains.',
    category: 'grocery',
    brand: 'India Gate',
    isTrending: true,
    specifications: {
      'Weight': '5kg',
      'Grain': 'Long',
      'Aging': '2 Years',
      'Type': 'Basmati'
    }
  },
  {
    id: 'groc-4',
    name: 'Organic Honey 500g',
    slug: 'organic-honey',
    price: 349,
    originalPrice: 449,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784176?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 456,
    stock: 345,
    description: 'Pure organic honey from Himalayan regions.',
    category: 'grocery',
    brand: 'Dabur',
    specifications: {
      'Weight': '500g',
      'Type': 'Organic',
      'Source': 'Himalayan',
      'Purity': '100%'
    }
  },
  {
    id: 'groc-5',
    name: 'Almonds Premium 1kg',
    slug: 'almonds',
    price: 899,
    originalPrice: 1099,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1508062878650-88b52897f298?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 678,
    stock: 234,
    description: 'Premium California almonds, rich in nutrients.',
    category: 'grocery',
    brand: 'Happilo',
    specifications: {
      'Weight': '1kg',
      'Origin': 'California',
      'Type': 'Premium',
      'Processing': 'Raw'
    }
  },
  {
    id: 'groc-6',
    name: 'Green Tea 100 Bags',
    slug: 'green-tea',
    price: 299,
    originalPrice: 399,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 789,
    stock: 567,
    description: 'Premium green tea with antioxidants.',
    category: 'grocery',
    brand: 'Tetley',
    specifications: {
      'Quantity': '100 Bags',
      'Type': 'Green Tea',
      'Benefits': 'Antioxidants',
      'Flavor': 'Natural'
    }
  },
  {
    id: 'groc-7',
    name: 'Peanut Butter Crunchy 1kg',
    slug: 'peanut-butter',
    price: 449,
    originalPrice: 549,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 456,
    stock: 345,
    description: 'High protein peanut butter with no added sugar.',
    category: 'grocery',
    brand: 'MyFitness',
    specifications: {
      'Weight': '1kg',
      'Type': 'Crunchy',
      'Protein': '30g per 100g',
      'Sugar': 'No Added'
    }
  },
  {
    id: 'groc-8',
    name: 'Oats Rolled 1kg',
    slug: 'rolled-oats',
    price: 249,
    originalPrice: 299,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1568736421892-85029ab5b679?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 567,
    stock: 678,
    description: 'Nutritious rolled oats for healthy breakfast.',
    category: 'grocery',
    brand: 'Quaker',
    isTrending: true,
    specifications: {
      'Weight': '1kg',
      'Type': 'Rolled Oats',
      'Fiber': 'High',
      'Processing': 'Minimal'
    }
  },
  {
    id: 'groc-9',
    name: 'Dark Chocolate 70% 100g',
    slug: 'dark-chocolate',
    price: 199,
    originalPrice: 249,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 890,
    stock: 456,
    description: 'Premium dark chocolate with 70% cocoa.',
    category: 'grocery',
    brand: 'Lindt',
    specifications: {
      'Weight': '100g',
      'Cocoa': '70%',
      'Type': 'Dark Chocolate',
      'Origin': 'Swiss'
    }
  },
  {
    id: 'groc-10',
    name: 'Organic Coffee Beans 500g',
    slug: 'coffee-beans',
    price: 599,
    originalPrice: 749,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 678,
    stock: 234,
    description: 'Premium organic Arabica coffee beans.',
    category: 'grocery',
    brand: 'Blue Tokai',
    specifications: {
      'Weight': '500g',
      'Type': 'Arabica',
      'Roast': 'Medium',
      'Origin': 'India'
    }
  },

  // Home & Kitchen
  {
    id: 'home-1',
    name: 'Philips Air Fryer XXL',
    slug: 'philips-air-fryer',
    price: 14995,
    originalPrice: 17995,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 1234,
    stock: 45,
    description: 'Extra-large air fryer for healthier cooking.',
    category: 'home-kitchen',
    brand: 'Philips',
    isFeatured: true,
    specifications: {
      'Capacity': '6.2L',
      'Power': '2225W',
      'Technology': 'Rapid Air',
      'Dishwasher Safe': 'Yes'
    }
  },
  {
    id: 'home-2',
    name: 'Prestige Induction Cooktop',
    slug: 'prestige-induction',
    price: 2499,
    originalPrice: 2999,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1585237672815-8ae6beac8c0d?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 678,
    stock: 123,
    description: 'Energy-efficient induction cooktop with auto shut-off.',
    category: 'home-kitchen',
    brand: 'Prestige',
    specifications: {
      'Power': '1900W',
      'Levels': '7 Power Levels',
      'Timer': 'Yes',
      'Safety': 'Auto Shut-off'
    }
  },
  {
    id: 'home-3',
    name: 'Dyson V11 Cordless Vacuum',
    slug: 'dyson-vacuum',
    price: 46990,
    originalPrice: 49990,
    discount: 6,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 456,
    stock: 23,
    description: 'Powerful cordless vacuum with intelligent cleaning.',
    category: 'home-kitchen',
    brand: 'Dyson',
    isFeatured: true,
    specifications: {
      'Runtime': '60 minutes',
      'Suction': '185 AW',
      'Type': 'Cordless Stick',
      'Filter': 'Whole-machine HEPA'
    }
  },
  {
    id: 'home-4',
    name: 'Urban Ladder Sofa 3 Seater',
    slug: 'urban-ladder-sofa',
    price: 34999,
    originalPrice: 44999,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 234,
    stock: 12,
    description: 'Comfortable 3-seater sofa with premium upholstery.',
    category: 'home-kitchen',
    brand: 'Urban Ladder',
    specifications: {
      'Seating': '3 Seater',
      'Material': 'Fabric',
      'Frame': 'Solid Wood',
      'Warranty': '1 Year'
    }
  },
  {
    id: 'home-5',
    name: 'Bajaj Majesty Water Heater',
    slug: 'bajaj-geyser',
    price: 7499,
    originalPrice: 8999,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 567,
    stock: 67,
    description: '25L storage water heater with multiple safety features.',
    category: 'home-kitchen',
    brand: 'Bajaj',
    specifications: {
      'Capacity': '25 Liters',
      'Power': '2000W',
      'Type': 'Storage',
      'Material': 'Glass Lined Tank'
    }
  },
  {
    id: 'home-6',
    name: 'Cello Milton Insulated Bottle',
    slug: 'milton-bottle',
    price: 599,
    originalPrice: 799,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 890,
    stock: 345,
    description: 'Double-walled vacuum insulated water bottle.',
    category: 'home-kitchen',
    brand: 'Milton',
    specifications: {
      'Capacity': '1 Liter',
      'Material': 'Stainless Steel',
      'Insulation': '24 Hours Hot/Cold',
      'Leak-proof': 'Yes'
    }
  },
  {
    id: 'home-7',
    name: 'Amazon Basics Microfiber Bed Sheet',
    slug: 'amazon-bedsheet',
    price: 999,
    originalPrice: 1299,
    discount: 23,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop',
    rating: 4.4,
    reviews: 678,
    stock: 234,
    description: 'Ultra-soft microfiber double bed sheet set.',
    category: 'home-kitchen',
    brand: 'Amazon Basics',
    specifications: {
      'Size': 'Double Bed',
      'Material': 'Microfiber',
      'Thread Count': '144',
      'Set Includes': 'Bedsheet + 2 Pillowcases'
    }
  },
  {
    id: 'home-8',
    name: 'Havells Ceiling Fan',
    slug: 'havells-fan',
    price: 2199,
    originalPrice: 2799,
    discount: 21,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 456,
    stock: 89,
    description: 'Energy-efficient 1200mm ceiling fan with remote.',
    category: 'home-kitchen',
    brand: 'Havells',
    specifications: {
      'Sweep': '1200mm',
      'Power': '55W',
      'Speed': '400 RPM',
      'Remote': 'Included'
    }
  },
  {
    id: 'home-9',
    name: 'Borosil Glass Dinnerware Set',
    slug: 'borosil-dinnerware',
    price: 1799,
    originalPrice: 2299,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 345,
    stock: 156,
    description: 'Microwave and dishwasher safe glass dinner set.',
    category: 'home-kitchen',
    brand: 'Borosil',
    specifications: {
      'Pieces': '27 Pieces',
      'Material': 'Borosilicate Glass',
      'Microwave Safe': 'Yes',
      'Dishwasher Safe': 'Yes'
    }
  },
  {
    id: 'home-10',
    name: 'Kent RO Water Purifier',
    slug: 'kent-ro',
    price: 11999,
    originalPrice: 14999,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 567,
    stock: 34,
    description: 'RO+UV+UF water purifier with TDS controller.',
    category: 'home-kitchen',
    brand: 'Kent',
    isTrending: true,
    specifications: {
      'Capacity': '8 Liters',
      'Technology': 'RO+UV+UF',
      'TDS Controller': 'Yes',
      'Storage': '8L'
    }
  },

  // Sports & Fitness
  {
    id: 'sport-1',
    name: 'Decathlon Treadmill T900',
    slug: 'decathlon-treadmill',
    price: 34999,
    originalPrice: 44999,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 234,
    stock: 15,
    description: 'Motorized treadmill with cushioned deck for home workouts.',
    category: 'sports',
    brand: 'Decathlon',
    isFeatured: true,
    specifications: {
      'Motor': '2.5 HP',
      'Speed': '0.8-16 km/h',
      'Incline': '15 Levels',
      'Weight Capacity': '110 kg'
    }
  },
  {
    id: 'sport-2',
    name: 'Nivia Football Premier League',
    slug: 'nivia-football',
    price: 799,
    originalPrice: 999,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 567,
    stock: 234,
    description: 'Professional quality football for practice and matches.',
    category: 'sports',
    brand: 'Nivia',
    specifications: {
      'Size': '5',
      'Material': 'PU Synthetic',
      'Type': 'Match Ball',
      'Bladder': 'Rubber'
    }
  },
  {
    id: 'sport-3',
    name: 'Yonex Badminton Racket',
    slug: 'yonex-racket',
    price: 2999,
    originalPrice: 3499,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 456,
    stock: 89,
    description: 'Professional badminton racket with high tension strings.',
    category: 'sports',
    brand: 'Yonex',
    isTrending: true,
    specifications: {
      'Weight': '85g',
      'Flex': 'Medium',
      'Grip': 'G4',
      'Max Tension': '30 lbs'
    }
  },
  {
    id: 'sport-4',
    name: 'Kalenji Running Shoes',
    slug: 'kalenji-shoes',
    price: 1999,
    originalPrice: 2499,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    rating: 4.4,
    reviews: 678,
    stock: 156,
    description: 'Lightweight running shoes with cushioned sole.',
    category: 'sports',
    brand: 'Kalenji',
    specifications: {
      'Type': 'Running',
      'Cushioning': 'EVA Foam',
      'Upper': 'Mesh',
      'Weight': '240g'
    }
  },
  {
    id: 'sport-5',
    name: 'Burnlab Gym Bag',
    slug: 'gym-bag',
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 345,
    stock: 234,
    description: 'Spacious gym bag with separate shoe compartment.',
    category: 'sports',
    brand: 'Burnlab',
    specifications: {
      'Capacity': '40L',
      'Material': 'Polyester',
      'Compartments': 'Multiple',
      'Shoe Pocket': 'Separate'
    }
  },
  {
    id: 'sport-6',
    name: 'Cosco Cricket Bat',
    slug: 'cosco-bat',
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 456,
    stock: 123,
    description: 'Kashmir willow cricket bat for professionals.',
    category: 'sports',
    brand: 'Cosco',
    specifications: {
      'Wood': 'Kashmir Willow',
      'Size': 'Full',
      'Handle': 'Cane',
      'Grip': 'Rubber'
    }
  },
  {
    id: 'sport-7',
    name: 'Strauss Yoga Mat',
    slug: 'yoga-mat',
    price: 599,
    originalPrice: 799,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 789,
    stock: 345,
    description: 'Anti-slip yoga mat with carrying strap.',
    category: 'sports',
    brand: 'Strauss',
    specifications: {
      'Thickness': '6mm',
      'Material': 'NBR Foam',
      'Size': '183 x 61 cm',
      'Anti-slip': 'Yes'
    }
  },
  {
    id: 'sport-8',
    name: 'Boldfit Resistance Bands Set',
    slug: 'resistance-bands',
    price: 699,
    originalPrice: 999,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 567,
    stock: 456,
    description: 'Set of 5 resistance bands for strength training.',
    category: 'sports',
    brand: 'Boldfit',
    isTrending: true,
    specifications: {
      'Bands': '5 Levels',
      'Material': 'Latex',
      'Resistance': '5-50 lbs',
      'Includes': 'Bag + Handles'
    }
  },
  {
    id: 'sport-9',
    name: 'Vaux Cricket Helmet',
    slug: 'cricket-helmet',
    price: 2499,
    originalPrice: 2999,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 234,
    stock: 67,
    description: 'Premium cricket helmet with titanium grille.',
    category: 'sports',
    brand: 'Vaux',
    specifications: {
      'Material': 'ABS Shell',
      'Grille': 'Titanium',
      'Padding': 'HD Foam',
      'Ventilation': 'Yes'
    }
  },
  {
    id: 'sport-10',
    name: 'Nivia Gym Gloves',
    slug: 'gym-gloves',
    price: 399,
    originalPrice: 599,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&h=500&fit=crop',
    rating: 4.4,
    reviews: 678,
    stock: 567,
    description: 'Breathable gym gloves with wrist support.',
    category: 'sports',
    brand: 'Nivia',
    specifications: {
      'Material': 'Synthetic Leather',
      'Wrist Support': 'Yes',
      'Breathable': 'Mesh Palm',
      'Type': 'Half Finger'
    }
  },

  // Beauty & Care
  {
    id: 'beauty-1',
    name: 'Lakme Eyeconic Kajal',
    slug: 'lakme-kajal',
    price: 199,
    originalPrice: 225,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 1234,
    stock: 678,
    description: 'Smudge-proof kajal for defined eyes.',
    category: 'beauty',
    brand: 'Lakme',
    isTrending: true,
    specifications: {
      'Type': 'Kajal Pencil',
      'Features': 'Smudge-proof, Waterproof',
      'Duration': '12 Hours',
      'Color': 'Deep Black'
    }
  },
  {
    id: 'beauty-2',
    name: 'Mamaearth Vitamin C Face Wash',
    slug: 'mamaearth-facewash',
    price: 299,
    originalPrice: 399,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 890,
    stock: 456,
    description: 'Natural face wash with vitamin C for glowing skin.',
    category: 'beauty',
    brand: 'Mamaearth',
    isFeatured: true,
    specifications: {
      'Volume': '100ml',
      'Ingredients': 'Vitamin C, Turmeric',
      'Skin Type': 'All',
      'Toxin Free': 'Yes'
    }
  },
  {
    id: 'beauty-3',
    name: 'Biotique Bio Coconut Hair Oil',
    slug: 'biotique-oil',
    price: 199,
    originalPrice: 249,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 678,
    stock: 567,
    description: 'Nourishing coconut hair oil for healthy hair.',
    category: 'beauty',
    brand: 'Biotique',
    specifications: {
      'Volume': '120ml',
      'Type': 'Hair Oil',
      'Ingredients': 'Coconut, Sesame',
      'Benefits': 'Anti-dandruff'
    }
  },
  {
    id: 'beauty-4',
    name: 'Nivea Soft Light Moisturizer',
    slug: 'nivea-moisturizer',
    price: 149,
    originalPrice: 179,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 1456,
    stock: 789,
    description: 'Light moisturizing cream for all skin types.',
    category: 'beauty',
    brand: 'Nivea',
    specifications: {
      'Volume': '200ml',
      'Type': 'Moisturizer',
      'Skin Type': 'All',
      'Features': 'Non-greasy'
    }
  },
  {
    id: 'beauty-5',
    name: 'The Body Shop Tea Tree Face Mask',
    slug: 'bodyshop-mask',
    price: 1195,
    originalPrice: 1495,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 456,
    stock: 123,
    description: 'Purifying clay mask with tea tree oil.',
    category: 'beauty',
    brand: 'The Body Shop',
    isFeatured: true,
    specifications: {
      'Volume': '100ml',
      'Type': 'Clay Mask',
      'Ingredients': 'Tea Tree Oil',
      'Skin Type': 'Oily, Combination'
    }
  },
  {
    id: 'beauty-6',
    name: 'Maybelline Fit Me Foundation',
    slug: 'maybelline-foundation',
    price: 499,
    originalPrice: 599,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 789,
    stock: 234,
    description: 'Matte and poreless foundation for flawless finish.',
    category: 'beauty',
    brand: 'Maybelline',
    specifications: {
      'Volume': '18ml',
      'Type': 'Liquid Foundation',
      'Finish': 'Matte',
      'Coverage': 'Medium to Full'
    }
  },
  {
    id: 'beauty-7',
    name: 'Plum E-Luminence Face Serum',
    slug: 'plum-serum',
    price: 699,
    originalPrice: 899,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 345,
    stock: 156,
    description: 'Vitamin C face serum for bright, even skin tone.',
    category: 'beauty',
    brand: 'Plum',
    specifications: {
      'Volume': '30ml',
      'Type': 'Face Serum',
      'Key Ingredient': 'Vitamin C',
      'Vegan': 'Yes'
    }
  },
  {
    id: 'beauty-8',
    name: 'Forest Essentials Facial Cleanser',
    slug: 'forest-cleanser',
    price: 1375,
    originalPrice: 1625,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 234,
    stock: 89,
    description: 'Ayurvedic facial cleanser with sandalwood.',
    category: 'beauty',
    brand: 'Forest Essentials',
    isFeatured: true,
    specifications: {
      'Volume': '200ml',
      'Type': 'Cleanser',
      'Ingredients': 'Sandalwood, Turmeric',
      'Ayurvedic': 'Yes'
    }
  },
  {
    id: 'beauty-9',
    name: 'Himalaya Neem Face Pack',
    slug: 'himalaya-neem',
    price: 140,
    originalPrice: 175,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 1234,
    stock: 567,
    description: 'Purifying neem face pack for clear skin.',
    category: 'beauty',
    brand: 'Himalaya',
    specifications: {
      'Volume': '100g',
      'Type': 'Face Pack',
      'Key Ingredient': 'Neem, Fuller Earth',
      'Skin Type': 'Oily, Acne-prone'
    }
  },
  {
    id: 'beauty-10',
    name: 'WOW Onion Hair Oil',
    slug: 'wow-onion-oil',
    price: 449,
    originalPrice: 599,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 890,
    stock: 456,
    description: 'Black seed onion hair oil for hair growth.',
    category: 'beauty',
    brand: 'WOW',
    isTrending: true,
    specifications: {
      'Volume': '200ml',
      'Type': 'Hair Oil',
      'Key Ingredients': 'Onion, Black Seed',
      'Benefits': 'Hair Growth, Anti-hair Fall'
    }
  }
];

export const getProductById = (id) => {
  return products.find(p => p.id === id);
};

export const getProductBySlug = (slug) => {
  return products.find(p => p.slug === slug);
};

export const getProductsByCategory = (category) => {
  return products.filter(p => p.category === category);
};

export const getFeaturedProducts = () => {
  return products.filter(p => p.isFeatured);
};

export const getTrendingProducts = () => {
  return products.filter(p => p.isTrending);
};