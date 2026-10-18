import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Target, ShoppingBag, Globe, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { fetchCensusData } from '@/utils/CensusAPI';
import DataCard from './DataCard';
import SparklineChart from './SparklineChart';
import { useRefresh } from '@/contexts/RefreshContext';

const SALES_DATA = [
  { month: 'Jan', sales: 4000, leads: 2400 },
  { month: 'Feb', sales: 3000, leads: 1398 },
  { month: 'Mar', sales: 2000, leads: 9800 },
  { month: 'Apr', sales: 2780, leads: 3908 },
  { month: 'May', sales: 1890, leads: 4800 },
  { month: 'Jun', sales: 2390, leads: 3800 },
];

const PIPELINE_DATA = [
    { stage: 'Prospecting', value: 120, amount: 45000 },
    { stage: 'Qualified', value: 86, amount: 120000 },
    { stage: 'Proposal', value: 45, amount: 210000 },
    { stage: 'Negotiation', value: 24, amount: 180000 },
    { stage: 'Closed', value: 18, amount: 95000 },
];

const SalesDashboard = () => {
  const [censusData, setCensusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { registerCallback, unregisterCallback } = useRefresh();

  const loadCensus = useCallback(async () => {
    setLoading(true);
    return fetchCensusData().then(data => {
      setCensusData(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadCensus();
    registerCallback('sales', loadCensus);
    return () => unregisterCallback('sales');
  }, [loadCensus, registerCallback, unregisterCallback]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
             <h1 className="text-2xl font-bold text-slate-900">Sales & CRM</h1>
             <p className="text-slate-500">Track revenue, pipeline, and customer relationships</p>
         </div>
         <Button variant="outline" size="sm" onClick={() => loadCensus()}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
         </Button>
      </div>

      {/* --- MARKET INTELLIGENCE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Demographics Widget */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-2 shadow-lg border-blue-100 bg-blue-50/30">
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                   <Globe className="w-5 h-5 text-blue-600" />
                   Regional Market Intelligence (Census Bureau)
                </CardTitle>
             </CardHeader>
             <CardContent>
                {loading || !censusData ? (
                   <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-slate-100 animate-pulse rounded" />
                      <div className="h-20 bg-slate-100 animate-pulse rounded" />
                   </div>
                ) : (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {censusData.demographics.map((region) => (
                         <div key={region.region} className="p-3 bg-white rounded-lg border border-blue-100">
                            <p className="font-semibold text-slate-700">{region.region}</p>
                            <p className="text-xs text-slate-500 mt-1">Pop: {region.pop}</p>
                            <p className="text-xs text-slate-500">Avg Income: {region.income}</p>
                            <Badge variant="outline" className="mt-2 text-blue-600 bg-blue-50 border-blue-200">
                               +{region.growth}% Growth
                            </Badge>
                         </div>
                      ))}
                   </div>
                )}
             </CardContent>
          </Card>

          {/* Competitor Analysis Widget (Mocked for SEC EDGAR) */}
          <Card className="shadow-lg border-amber-100 bg-amber-50/30">
             <CardHeader>
                <CardTitle className="text-base">Competitor Watch</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-4">
                   {['Competitor A', 'Competitor B'].map((comp, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-amber-100">
                         <div>
                            <p className="font-medium text-slate-800">{comp}</p>
                            <p className="text-xs text-slate-500">Rev: $1.2B</p>
                         </div>
                         <div className="h-8 w-16">
                            <SparklineChart data={[20, 25, 22, 30, 28]} color="#d97706" height={32} />
                         </div>
                      </div>
                   ))}
                </div>
             </CardContent>
          </Card>
      </div>
      {/* --- END SECTION --- */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
              <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-blue-100 rounded text-blue-600"><DollarSign className="w-5 h-5"/></div>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">+12%</Badge>
                  </div>
                  <h3 className="text-2xl font-bold">$124,500</h3>
                  <p className="text-sm text-slate-500">Total Revenue (YTD)</p>
              </CardContent>
          </Card>
          <Card>
              <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-purple-100 rounded text-purple-600"><Users className="w-5 h-5"/></div>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">+5%</Badge>
                  </div>
                  <h3 className="text-2xl font-bold">1,240</h3>
                  <p className="text-sm text-slate-500">Active Customers</p>
              </CardContent>
          </Card>
          <Card>
              <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-amber-100 rounded text-amber-600"><Target className="w-5 h-5"/></div>
                      <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">-2%</Badge>
                  </div>
                  <h3 className="text-2xl font-bold">18.2%</h3>
                  <p className="text-sm text-slate-500">Conversion Rate</p>
              </CardContent>
          </Card>
          <Card>
              <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-pink-100 rounded text-pink-600"><ShoppingBag className="w-5 h-5"/></div>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">+8%</Badge>
                  </div>
                  <h3 className="text-2xl font-bold">$345</h3>
                  <p className="text-sm text-slate-500">Avg Deal Size</p>
              </CardContent>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
              <CardHeader>
                  <CardTitle>Sales Trend</CardTitle>
                  <CardDescription>Revenue vs Leads over time</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={SALES_DATA}>
                              <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis dataKey="month" axisLine={false} tickLine={false} />
                              <YAxis axisLine={false} tickLine={false} />
                              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                              <Area type="monotone" dataKey="sales" stroke="#2563eb" fillOpacity={1} fill="url(#colorSales)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle>Pipeline Funnel</CardTitle>
                  <CardDescription>Current opportunities by stage</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {PIPELINE_DATA.map((item) => (
                          <div key={item.stage} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                  <span className="font-medium text-slate-700">{item.stage}</span>
                                  <span className="text-slate-500">{item.value} deals • ${item.amount.toLocaleString()}</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-600 rounded-full" 
                                    style={{ width: `${(item.value / 120) * 100}%` }}
                                  ></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default SalesDashboard;