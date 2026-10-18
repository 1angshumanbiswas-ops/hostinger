import React, { useState } from 'react';
import { Share2, Linkedin, Instagram, Facebook, MessageCircle, Menu, X, History, CalendarClock, Twitter, Ghost, Youtube, RefreshCw, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const SEOAppHeader = ({ activePlatform, setActivePlatform, showHistory, setShowHistory }) => {
  
  const platforms = [
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0A66C2', activeClass: 'text-[#0A66C2] border-[#0A66C2] bg-blue-50' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F', activeClass: 'text-[#E4405F] border-[#E4405F] bg-pink-50' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2', activeClass: 'text-[#1877F2] border-[#1877F2] bg-blue-50' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25D366', activeClass: 'text-[#25D366] border-[#25D366] bg-green-50' },
    { id: 'twitter', label: 'Twitter', icon: Twitter, color: '#1DA1F2', activeClass: 'text-[#1DA1F2] border-[#1DA1F2] bg-sky-50' },
    { id: 'snapchat', label: 'Snapchat', icon: Ghost, color: '#FFFC00', activeClass: 'text-yellow-600 border-yellow-400 bg-yellow-50' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF0000', activeClass: 'text-[#FF0000] border-[#FF0000] bg-red-50' },
  ];

  // Extra Tabs
  const extraTabs = [
      { id: 'schedule', label: 'Schedule', icon: CalendarClock, color: '#6366f1', activeClass: 'text-indigo-600 border-indigo-600 bg-indigo-50' },
      { id: 'post', label: 'Post', icon: Send, color: '#2563eb', activeClass: 'text-blue-600 border-blue-600 bg-blue-50' },
      { id: 'refresh', label: 'Refresh', icon: RefreshCw, color: '#16a34a', activeClass: 'text-green-600 border-green-600 bg-green-50' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 w-40">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-md">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-bold text-lg text-slate-900 leading-none">SEO App</h1>
            <p className="text-[10px] text-slate-500 font-medium">Ad Manager</p>
          </div>
        </div>

        {/* Platform Tabs - Desktop */}
        <div className="hidden md:flex items-center justify-center flex-1 mx-4 overflow-x-auto">
          <div className="flex bg-slate-100/80 p-1.5 rounded-xl gap-2 overflow-x-auto no-scrollbar">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isActive = activePlatform === platform.id && !showHistory;
              
              return (
                <button
                  key={platform.id}
                  onClick={() => { setActivePlatform(platform.id); setShowHistory(false); }}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap
                    ${isActive 
                      ? `${platform.activeClass} shadow-sm ring-1 ring-inset` 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }
                  `}
                  style={{
                    borderColor: isActive ? platform.color : 'transparent'
                  }}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'fill-current' : ''}`} />
                  {platform.label}
                </button>
              );
            })}
             
             <div className="w-px bg-slate-300 mx-1 h-6 self-center opacity-50"></div>

             {extraTabs.map((tab) => {
                 const isActive = activePlatform === tab.id && !showHistory;
                 return (
                    <button
                        key={tab.id}
                        onClick={() => { setActivePlatform(tab.id); setShowHistory(false); }}
                        className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap
                        ${isActive
                            ? `${tab.activeClass} shadow-sm ring-1 ring-inset`
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }
                        `}
                    >
                        <tab.icon className={`w-3.5 h-3.5`} />
                        {tab.label}
                    </button>
                 );
             })}

          </div>
        </div>

        {/* Actions / History */}
        <div className="flex items-center gap-3 w-40 justify-end">
          <Button 
             variant={showHistory ? "secondary" : "ghost"} 
             size="sm"
             onClick={() => setShowHistory(!showHistory)}
             className={showHistory ? "bg-slate-200 text-slate-900" : "text-slate-500"}
          >
             <History className="w-4 h-4 mr-2" />
             <span className="hidden sm:inline">Campaigns</span>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <h3 className="text-sm font-medium text-slate-500 uppercase">Select Platform</h3>
                {platforms.map(platform => {
                   const Icon = platform.icon;
                   return (
                    <Button
                      key={platform.id}
                      variant="ghost"
                      className={`justify-start gap-3 ${activePlatform === platform.id ? "bg-slate-100 font-bold" : ""}`}
                      onClick={() => { setActivePlatform(platform.id); setShowHistory(false); }}
                    >
                      <Icon className="w-5 h-5" style={{ color: platform.color }} />
                      {platform.label}
                    </Button>
                   )
                })}
                <div className="h-px bg-slate-200 my-2" />
                {extraTabs.map(tab => (
                    <Button
                        key={tab.id}
                        variant="ghost"
                        className={`justify-start gap-3 ${activePlatform === tab.id ? "bg-slate-100 font-bold" : ""}`}
                        onClick={() => { setActivePlatform(tab.id); setShowHistory(false); }}
                    >
                        <tab.icon className="w-5 h-5" style={{ color: tab.color }} />
                        {tab.label}
                    </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
};

export default SEOAppHeader;