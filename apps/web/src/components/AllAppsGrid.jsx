import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { appsData, appCategories } from '@/data/appsData';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function AllAppsGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredApps = useMemo(() => {
    return appsData.filter(app => {
      const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleAppClick = (app) => {
    toast({
      title: `Opening ${app.title}`,
      description: "Redirecting to application module...",
    });
    navigate(app.path);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 flex flex-col space-y-6">
      
      <div>
        <h2 className="text-3xl font-extrabold text-[hsl(var(--dark-green))] flex items-center gap-3">
          <LayoutGrid className="w-8 h-8" />
          Application Directory
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Access your comprehensive suite of tools and solutions.
        </p>
      </div>

      <div className="relative w-full max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input 
          placeholder="Search applications..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 bg-card border-border focus-visible:ring-[hsl(var(--dark-green))] shadow-sm text-base"
        />
      </div>

      <div className="w-full">
        <Tabs defaultValue="All" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto bg-transparent h-auto p-0 flex-nowrap border-b border-border/50 rounded-none pb-px space-x-2 scrollbar-hide">
            <TabsTrigger 
              value="All"
              className="rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--dark-green))] data-[state=active]:bg-[hsl(var(--dark-green))]/5 px-6 py-3 text-muted-foreground data-[state=active]:text-[hsl(var(--dark-green))] font-medium transition-all"
            >
              All Apps
              <span className="ml-2 bg-[hsl(var(--dark-green))]/10 text-[hsl(var(--dark-green))] text-xs py-0.5 px-2 rounded-full">
                {appsData.length}
              </span>
            </TabsTrigger>
            {appCategories.map(category => {
              const count = appsData.filter(a => a.category === category).length;
              return (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--dark-green))] data-[state=active]:bg-[hsl(var(--dark-green))]/5 px-6 py-3 text-muted-foreground data-[state=active]:text-[hsl(var(--dark-green))] font-medium transition-all whitespace-nowrap"
                >
                  {category}
                  <span className="ml-2 bg-[hsl(var(--dark-green))]/10 text-[hsl(var(--dark-green))] text-xs py-0.5 px-2 rounded-full">
                    {count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      <div className="pt-4">
        <h3 className="text-2xl font-bold text-foreground mb-6">My Apps</h3>
        
        {filteredApps.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed border-border shadow-sm">
            <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground">No applications found</h3>
            <p className="text-muted-foreground mt-2">We couldn't find any applications matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-6 border-[hsl(var(--dark-green))] text-[hsl(var(--dark-green))] hover:bg-[hsl(var(--dark-green))] hover:text-white"
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredApps.map((app) => {
                const Icon = app.icon;
                return (
                  <motion.div
                    key={app.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ y: -6 }}
                    onClick={() => handleAppClick(app)}
                    className="group bg-card rounded-2xl p-6 border border-border hover:border-[hsl(var(--dark-green))]/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                      <div className="bg-[hsl(var(--dark-green))]/10 p-2 rounded-full text-[hsl(var(--dark-green))]">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="w-14 h-14 bg-[hsl(var(--dark-green))]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[hsl(var(--dark-green))] transition-colors duration-300">
                      {Icon && <Icon className="w-7 h-7 text-[hsl(var(--dark-green))] group-hover:text-white transition-colors duration-300" />}
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-[hsl(var(--dark-green))] transition-colors mb-2">
                        {app.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                        {app.description}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-border/50">
                        <span className="inline-flex items-center justify-center font-semibold text-[hsl(var(--dark-green))] text-sm group-hover:text-[hsl(var(--dark-green-hover))] transition-colors w-full bg-[hsl(var(--dark-green))]/5 hover:bg-[hsl(var(--dark-green))]/10 py-2 rounded-lg">
                          Access App
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

    </div>
  );
}