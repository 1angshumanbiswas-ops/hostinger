import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

export default function StockFilterPanel({ filters, setFilters, sectors }) {
  // Define BSE-specific sectors only
  const bseSectors = [
    'Automobile',
    'Banking',
    'Cement',
    'Chemicals',
    'Consumer Goods',
    'Energy',
    'FMCG',
    'Information Technology',
    'Metals',
    'Pharma',
    'Realty',
    'Telecom',
    'Textiles',
    'Utilities'
  ];

  // Merge available sectors from data with BSE predefined list
  const availableSectors = [...new Set([...bseSectors, ...sectors])].sort();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center text-sm font-medium text-muted-foreground mr-2">
        <Filter className="w-4 h-4 mr-2" />
        Filters:
      </div>
      
      <Select 
        value={filters.sector} 
        onValueChange={(val) => setFilters({...filters, sector: val})}
      >
        <SelectTrigger className="w-[200px] bg-card">
          <SelectValue placeholder="All Sectors" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          <SelectItem value="All">All BSE Sectors</SelectItem>
          {availableSectors.map(sector => (
            <SelectItem key={sector} value={sector}>{sector}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={filters.recommendation} 
        onValueChange={(val) => setFilters({...filters, recommendation: val})}
      >
        <SelectTrigger className="w-[140px] bg-card">
          <SelectValue placeholder="All Signals" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Signals</SelectItem>
          <SelectItem value="BUY">Buy</SelectItem>
          <SelectItem value="SELL">Sell</SelectItem>
          <SelectItem value="HOLD">Hold</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}