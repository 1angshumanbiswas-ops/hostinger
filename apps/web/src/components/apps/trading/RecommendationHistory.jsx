import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getLatestRecommendations } from '@/utils/AIAnalysisEngine';
import { CheckCircle2, Circle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const RecommendationHistory = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getLatestRecommendations().then(setHistory);
  }, []);

  const toggleExecuted = (id) => {
    setHistory(history.map(item => 
      item.id === id ? { ...item, executed: !item.executed } : item
    ));
  };

  const filtered = history.filter(h => h.asset_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input 
            placeholder="Search assets..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map(item => (
          <Card key={item.id} className={`transition-colors ${item.executed ? 'bg-slate-50' : ''}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => toggleExecuted(item.id)} className="text-slate-400 hover:text-green-600">
                  {item.executed ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6" />}
                </button>
                <div>
                  <h4 className="font-bold">{item.asset_name}</h4>
                  <p className="text-sm text-slate-500">Target: ${item.target_price} | Conf: {item.confidence_score}%</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded ${item.executed ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                  {item.executed ? 'Executed' : 'Pending'}
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(item.created_at || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center p-8 text-slate-500">No recommendations found.</div>
        )}
      </div>
    </div>
  );
};

export default RecommendationHistory;