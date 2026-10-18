import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ScheduleCalendar = ({ scheduledPosts }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Basic styling mapping for dots
  const platformColors = {
    linkedin: 'bg-blue-600',
    facebook: 'bg-blue-500',
    instagram: 'bg-pink-500',
    whatsapp: 'bg-green-500'
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold text-slate-900">
           {format(currentMonth, 'MMMM yyyy')}
        </CardTitle>
        <div className="flex items-center gap-1">
           <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
           </Button>
           <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
           </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
           {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-xs font-medium text-slate-500 py-1">{day}</div>
           ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
           {daysInMonth.map((day, idx) => {
              const dayPosts = scheduledPosts.filter(p => isSameDay(new Date(p.scheduled_time), day));
              
              return (
                <div 
                   key={idx} 
                   className={`
                      min-h-[80px] p-1 border rounded-md flex flex-col items-start gap-1 transition-colors
                      ${!isSameMonth(day, currentMonth) ? 'bg-slate-50 text-slate-300 border-transparent' : 'bg-white border-slate-100'}
                      ${isToday(day) ? 'ring-1 ring-indigo-500 bg-indigo-50/20' : ''}
                   `}
                >
                   <span className={`text-xs font-medium ml-1 ${isToday(day) ? 'text-indigo-600' : 'text-slate-700'}`}>
                      {format(day, 'd')}
                   </span>
                   
                   <div className="w-full flex flex-col gap-0.5 mt-auto">
                      {dayPosts.slice(0, 3).map(post => (
                        <TooltipProvider key={post.id}>
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <div className="flex items-center gap-1 px-1 py-0.5 rounded text-[10px] bg-slate-50 hover:bg-slate-100 w-full cursor-pointer truncate">
                                    <div className={`w-1.5 h-1.5 rounded-full ${platformColors[post.platform]}`} />
                                    <span className="truncate text-slate-600">{format(new Date(post.scheduled_time), 'h:mm a')}</span>
                                 </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                 <p className="font-semibold capitalize">{post.platform} Post</p>
                                 <p className="text-xs">{post.template} - {post.color}</p>
                                 <p className="text-xs text-slate-400">{format(new Date(post.scheduled_time), 'h:mm a')}</p>
                              </TooltipContent>
                           </Tooltip>
                        </TooltipProvider>
                      ))}
                      {dayPosts.length > 3 && (
                         <div className="text-[9px] text-slate-400 px-1 text-center">+{dayPosts.length - 3} more</div>
                      )}
                   </div>
                </div>
              );
           })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;