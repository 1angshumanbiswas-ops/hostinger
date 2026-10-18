import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, CalendarClock, Send, FileImage as ImageIcon, Filter, Sparkles, BrainCircuit, Wand2, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getEngagementScoreColor } from '@/utils/seoAppUtils';

const PostingHistory = ({ history }) => {
  const [filter, setFilter] = useState('all');
  const [themeFilter, setThemeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique themes from history for filter
  const uniqueThemes = [...new Set(history.map(item => item.engagement_metrics?.theme_meta?.name).filter(Boolean))];

  const filteredHistory = history.filter(item => {
    const matchesPlatform = filter === 'all' || item.platform === filter;
    const matchesSearch = item.content?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.template.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = themeFilter === 'all' || item.engagement_metrics?.theme_meta?.name === themeFilter;
    
    return matchesPlatform && matchesSearch && matchesTheme;
  });

  return (
    <Card className="border-slate-200">
       <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Activity Log</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
             <Input 
                placeholder="Search history..." 
                className="h-9 w-full sm:w-[200px]" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-9 w-full sm:w-[130px]">
                   <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="all">All Platforms</SelectItem>
                   <SelectItem value="linkedin">LinkedIn</SelectItem>
                   <SelectItem value="facebook">Facebook</SelectItem>
                   <SelectItem value="instagram">Instagram</SelectItem>
                   <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
             </Select>
             
             {uniqueThemes.length > 0 && (
                 <Select value={themeFilter} onValueChange={setThemeFilter}>
                    <SelectTrigger className="h-9 w-full sm:w-[130px]">
                       <Filter className="w-3 h-3 mr-2 text-slate-500" />
                       <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="all">All Themes</SelectItem>
                       {uniqueThemes.map(theme => (
                          <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
             )}

             <Button variant="outline" size="sm" className="h-9">
                <Download className="w-4 h-4 mr-2" /> Export
             </Button>
          </div>
       </CardHeader>
       <CardContent>
          <div className="rounded-md border border-slate-100 overflow-hidden">
             <Table>
                <TableHeader className="bg-slate-50">
                   <TableRow>
                      <TableHead className="w-[100px]">Platform</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>AI & Score</TableHead>
                      <TableHead>Asset & Theme</TableHead>
                      <TableHead className="text-right">Engagement</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {filteredHistory.length > 0 ? filteredHistory.map((item) => {
                      const themeMeta = item.engagement_metrics?.theme_meta || {};
                      const isAiSelected = themeMeta.name === "AI Selected" || themeMeta.isAiSelected;
                      const suggestionUsed = themeMeta.suggestionUsed;
                      const engagementScore = themeMeta.engagementScoreAtPosting;
                      
                      return (
                      <TableRow key={item.id}>
                         <TableCell className="font-medium capitalize">{item.platform}</TableCell>
                         <TableCell>
                            {item.post_type === 'manual' ? (
                               <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                                  <Send className="w-3 h-3 mr-1" /> Manual
                               </Badge>
                            ) : (
                               <Badge variant="outline" className="text-slate-500 text-[10px]">
                                  <CalendarClock className="w-3 h-3 mr-1" /> Scheduled
                               </Badge>
                            )}
                         </TableCell>
                         <TableCell className="text-xs text-slate-600">{format(new Date(item.posted_at), 'MMM d, h:mm a')}</TableCell>
                         <TableCell>
                            <div className="flex flex-col gap-1">
                                {suggestionUsed ? (
                                   <Badge variant="outline" className="text-[10px] w-fit border-indigo-200 bg-indigo-50 text-indigo-700">
                                      <Wand2 className="w-3 h-3 mr-1" /> {suggestionUsed}
                                   </Badge>
                                ) : (
                                   <span className="text-[10px] text-slate-400">Manual Copy</span>
                                )}
                                {engagementScore !== undefined && (
                                   <div className={`flex items-center gap-1 text-[10px] font-bold ${getEngagementScoreColor(engagementScore)}`}>
                                      <TrendingUp className="w-3 h-3" /> Score: {engagementScore}/100
                                   </div>
                                )}
                            </div>
                         </TableCell>
                         <TableCell>
                            <div className="flex items-center gap-3">
                                {item.image_url ? (
                                    <a href={item.image_url} target="_blank" rel="noopener noreferrer" className="group block relative w-12 h-8 rounded overflow-hidden border border-slate-200">
                                        <img src={item.image_url} alt="Post" className="w-full h-full object-cover" />
                                        {isAiSelected && (
                                            <div className="absolute top-0 right-0 p-0.5 bg-indigo-600">
                                                <Sparkles className="w-2 h-2 text-white" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                    </a>
                                ) : (
                                    <span className="text-xs text-slate-400 italic">No image</span>
                                )}
                                
                                {themeMeta.name && (
                                   <div className="flex flex-col">
                                      {isAiSelected ? (
                                          <TooltipProvider>
                                              <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <span className="text-[10px] font-semibold text-indigo-700 flex items-center gap-1 cursor-help">
                                                        <BrainCircuit className="w-3 h-3" /> AI Selected
                                                    </span>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                      <p>{themeMeta.description || "AI matched this image to your ad content."}</p>
                                                  </TooltipContent>
                                              </Tooltip>
                                          </TooltipProvider>
                                      ) : (
                                          <span className="text-[10px] font-semibold text-slate-700 flex items-center gap-1">
                                            <ImageIcon className="w-3 h-3" /> {themeMeta.name}
                                          </span>
                                      )}
                                      <span className="text-[9px] text-slate-400">
                                        Via {themeMeta.source || 'API'}
                                      </span>
                                   </div>
                                )}
                            </div>
                         </TableCell>
                         <TableCell className="text-right">
                            <div className="text-xs space-x-2">
                               {item.engagement_metrics?.likes !== undefined && <span>👍 {item.engagement_metrics.likes}</span>}
                               {item.engagement_metrics?.shares !== undefined && <span>🔄 {item.engagement_metrics.shares}</span>}
                            </div>
                         </TableCell>
                      </TableRow>
                   )}) : (
                      <TableRow>
                         <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                            No history found.
                         </TableCell>
                      </TableRow>
                   )}
                </TableBody>
             </Table>
          </div>
       </CardContent>
    </Card>
  );
};

export default PostingHistory;