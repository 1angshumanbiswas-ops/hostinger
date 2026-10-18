import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Users, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

export default function UnifiedEComDashboard() {
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Command Center</h1>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> All Systems Operational
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Recoveries</CardTitle>
            <ShoppingCart className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-slate-500 mt-1">24 in last hour</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Avg LTV</CardTitle>
            <Users className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$345.20</div>
            <p className="text-xs text-green-500 mt-1">+12% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">OOS Events</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-amber-600 mt-1">Requiring alternative mapping</p>
          </CardContent>
        </Card>

        <Card className="bg-indigo-600 text-white border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-indigo-100">Revenue Saved</CardTitle>
            <TrendingUp className="w-4 h-4 text-indigo-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-indigo-200 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-indigo-100">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-900">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-500" /> AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <p className="font-semibold text-slate-900">Industry Benchmark Alert</p>
              <p className="text-sm text-slate-600 mt-1">Your cart abandonment rate is 65%, which is <strong>better than the 70.22% industry average</strong>. Keep it up!</p>
            </div>
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <p className="font-semibold text-slate-900">VIP Customer Risk</p>
              <p className="text-sm text-slate-600 mt-1">18 VIP customers haven't purchased in 90 days. Recommend triggering the 'We Miss You' Groq campaign.</p>
            </div>
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <p className="font-semibold text-slate-900">Inventory Opportunity</p>
              <p className="text-sm text-slate-600 mt-1">Product 'Premium Earbuds' is OOS. AI successfully matched 3 alternatives within 15% price range.</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
             <CardHeader><CardTitle>Recent Activity Stream</CardTitle></CardHeader>
             <CardContent className="space-y-3">
               <div className="flex items-center text-sm"><span className="w-2 h-2 rounded-full bg-green-500 mr-3"></span> Cart #998 recovered by VIP SMS ($150)</div>
               <div className="flex items-center text-sm"><span className="w-2 h-2 rounded-full bg-blue-500 mr-3"></span> Airtable LTV Sync completed (12k records)</div>
               <div className="flex items-center text-sm"><span className="w-2 h-2 rounded-full bg-amber-500 mr-3"></span> 45 Out-of-Stock notifications queued</div>
             </CardContent>
          </Card>
          <Card>
             <CardHeader><CardTitle>System Health</CardTitle></CardHeader>
             <CardContent className="space-y-3">
               <div className="flex justify-between text-sm"><span>Shopify API</span><span className="text-green-500 font-medium">99.9% Uptime</span></div>
               <div className="flex justify-between text-sm"><span>Airtable Sync</span><span className="text-green-500 font-medium">Last 5m ago</span></div>
               <div className="flex justify-between text-sm"><span>Groq LLM</span><span className="text-green-500 font-medium">65ms avg latency</span></div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}