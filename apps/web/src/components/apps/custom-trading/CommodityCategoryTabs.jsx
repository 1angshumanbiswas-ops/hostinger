import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categories = [
  "All",
  "Precious Metals",
  "Industrial Metals",
  "Energy",
  "Agriculture",
  "Livestock"
];

const CommodityCategoryTabs = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <Tabs value={activeCategory} onValueChange={onSelectCategory} className="w-full">
        <TabsList className="bg-white/50 border border-orange-200/50 flex space-x-2 p-1 min-w-max">
          {categories.map(cat => (
            <TabsTrigger 
              key={cat} 
              value={cat}
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-950 font-medium"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CommodityCategoryTabs;