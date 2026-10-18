import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PackageX, Send, TrendingUp, AlertTriangle } from 'lucide-react';

export default function InventoryIntelligenceDashboard() {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents([
      { id: '1', product: 'Wireless Earbuds Pro', customer: 'alex@example.com', time: '5 mins ago', alts: 3, score: 0.92, status: 'notified' },
      { id: '2', product: 'Ergonomic Chair', customer: 'sam@example.com', time: '15 mins ago', alts: 2, score: 0.85, status: 'queued' },
      { id: '3', product: 'Mechanical Keyboard', customer: 'jordan@example.com', time: '1 hour ago', alts: 0, score: 0, status: 'no_alts' },
    ]);
  }, []);

  const handleNotify = () => {
    toast({ title: "Notification Queued", description: "Alternative recommendations sent to customer." });
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Inventory Intelligence</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Out-of-Stock Events</CardTitle>
            <PackageX className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-slate-500">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Alt Notifications Sent</CardTitle>
            <Send className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">285</div>
            <p className="text-xs text-slate-500">83% Coverage Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Alt Conversion Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2%</div>
            <p className="text-xs text-green-500">+2.1% from last week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Out-of-Stock Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-50 rounded-md">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{ev.product}</p>
                    <p className="text-sm text-slate-500">Customer: {ev.customer} • {ev.time}</p>
                    {ev.alts > 0 && (
                      <p className="text-xs text-blue-600 mt-1">{ev.alts} alternatives found (Avg Match: {ev.score * 100}%)</p>
                    )}
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <Badge variant={ev.status === 'notified' ? 'success' : ev.status === 'queued' ? 'secondary' : 'destructive'}>
                    {ev.status.replace('_', ' ')}
                  </Badge>
                  {ev.status !== 'notified' && ev.alts > 0 && (
                    <Button size="sm" onClick={handleNotify}>Push Alt</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}