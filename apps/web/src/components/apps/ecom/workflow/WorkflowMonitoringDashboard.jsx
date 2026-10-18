import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, CheckCircle2, MessageSquare, Mail, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function WorkflowMonitoringDashboard() {
  const executionLogs = [
    { id: '1', time: 'Just now', event: 'Cart > $150', action: 'WhatsApp Sent', status: 'success' },
    { id: '2', time: '5m ago', event: 'Cart $45', action: 'Email Sent', status: 'success' },
    { id: '3', time: '12m ago', event: 'Cart > $150', action: 'WhatsApp Pending', status: 'warning' },
    { id: '4', time: '1h ago', event: 'API Error', action: 'Groq Timeout', status: 'error' },
  ];

  const channelData = [
    { name: 'WhatsApp', value: 65, color: '#22c55e' },
    { name: 'Email', value: 35, color: '#ef4444' }
  ];

  const performanceData = [
    { name: 'Mon', sent: 120, converted: 24 },
    { name: 'Tue', sent: 150, converted: 35 },
    { name: 'Wed', sent: 180, converted: 42 },
    { name: 'Thu', sent: 140, converted: 28 },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Execution Analytics</h1>
        <p className="text-slate-500">Real-time monitoring of recovery workflows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Triggers (24h)</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold flex items-center"><Zap className="w-5 h-5 text-amber-500 mr-2"/> 1,245</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">AI Cost (MTD)</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-indigo-600">$12.40</div><p className="text-xs text-slate-500">~0.0002 per gen</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">High-Value Routed</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-blue-600">34%</div><p className="text-xs text-slate-500">&gt; $150 carts</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Failed Executions</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-500">12</div><p className="text-xs text-slate-500">Retrying...</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="sent" fill="#94a3b8" radius={[4,4,0,0]} name="Messages Sent" />
                    <Bar dataKey="converted" fill="#3b82f6" radius={[4,4,0,0]} name="Recovered" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Execution Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {executionLogs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg bg-white text-sm">
                    <div className="flex items-center gap-3">
                      {log.status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      {log.status === 'warning' && <Activity className="w-4 h-4 text-amber-500" />}
                      {log.status === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      <span className="font-mono text-slate-500">{log.time}</span>
                      <span className="font-medium">{log.event}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">{log.action}</span>
                      <Badge variant="outline" className={
                        log.status === 'success' ? 'bg-green-50 text-green-700' :
                        log.status === 'error' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                      }>{log.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Channel Distribution</CardTitle>
              <CardDescription>Volume by output node</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> WhatsApp</div>
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Email</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}