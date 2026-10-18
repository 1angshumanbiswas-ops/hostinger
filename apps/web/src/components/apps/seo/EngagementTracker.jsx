import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Plus, TrendingUp, Users, MessageSquare } from 'lucide-react';

const EngagementTracker = () => {
  const [data, setData] = useState([
    { platform: 'LinkedIn', interested: 45, done: 12, replies: 28, total: 85 },
    { platform: 'Instagram', interested: 120, done: 45, replies: 89, total: 254 },
    { platform: 'Facebook', interested: 32, done: 8, replies: 15, total: 55 },
    { platform: 'WhatsApp', interested: 65, done: 20, replies: 110, total: 195 },
  ]);

  const [newEntry, setNewEntry] = useState({ platform: 'LinkedIn', interested: '', done: '', replies: '' });

  const handleAdd = () => {
    // Simple update logic
    const updated = data.map(d => {
      if (d.platform === newEntry.platform) {
        return {
          ...d,
          interested: d.interested + Number(newEntry.interested),
          done: d.done + Number(newEntry.done),
          replies: d.replies + Number(newEntry.replies),
          total: d.total + Number(newEntry.interested) + Number(newEntry.done) + Number(newEntry.replies)
        };
      }
      return d;
    });
    setData(updated);
    setNewEntry({ platform: 'LinkedIn', interested: '', done: '', replies: '' });
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Platform,Interested,Done,Replies,Total\n"
      + data.map(row => `${row.platform},${row.interested},${row.done},${row.replies},${row.total}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  const topPlatform = data.reduce((prev, current) => (prev.total > current.total) ? prev : current);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-indigo-600 text-white border-none">
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-indigo-100 font-medium text-sm">Top Performing Platform</p>
                     <h3 className="text-3xl font-bold mt-1">{topPlatform.platform}</h3>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
                     <TrendingUp className="w-6 h-6 text-white" />
                  </div>
               </div>
               <div className="mt-4 pt-4 border-t border-white/20 flex gap-4 text-sm text-indigo-100">
                  <span>{topPlatform.total} Interactions</span>
                  <span>42% of total</span>
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-slate-500 font-medium text-sm">Total Leads (#INTERESTED)</p>
                     <h3 className="text-3xl font-bold text-slate-900 mt-1">{data.reduce((a,b) => a + b.interested, 0)}</h3>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                     <Users className="w-6 h-6 text-green-600" />
                  </div>
               </div>
               <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
                  <span className="text-green-600 font-bold">+12%</span> vs last week
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-slate-500 font-medium text-sm">Active Conversations</p>
                     <h3 className="text-3xl font-bold text-slate-900 mt-1">{data.reduce((a,b) => a + b.replies, 0)}</h3>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                     <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
               </div>
               <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
                  <span className="text-blue-600 font-bold">+5%</span> response rate
               </div>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card>
            <CardHeader>
               <CardTitle>Platform Engagement</CardTitle>
               <CardDescription>Breakdown of interaction types</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="platform" axisLine={false} tickLine={false} />
                     <YAxis axisLine={false} tickLine={false} />
                     <Tooltip cursor={{fill: 'transparent'}} />
                     <Bar dataKey="interested" name="#INTERESTED" fill="#4F46E5" stackId="a" radius={[0,0,4,4]} />
                     <Bar dataKey="done" name="#Done" fill="#10B981" stackId="a" />
                     <Bar dataKey="replies" name="Replies" fill="#F59E0B" stackId="a" radius={[4,4,0,0]} />
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <div>
                  <CardTitle>Manual Data Entry</CardTitle>
                  <CardDescription>Update tracking metrics</CardDescription>
               </div>
               <Button size="sm" variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" /> Export CSV
               </Button>
            </CardHeader>
            <CardContent>
               <div className="flex gap-2 mb-4">
                  <select 
                     className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                     value={newEntry.platform}
                     onChange={(e) => setNewEntry({...newEntry, platform: e.target.value})}
                  >
                     <option value="LinkedIn">LinkedIn</option>
                     <option value="Instagram">Instagram</option>
                     <option value="Facebook">Facebook</option>
                     <option value="WhatsApp">WhatsApp</option>
                  </select>
                  <Input 
                     type="number" placeholder="#Interested" 
                     value={newEntry.interested}
                     onChange={(e) => setNewEntry({...newEntry, interested: e.target.value})}
                  />
                  <Input 
                     type="number" placeholder="#Done" 
                     value={newEntry.done}
                     onChange={(e) => setNewEntry({...newEntry, done: e.target.value})}
                  />
                  <Button onClick={handleAdd} size="icon" className="shrink-0 bg-indigo-600"><Plus className="w-4 h-4" /></Button>
               </div>

               <div className="rounded-md border border-slate-100 overflow-hidden">
                  <Table>
                     <TableHeader className="bg-slate-50">
                        <TableRow>
                           <TableHead>Platform</TableHead>
                           <TableHead>Total</TableHead>
                           <TableHead className="text-right">Trend</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {data.map((row) => (
                           <TableRow key={row.platform}>
                              <TableCell className="font-medium">{row.platform}</TableCell>
                              <TableCell>{row.total}</TableCell>
                              <TableCell className="text-right text-green-600 text-xs font-bold">↗ 5%</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default EngagementTracker;