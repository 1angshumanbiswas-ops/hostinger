import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { ShoppingCart, RefreshCw, DollarSign, Bell } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

export default function CartRecoveryDashboard() {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState({ abandoned: 0, recovered: 0, revenue: 0 });
  const [carts, setCarts] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Mock Data for demonstration
    setMetrics({ abandoned: 124, recovered: 42, revenue: 5430 });
    setCarts([
      { id: '1', customer: 'john@example.com', value: 150, status: 'pending', time: '10 mins ago', ltv: 450 },
      { id: '2', customer: 'sarah@example.com', value: 320, status: 'recovered', time: '1 hour ago', ltv: 1200 },
      { id: '3', customer: 'mike@test.com', value: 85, status: 'messaged', time: '2 hours ago', ltv: 85 },
    ]);
    setChartData([
      { name: 'Mon', rate: 20 }, { name: 'Tue', rate: 25 }, { name: 'Wed', rate: 30 },
      { name: 'Thu', rate: 28 }, { name: 'Fri', rate: 35 }, { name: 'Sat', rate: 40 }, { name: 'Sun', rate: 38 }
    ]);
  }, []);

  const handleManualAction = (action) => {
    toast({
      title: "Action Triggered",
      description: `Manual ${action} initiated successfully.`,
    });
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Cart Recovery Dashboard</h1>
        <Button onClick={() => handleManualAction('refresh')} variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Refresh Data</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Abandoned Carts</CardTitle>
            <ShoppingCart className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.abandoned}</div>
            <p className="text-xs text-slate-500">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Recovery Rate</CardTitle>
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((metrics.recovered / metrics.abandoned) * 100).toFixed(1)}%</div>
            <p className="text-xs text-green-500">+5.2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Revenue Recovered</CardTitle>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.revenue}</div>
            <p className="text-xs text-green-500">+$840 from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Abandoned Carts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {carts.map((cart) => (
                  <div key={cart.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                    <div>
                      <p className="font-semibold">{cart.customer}</p>
                      <p className="text-sm text-slate-500">LTV: ${cart.ltv} • {cart.time}</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="font-bold">${cart.value}</p>
                        <Badge variant={cart.status === 'recovered' ? 'success' : cart.status === 'messaged' ? 'secondary' : 'outline'}>
                          {cart.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleManualAction('message')}>
                          <Bell className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recovery Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}