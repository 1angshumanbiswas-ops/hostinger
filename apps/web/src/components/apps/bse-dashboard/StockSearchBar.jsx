import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function StockSearchBar({ value, onChange }) {
  return (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input 
        placeholder="Search BSE symbols or companies..." 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 bg-card w-full"
      />
    </div>
  );
}