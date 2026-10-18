import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Trash2, ExternalLink, Linkedin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { PLATFORM_CONFIGS } from '@/utils/seoAppUtils';

const CampaignHistory = () => {
  const [filter, setFilter] = useState('all');
  
  // Map string names from config to actual components
  const iconMap = {
    Linkedin,
    Instagram,
    Facebook,
    MessageCircle,
    Search
  };
  
  // Mock data
  const campaigns = [
    { id: 1, name: 'HR Manager Hiring', platform: 'linkedin', date: '2023-10-24', engagement: '1.2k', status: 'Active' },
    { id: 2, name: 'Summer Internship', platform: 'instagram', date: '2023-10-22', engagement: '856', status: 'Paused' },
    { id: 3, name: 'Product Launch', platform: 'facebook', date: '2023-10-20', engagement: '2.4k', status: 'Ended' },
    { id: 4, name: 'Urgent Requirement', platform: 'whatsapp', date: '2023-10-18', engagement: '45 replies', status: 'Active' },
    { id: 5, name: 'Developer Role', platform: 'linkedin', date: '2023-10-15', engagement: '980', status: 'Active' },
  ];

  const filtered = campaigns.filter(c => filter === 'all' || c.platform === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <h2 className="text-xl font-bold text-slate-900">Campaign History</h2>
         <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
               <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
               <Input placeholder="Search campaigns..." className="pl-9 h-10" />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10">
               <Download className="w-4 h-4" />
            </Button>
         </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
         <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('all')}
            className="rounded-full"
         >
            All
         </Button>
         {Object.keys(PLATFORM_CONFIGS).map(key => (
            <Button
               key={key}
               variant={filter === key ? 'default' : 'outline'}
               size="sm"
               onClick={() => setFilter(key)}
               className="rounded-full capitalize"
               style={{ 
                  backgroundColor: filter === key ? PLATFORM_CONFIGS[key].color : 'transparent',
                  borderColor: filter === key ? 'transparent' : '',
                  color: filter === key ? 'white' : ''
               }}
            >
               {PLATFORM_CONFIGS[key].name}
            </Button>
         ))}
      </div>

      <div className="grid gap-4">
         {filtered.map(campaign => {
            const config = PLATFORM_CONFIGS[campaign.platform];
            // Resolve icon component from map, fallback to Search
            const Icon = (config?.icon && iconMap[config.icon]) ? iconMap[config.icon] : Search;
            
            return (
               <Card key={campaign.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div 
                           className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                           style={{ backgroundColor: config?.color || '#333' }}
                        >
                           <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-900">{campaign.name}</h3>
                           <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <span className="capitalize">{campaign.platform}</span>
                              <span>•</span>
                              <span>{campaign.date}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                           <p className="text-sm font-bold text-slate-900">{campaign.engagement}</p>
                           <p className="text-[10px] text-slate-500 uppercase">Engagement</p>
                        </div>
                        <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'} className="hidden sm:inline-flex">
                           {campaign.status}
                        </Badge>
                        <div className="flex gap-1">
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                              <ExternalLink className="w-4 h-4" />
                           </Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                           </Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            );
         })}
      </div>
    </div>
  );
};

export default CampaignHistory;