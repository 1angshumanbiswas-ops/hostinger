import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Building2, Clock, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function CompanyList({ sector, companies, loading, lastUpdated }) {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    });
    return () => api.off("select", onSelect);
  }, [api, companies]);

  useEffect(() => {
    if (api) api.scrollTo(0);
  }, [sector, api]);

  if (!sector) return null;

  // Calculate top movers
  const sortedCompanies = [...companies].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  const topMovers = sortedCompanies.slice(0, 3);

  return (
    <div className="w-full bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-4 md:p-6 border border-border mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg text-foreground">{sector} Sector Companies & Movers</h3>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Calculated from constituent data.
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Real-time Unified Data
          </Badge>
          {lastUpdated && (
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <Clock className="w-3 h-3" />
              {lastUpdated.toLocaleTimeString('en-IN')}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Carousel Section */}
        <div className="lg:col-span-3 relative w-full px-8">
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full md:w-1/2 lg:w-1/3 rounded-xl shrink-0" />
              ))}
            </div>
          ) : companies.length > 0 ? (
            <Carousel setApi={setApi} opts={{ align: "start", dragFree: true }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4 py-2">
                <AnimatePresence>
                  {companies.map((company, index) => {
                    const isPositive = company.change >= 0;
                    return (
                      <CarouselItem key={company.symbol} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="h-full flex flex-col justify-between p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all data-update-flash"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-col">
                              <span className="font-extrabold text-foreground">{company.symbol}</span>
                            </div>
                            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            </div>
                          </div>
                          <div className="flex items-end justify-between mt-auto">
                            <span className="font-bold text-lg text-foreground">₹{company.price.toLocaleString('en-IN')}</span>
                            <div className={`flex items-center text-sm font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                              {isPositive ? '+' : ''}{company.changePercent}%
                            </div>
                          </div>
                        </motion.div>
                      </CarouselItem>
                    );
                  })}
                </AnimatePresence>
              </CarouselContent>
              <CarouselPrevious className="-left-4 md:-left-8 bg-background shadow-md border-border hover:bg-muted hover:text-primary transition-all" />
              <CarouselNext className="-right-4 md:-right-8 bg-background shadow-md border-border hover:bg-muted hover:text-primary transition-all" />
            </Carousel>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm bg-card rounded-xl border border-dashed border-border">
              No companies found for this sector.
            </div>
          )}
        </div>

        {/* Top Movers Section */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Top Movers</h4>
          {loading ? (
             <div className="space-y-2">
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
             </div>
          ) : topMovers.length > 0 ? (
            topMovers.map(mover => (
              <div key={`mover-${mover.symbol}`} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border shadow-sm data-update-flash">
                <span className="font-bold text-sm">{mover.symbol}</span>
                <span className={`text-sm font-bold ${mover.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {mover.change >= 0 ? '+' : ''}{mover.changePercent}%
                </span>
              </div>
            ))
          ) : (
             <div className="text-xs text-muted-foreground">No mover data available.</div>
          )}
        </div>
      </div>
    </div>
  );
}