import React, { useState } from 'react';
import { useAllIndicesData } from '@/hooks/useAllIndicesData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Star, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const IndicesTable = ({ onSelectAsset }) => {
  const { data, loading, error } = useAllIndicesData();
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const { toast } = useToast();

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleFavorite = async (asset, e) => {
    e.stopPropagation();
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) throw new Error("Please log in to add favorites");

      const { error } = await supabase.from('user_favorites').insert([
        { user_id: user.user.id, symbol: asset.symbol }
      ]);
      if (error) throw error;
      
      toast({ title: "Added to favorites", description: `${asset.symbol} added to your favorites.` });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading && !data.length) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  const filteredData = data.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.symbol.toLowerCase().includes(search.toLowerCase()) ||
    i.region.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center gap-4 bg-slate-50">
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input 
            placeholder="Search indices & ETFs..." 
            className="pl-9 bg-white" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('name')}>Index/ETF</th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('region')}>Region</th>
              <th className="px-4 py-3 text-right cursor-pointer" onClick={() => handleSort('price')}>Price</th>
              <th className="px-4 py-3 text-right cursor-pointer" onClick={() => handleSort('changePercent')}>24h Change</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((asset) => (
              <tr 
                key={asset.symbol} 
                className="border-b border-slate-100 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                onClick={() => onSelectAsset && onSelectAsset(asset)}
              >
                <td className="px-4 py-3 font-medium text-slate-800">
                  <div className="flex items-center gap-2">
                    {asset.name} <span className="text-xs text-slate-400">{asset.symbol}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{asset.region}</td>
                <td className="px-4 py-3 text-right font-medium">${asset.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className={`px-4 py-3 text-right font-medium flex justify-end items-center gap-1 ${asset.changePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {asset.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(asset.changePercent).toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-center">
                  <Button variant="ghost" size="sm" onClick={(e) => handleFavorite(asset, e)}>
                    <Star className="w-4 h-4 text-slate-400 hover:text-indigo-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndicesTable;