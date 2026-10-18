import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar as CalIcon, Settings, List, Timer } from 'lucide-react';
import { useScheduling } from '@/hooks/useScheduling';
import ScheduledPostCard from '@/components/apps/seo/ScheduledPostCard';
import ScheduleCalendar from '@/components/apps/seo/ScheduleCalendar';
import ScheduleConfiguration from '@/components/apps/seo/ScheduleConfiguration';
import PostingHistory from '@/components/apps/seo/PostingHistory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const SchedulingDashboard = () => {
  const { 
     scheduledPosts, 
     postingHistory, 
     config, 
     nextPostCountdown,
     loading,
     initializeSchedule,
     manualCheck 
  } = useScheduling();

  useEffect(() => {
     initializeSchedule();
  }, []);

  const formatCountdown = (ms) => {
     if (!ms) return "--:--:--";
     const seconds = Math.floor((ms / 1000) % 60);
     const minutes = Math.floor((ms / (1000 * 60)) % 60);
     const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col gap-6">
      
      {/* Dashboard Header Stats */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
               <Timer className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Next Auto-Post In</p>
               <h2 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                  {nextPostCountdown !== null ? formatCountdown(nextPostCountdown) : "All Caught Up"}
               </h2>
            </div>
         </div>
         
         <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
            <div className="text-center px-4">
               <p className="text-2xl font-bold text-slate-900">{scheduledPosts.length}</p>
               <p className="text-xs text-slate-500">Scheduled</p>
            </div>
            <div className="text-center px-4 border-l border-slate-100">
               <p className="text-2xl font-bold text-slate-900">{postingHistory.length}</p>
               <p className="text-xs text-slate-500">Posted</p>
            </div>
            <Button variant="outline" size="sm" onClick={manualCheck} className="ml-2 gap-2">
               <RefreshCw className="w-3 h-3" /> Check Now
            </Button>
         </div>
      </div>

      <Tabs defaultValue="calendar" className="flex-1 flex flex-col">
         <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mb-6">
            <TabsTrigger value="calendar" className="gap-2"><CalIcon className="w-4 h-4"/> Calendar</TabsTrigger>
            <TabsTrigger value="history" className="gap-2"><List className="w-4 h-4"/> History</TabsTrigger>
            <TabsTrigger value="config" className="gap-2"><Settings className="w-4 h-4"/> Config</TabsTrigger>
         </TabsList>

         <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            {/* Main Content Area */}
            <div className="lg:col-span-8 h-full min-h-[500px]">
               <TabsContent value="calendar" className="h-full mt-0 border-none p-0">
                  {loading ? <Skeleton className="w-full h-full rounded-xl" /> : <ScheduleCalendar scheduledPosts={scheduledPosts} />}
               </TabsContent>
               <TabsContent value="history" className="h-full mt-0 border-none p-0">
                  {loading ? <Skeleton className="w-full h-full rounded-xl" /> : <PostingHistory history={postingHistory} />}
               </TabsContent>
               <TabsContent value="config" className="h-full mt-0 border-none p-0">
                  <ScheduleConfiguration config={config} />
               </TabsContent>
            </div>

            {/* Sidebar: Upcoming List */}
            <div className="lg:col-span-4 flex flex-col h-full bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-200 bg-white">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                     Upcoming Queue 
                     <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">{scheduledPosts.length}</Badge>
                  </h3>
               </div>
               <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                     {loading ? (
                        [1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
                     ) : scheduledPosts.length > 0 ? (
                        scheduledPosts.slice(0, 10).map(post => (
                           <ScheduledPostCard key={post.id} post={post} onPostNow={() => manualCheck()} />
                        ))
                     ) : (
                        <div className="text-center py-10 text-slate-500">
                           <p>No posts scheduled.</p>
                           <Button variant="link" size="sm" onClick={initializeSchedule}>Generate Schedule</Button>
                        </div>
                     )}
                  </div>
               </ScrollArea>
            </div>
         </div>
      </Tabs>
    </div>
  );
};

export default SchedulingDashboard;