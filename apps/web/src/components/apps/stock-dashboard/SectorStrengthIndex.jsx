import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Code2, TrendingUp, Building2, Car, Zap, Pill, ShoppingCart, Shovel as Pickaxe, Lightbulb, Home, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const sectorsData = [
  {
    id: 'energy', name: 'Energy', icon: Zap, performance: '+2.4%', trend: 'up',
    companies: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2941.74, change: '+1.5%' },
      { symbol: 'ONGC', name: 'Oil & Natural Gas', price: 273.25, change: '+3.2%' },
      { symbol: 'POWERGRID', name: 'Power Grid Corp', price: 284.39, change: '+0.8%' },
      { symbol: 'NTPC', name: 'NTPC Limited', price: 345.15, change: '+2.1%' },
    ]
  },
  {
    id: 'it', name: 'IT', icon: Code2, performance: '-1.8%', trend: 'down',
    companies: [
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3950.45, change: '-1.2%' },
      { symbol: 'INFY', name: 'Infosys Limited', price: 1450.20, change: '-2.8%' },
      { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1560.80, change: '-0.5%' },
      { symbol: 'WIPRO', name: 'Wipro Limited', price: 460.80, change: '-1.3%' },
    ]
  },
  {
    id: 'finance', name: 'Finance', icon: TrendingUp, performance: '+1.1%', trend: 'up',
    companies: [
      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1450.10, change: '+2.1%' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1042.50, change: '+1.5%' },
      { symbol: 'AXISBANK', name: 'Axis Bank', price: 1050.30, change: '+0.9%' },
      { symbol: 'SBIN', name: 'State Bank of India', price: 750.00, change: '-0.2%' },
    ]
  },
  {
    id: 'infra', name: 'Infrastructure', icon: Building2, performance: '-0.5%', trend: 'down',
    companies: [
      { symbol: 'LT', name: 'Larsen & Toubro', price: 3650.80, change: '-1.1%' },
      { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', price: 9840.00, change: '-0.5%' },
      { symbol: 'ADANIPORTS', name: 'Adani Ports', price: 1250.30, change: '+0.4%' },
      { symbol: 'GRASIM', name: 'Grasim Industries', price: 2150.15, change: '-0.8%' },
    ]
  },
  {
    id: 'auto', name: 'Auto', icon: Car, performance: '+1.5%', trend: 'up',
    companies: [
      { symbol: 'MARUTI', name: 'Maruti Suzuki', price: 11200.00, change: '-0.4%' },
      { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 980.60, change: '+3.4%' },
      { symbol: 'M&M', name: 'Mahindra & Mahindra', price: 1950.25, change: '+1.8%' },
      { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto', price: 8950.25, change: '+1.2%' },
    ]
  },
  {
    id: 'pharma', name: 'Pharma', icon: Pill, performance: '+0.9%', trend: 'up',
    companies: [
      { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', price: 1520.45, change: '+1.4%' },
      { symbol: 'DRREDDY', name: "Dr. Reddy's Labs", price: 6150.20, change: '+0.8%' },
      { symbol: 'CIPLA', name: 'Cipla Limited', price: 1460.80, change: '+1.1%' },
      { symbol: 'LUPIN', name: 'Lupin Limited', price: 1640.30, change: '-0.2%' },
    ]
  },
  {
    id: 'fmcg', name: 'FMCG', icon: ShoppingCart, performance: '+0.4%', trend: 'up',
    companies: [
      { symbol: 'ITC', name: 'ITC Limited', price: 420.75, change: '+0.5%' },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2340.50, change: '+0.1%' },
      { symbol: 'NESTLEIND', name: 'Nestle India', price: 2540.20, change: '-0.8%' },
      { symbol: 'BRITANNIA', name: 'Britannia Inds', price: 4850.50, change: '+1.2%' },
    ]
  },
  {
    id: 'metals', name: 'Metals', icon: Pickaxe, performance: '-1.8%', trend: 'down',
    companies: [
      { symbol: 'TATASTEEL', name: 'Tata Steel', price: 165.40, change: '-2.1%' },
      { symbol: 'HINDALCO', name: 'Hindalco Inds', price: 580.20, change: '-1.5%' },
      { symbol: 'JSWSTEEL', name: 'JSW Steel', price: 840.60, change: '-1.8%' },
      { symbol: 'NMDC', name: 'NMDC Limited', price: 240.30, change: '-2.4%' },
    ]
  },
  {
    id: 'utilities', name: 'Utilities', icon: Lightbulb, performance: '-0.6%', trend: 'down',
    companies: [
      { symbol: 'NTPC', name: 'NTPC Limited', price: 340.15, change: '-0.5%' },
      { symbol: 'POWERGRID', name: 'Power Grid Corp', price: 275.40, change: '-0.8%' },
      { symbol: 'ADANIPOWER', name: 'Adani Power', price: 540.30, change: '-1.2%' },
      { symbol: 'TORNTPOWER', name: 'Torrent Power', price: 1150.60, change: '+0.4%' },
    ]
  },
  {
    id: 'realty', name: 'Realty', icon: Home, performance: '+3.2%', trend: 'up',
    companies: [
      { symbol: 'DLF', name: 'DLF Limited', price: 890.45, change: '+4.1%' },
      { symbol: 'GODREJPROP', name: 'Godrej Properties', price: 2450.20, change: '+3.5%' },
      { symbol: 'PRESTIGE', name: 'Prestige Estates', price: 1260.80, change: '+2.8%' },
      { symbol: 'BRIGADE', name: 'Brigade Enterprises', price: 1040.30, change: '+2.1%' },
    ]
  }
];

export default function SectorStrengthIndex() {
  const [activeSectorId, setActiveSectorId] = useState(sectorsData[0].id);
  const scrollContainerRef = useRef(null);

  const activeSector = sectorsData.find(s => s.id === activeSectorId) || sectorsData[0];
  const ActiveIcon = activeSector.icon;

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280; // approximate width of one company card + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Card className="w-full shadow-sm bg-card border-border flex flex-col mt-6 overflow-hidden">
      {/* Top Section: Header & Company Carousel */}
      <CardHeader className="shrink-0 flex flex-row items-center justify-between pb-4 border-b border-border/50 bg-background">
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
          <div className={`p-2 rounded-lg ${activeSector.trend === 'up' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : 'bg-rose-500/10 text-rose-600 dark:text-rose-500'}`}>
            <ActiveIcon className="w-5 h-5" />
          </div>
          {activeSector.name} Sector Movers
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-background hover:bg-muted"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-background hover:bg-muted"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col">
        {/* Company Cards Carousel */}
        <div className="relative bg-muted/10 py-6">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />
          
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 px-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <AnimatePresence mode="wait">
              {activeSector.companies.map((company, index) => {
                const isPositive = company.change.startsWith('+');
                return (
                  <motion.div 
                    key={`${activeSector.id}-${company.symbol}`}
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="snap-start shrink-0 w-[260px] border border-border rounded-xl bg-background p-4 flex flex-col gap-2 hover:shadow-md transition-all hover:border-primary/40 cursor-default"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm text-foreground bg-muted px-2 py-0.5 rounded">
                        {company.symbol}
                      </span>
                      <span className={`text-sm font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
                        isPositive 
                          ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' 
                          : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10'
                      }`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {company.change.replace('+', '').replace('-', '')}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground truncate" title={company.name}>
                      {company.name}
                    </span>
                    <div className="mt-1 flex items-end justify-between">
                      <span className="font-bold text-lg text-foreground">
                        ₹{company.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Section: Sector Tabs */}
        <div className="p-6 border-t border-border/50 bg-background">
          <h4 className="text-sm font-semibold text-muted-foreground mb-4">Market Sectors</h4>
          <div className="flex flex-wrap gap-3">
            {sectorsData.map((sector) => {
              const Icon = sector.icon;
              const isSelected = activeSectorId === sector.id;
              const isPositive = sector.trend === 'up';
              
              return (
                <button
                  key={sector.id}
                  onClick={() => setActiveSectorId(sector.id)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200
                    hover:scale-105 active:scale-95 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/50
                    ${isSelected ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-background' : 'hover:border-primary/30'}
                    ${isPositive 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300' 
                      : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300'
                    }
                  `}
                >
                  {isSelected && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className={`absolute inset-0 opacity-15 ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-4 h-4 z-10" />
                  <span className="font-semibold text-sm z-10">{sector.name}</span>
                  <span className={`text-xs font-bold z-10 px-1.5 py-0.5 rounded-md flex items-center ${
                    isPositive 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' 
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300'
                  }`}>
                    {sector.performance}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Insights Message Footer */}
        <div className="p-4 border-t border-border/50 text-center bg-muted/30">
          <p className="text-xs text-muted-foreground font-medium italic flex items-center justify-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI Market Insights are updated every 60 seconds based on live BSE volatility metrics.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}