import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { useCommodityFavorites } from '@/hooks/CommodityFavoritesManager';

const CommoditiesTable = ({ data, category, onSelectCommodity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { favorites, toggleFavorite } = useCommodityFavorites();

  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search commodities..." 
          className="pl-9 bg-white border-orange-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="bg-white rounded-xl border border-orange-200/50 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h Change</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.symbol} className="hover:bg-orange-50/50 cursor-pointer transition-colors" onClick={() => onSelectCommodity(item)}>
                <TableCell onClick={(e) => { e.stopPropagation(); toggleFavorite(item.symbol); }}>
                  <Star className={`w-5 h-5 ${favorites.includes(item.symbol) ? 'fill-orange-500 text-orange-500' : 'text-slate-300 hover:text-orange-400'}`} />
                </TableCell>
                <TableCell>
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-500">{item.symbol} &bull; {item.unit}</div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600">
                    {item.category}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  ${item.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end gap-1 font-medium ${item.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(item.changePercent).toFixed(2)}%
                  </div>
                </TableCell>
                <TableCell className="text-right text-slate-500 tabular-nums">
                  {item.volume.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={(e) => { e.stopPropagation(); onSelectCommodity(item); }}>
                    Trade
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                  No commodities found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CommoditiesTable;