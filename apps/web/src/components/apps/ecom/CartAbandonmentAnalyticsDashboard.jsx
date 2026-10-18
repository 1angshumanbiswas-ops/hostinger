import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { format, subDays } from 'date-fns';

export default function CartAbandonmentAnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const [metrics, setMetrics] = useState({ total: 0, recovered: 0, atRisk: 0, avgValue: 0 });
  const [trendData, setTrendData] = useState([]);
  const [topCarts, setTopCarts] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const dateLimit = subDays(new Date(), parseInt(timeRange)).toISOString();
      const { data, error } = await supabase
        .from('abandoned_carts')
        .select('*')
        .gte('abandoned_at', dateLimit);

      if (error) throw error;
      
      const carts = data || [];
      const recoveredCarts = carts.filter(c => c.recovered);
      
      setMetrics({
        total: carts.length,
        recovered: recoveredCarts.length,
        atRisk: carts.filter(c => !c.recovered).reduce((acc, c) => acc + Number(c.cart_value), 0),
        recoveredValue: recoveredCarts.reduce((acc, c) => acc + Number(c.cart_value), 0),
        avgValue: carts.length ? (carts.reduce((acc, c) => acc + Number(c.cart_value), 0) / carts.length) : 0
      });

      // Group by day for trend
      const grouped = carts.reduce((acc, cart) => {
        if (!cart.abandoned_at) return acc;
        const day = format(new Date(cart.abandoned_at), 'MMM dd');
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});
      
      const trend = Object.keys(grouped).map(k => ({ date: k, count: grouped[k] })).slice(-14); // last 14 days with data
      setTrendData(trend);

      // Top carts
      const sorted = [...carts].sort((a,b) => b.cart_value - a.cart_value).slice(0,5);
      setTopCarts(sorted);

    } catch (err) {
      console.error('Analytics Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const pieData = [
    { name: 'Recovered', value: metrics.recovered, color: '#22c55e' },
    { name: 'Abandoned', value: metrics.total - metrics.recovered, color: '#f59e0b' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Abandonment Analytics</h1>
          <p className="text-slate-500">Measure cart recovery performance.</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Time Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchData} variant="outline"><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}/> Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-5"><p className="text-sm text-slate-500 font-medium">Recovery Rate</p><h3 className="text-3xl font-bold text-blue-600 mt-1">{metrics.total ? ((metrics.recovered / metrics.total)*100).toFixed(1) : 0}%</h3></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-slate-500 font-medium">Value Recovered</p><h3 className="text-3xl font-bold text-green-600 mt-1">${metrics.recoveredValue?.toFixed(2) || 0}</h3></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-slate-500 font-medium">Value at Risk</p><h3 className="text-3xl font-bold text-amber-600 mt-1">${metrics.atRisk?.toFixed(2) || 0}</h3></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-slate-500 font-medium">Avg Cart Value</p><h3 className="text-3xl font-bold text-slate-800 mt-1">${metrics.avgValue?.toFixed(2) || 0}</h3></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Abandonment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recovery Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span> Recovered</span>
              <span className="flex items-center"><span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span> Lost</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-500"/> Top High-Value Abandoned Carts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCarts.map((c, i) => (
              <div key={i} className="flex justify-between items-center p-3 border-b last:border-0">
                <div>
                  <p className="font-semibold">{c.customer_name || 'Guest'}</p>
                  <p className="text-xs text-slate-500">{c.customer_email || 'No email'} • {c.abandoned_at ? format(new Date(c.abandoned_at), 'MMM dd') : ''}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${Number(c.cart_value).toFixed(2)}</p>
                  <p className="text-xs">{c.recovered ? <span className="text-green-600">Recovered</span> : <span className="text-amber-500">Pending</span>}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}