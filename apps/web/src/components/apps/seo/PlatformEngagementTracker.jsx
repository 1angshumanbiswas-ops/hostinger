import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PLATFORM_CONFIGS } from '@/utils/seoAppUtils';
import { supabase } from '@/lib/customSupabaseClient';

const PlatformEngagementTracker = ({ platform }) => {
  const config = PLATFORM_CONFIGS[platform];
  const [metrics, setMetrics] = useState([]);
  const [stats, setStats] = useState({ likes: 0, comments: 0, shares: 0 });

  useEffect(() => {
     // Fetch aggregate data for this platform from posting history
     const fetchMetrics = async () => {
         const { data } = await supabase
            .from('posting_history')
            .select('engagement_metrics, post_type, posted_at')
            .eq('platform', platform)
            .order('posted_at', { ascending: false })
            .limit(20);

         if (data) {
             // Calculate aggregates
             let totalLikes = 0;
             let totalComments = 0;
             let totalShares = 0;
             
             // Prepare chart data (e.g. posts by day/type)
             const chartData = data.map((post, index) => {
                 const m = post.engagement_metrics || { likes: 0, comments: 0, shares: 0 };
                 totalLikes += m.likes || 0;
                 totalComments += m.comments || 0;
                 totalShares += m.shares || 0;
                 return {
                     name: `Post ${index + 1}`,
                     likes: m.likes || 0,
                     type: post.post_type
                 };
             }).reverse();
             
             setMetrics(chartData);
             setStats({ likes: totalLikes, comments: totalComments, shares: totalShares });
         }
     };

     fetchMetrics();
  }, [platform]);

  return (
    <div className="h-full flex flex-col gap-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
             {config?.name} Total Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Total Likes</p>
                <p className="text-xl font-bold text-slate-900">{stats.likes.toLocaleString()}</p>
             </div>
             <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Comments & Shares</p>
                <p className="text-xl font-bold text-slate-900">{(stats.comments + stats.shares).toLocaleString()}</p>
             </div>
          </div>

          <div className="h-[180px] w-full mt-4">
             {metrics.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={metrics}>
                      <XAxis dataKey="name" hide />
                      <Tooltip 
                         contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                         cursor={{ fill: 'transparent' }}
                         labelFormatter={() => ''}
                      />
                      <Bar dataKey="likes" fill={config?.color || '#333'} radius={[4,4,0,0]} barSize={20} />
                   </BarChart>
                 </ResponsiveContainer>
             ) : (
                 <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No data available
                 </div>
             )}
          </div>
        </CardContent>
      </Card>

      {/* Manual Entry */}
      <Card className="border-slate-200 shadow-sm flex-1">
         <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Update Manual Data</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="grid grid-cols-2 gap-3">
               <Input placeholder="Likes" type="number" className="h-8 text-xs" />
               <Input placeholder="Comments" type="number" className="h-8 text-xs" />
            </div>
            <Button size="sm" className="w-full mt-4" style={{ backgroundColor: config?.color }}>
               Update Stats
            </Button>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
               Metrics for manual posts are tracked separately from scheduled campaigns.
            </p>
         </CardContent>
      </Card>
    </div>
  );
};

export default PlatformEngagementTracker;