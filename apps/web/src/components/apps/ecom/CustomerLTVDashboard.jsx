import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Users, TrendingUp, Star, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function CustomerLTVDashboard() {
  const { toast } = useToast();
  
  const vipCustomers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', ltv: 1250, orders: 15, risk: 'Low' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', ltv: 890, orders: 8, risk: 'High' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', ltv: 650, orders: 5, risk: 'Medium' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customer Intelligence</h1>
          <p className="text-slate-500">Segmentation and LTV tracking.</p>
        </div>
        <Button onClick={() => toast({title: "Syncing", description: "Fetching latest LTV from Airtable."})}>
          Sync Airtable
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Total Customers</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">12,450</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Average LTV</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">$345</div></CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-amber-700">VIP Customers</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-amber-800">420</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">At Risk VIPs</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-500">18</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top VIP Customers</CardTitle>
          <div className="flex items-center w-64">
            <Search className="w-4 h-4 mr-2 text-slate-400" />
            <Input placeholder="Search customers..." className="h-8" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vipCustomers.map(c => (
              <div key={c.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                    <Users className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{c.name} <Star className="w-3 h-3 inline text-amber-500" /></p>
                    <p className="text-sm text-slate-500">{c.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${c.ltv}</p>
                  <p className="text-xs text-slate-500">{c.orders} Lifetime Orders</p>
                </div>
                <div>
                  <Badge variant={c.risk === 'High' ? 'destructive' : c.risk === 'Medium' ? 'secondary' : 'success'}>
                    {c.risk} Risk
                  </Badge>
                </div>
                <Button variant="outline" size="sm">View History</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}