import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, History, RefreshCcw, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { format, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const CleanupHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState(30);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user, filterDays]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      // Fetch history for filtered date range
      const startDate = subDays(new Date(), filterDays).toISOString();
      
      const { data, error } = await supabase
        .from('cleanup_history')
        .select('*')
        .eq('user_id', user.id)
        .gte('cleanup_date', startDate)
        .order('cleanup_date', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalDeleted = (item) => {
      return (item.social_deleted || 0) + (item.promotions_deleted || 0) + (item.junk_deleted || 0) + (item.updates_deleted || 0);
  };

  const downloadCSV = () => {
    if (history.length === 0) return;
    
    const headers = ['Date', 'Total Deleted', 'Social', 'Promotions', 'Junk', 'Updates', 'Junk Detected', 'Important Remaining'];
    const rows = history.map(item => [
      format(new Date(item.cleanup_date), 'yyyy-MM-dd HH:mm:ss'),
      calculateTotalDeleted(item),
      item.social_deleted,
      item.promotions_deleted,
      item.junk_deleted,
      item.updates_deleted,
      item.junk_detected,
      item.important_remaining
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cleanup_history_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart Data Preparation
  const chartData = [...history].reverse().map(item => ({
    date: format(new Date(item.cleanup_date), 'MM/dd'),
    total: calculateTotalDeleted(item),
    social: item.social_deleted,
    promotions: item.promotions_deleted,
    junk: item.junk_deleted,
    updates: item.updates_deleted
  }));

  return (
    <div className="space-y-6">
       {/* Charts Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
              <CardHeader>
                  <CardTitle className="text-sm font-medium">Cleanup Trends (Last {filterDays} Days)</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                  {history.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                              <XAxis dataKey="date" fontSize={12} stroke="#94a3b8" />
                              <YAxis fontSize={12} stroke="#94a3b8" />
                              <RechartsTooltip 
                                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                              />
                              <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                          </LineChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data available</div>
                  )}
              </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle className="text-sm font-medium">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                   {history.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData.slice(-5)}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                              <XAxis dataKey="date" fontSize={12} stroke="#94a3b8" />
                              <YAxis fontSize={12} stroke="#94a3b8" />
                              <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                              <Legend iconType="circle" fontSize={10} />
                              <Bar dataKey="social" stackId="a" fill="#3b82f6" />
                              <Bar dataKey="promotions" stackId="a" fill="#10b981" />
                              <Bar dataKey="junk" stackId="a" fill="#ef4444" />
                              <Bar dataKey="updates" stackId="a" fill="#f59e0b" />
                          </BarChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data available</div>
                  )}
              </CardContent>
          </Card>
       </div>

       {/* Table Section */}
       <Card>
           <CardHeader className="flex flex-row items-center justify-between">
               <div>
                   <CardTitle className="flex items-center gap-2">
                       <History className="w-5 h-5 text-indigo-600" />
                       Cleanup Logs
                   </CardTitle>
                   <CardDescription>Detailed history of all automated and manual cleanups.</CardDescription>
               </div>
               <div className="flex gap-2">
                   <Button variant="outline" size="sm" onClick={fetchHistory} disabled={loading}>
                       <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                       Refresh
                   </Button>
                   <Button variant="outline" size="sm" onClick={downloadCSV} disabled={history.length === 0}>
                       <Download className="w-4 h-4 mr-2" />
                       Export CSV
                   </Button>
               </div>
           </CardHeader>
           <CardContent>
               {loading && history.length === 0 ? (
                   <div className="py-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
               ) : history.length === 0 ? (
                   <div className="py-8 text-center text-slate-500 italic">No cleanup history found.</div>
               ) : (
                   <div className="rounded-md border">
                       <Table>
                           <TableHeader>
                               <TableRow>
                                   <TableHead>Date & Time</TableHead>
                                   <TableHead>Total Deleted</TableHead>
                                   <TableHead className="hidden md:table-cell">Categories</TableHead>
                                   <TableHead className="hidden sm:table-cell">Junk Detected</TableHead>
                                   <TableHead className="hidden sm:table-cell">Important Left</TableHead>
                               </TableRow>
                           </TableHeader>
                           <TableBody>
                               {history.map((item) => (
                                   <TableRow key={item.id}>
                                       <TableCell className="font-medium">
                                           {format(new Date(item.cleanup_date), 'MMM d, yyyy')} <br/>
                                           <span className="text-xs text-slate-400">{format(new Date(item.cleanup_date), 'h:mm a')}</span>
                                       </TableCell>
                                       <TableCell>
                                           <Badge variant="secondary" className="font-bold">
                                               {calculateTotalDeleted(item)}
                                           </Badge>
                                       </TableCell>
                                       <TableCell className="hidden md:table-cell">
                                           <div className="flex gap-1 text-[10px] text-slate-500">
                                               <span className="bg-blue-50 text-blue-700 px-1 rounded">S: {item.social_deleted}</span>
                                               <span className="bg-green-50 text-green-700 px-1 rounded">P: {item.promotions_deleted}</span>
                                               <span className="bg-red-50 text-red-700 px-1 rounded">J: {item.junk_deleted}</span>
                                           </div>
                                       </TableCell>
                                       <TableCell className="hidden sm:table-cell text-slate-600">{item.junk_detected}</TableCell>
                                       <TableCell className="hidden sm:table-cell text-slate-600">{item.important_remaining}</TableCell>
                                   </TableRow>
                               ))}
                           </TableBody>
                       </Table>
                   </div>
               )}
           </CardContent>
       </Card>
    </div>
  );
};

export default CleanupHistory;