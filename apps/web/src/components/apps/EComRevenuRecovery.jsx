import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UnifiedEComDashboard from '@/components/apps/ecom/UnifiedEComDashboard';

export default function EComRevenuRecovery() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('desktop');

  useEffect(() => {
    // Simulate loading state for the embedded app
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F3F0]">
      {/* App Container Header */}
      <div className="h-16 border-b border-[#E0E0D8] bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#555555] hover:text-[#2D7A4A] hover:bg-[#E8F5E9] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">Back to Portfolio</span>
          </Button>
          <div className="h-6 w-px bg-[#E0E0D8] hidden sm:block"></div>
          <h1 className="text-lg font-bold text-[#333333]">ECom Revenue Recovery</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2D7A4A] text-xs font-bold uppercase tracking-wider hidden md:inline-flex">
            B2B SaaS Preview
          </span>
        </div>
        
        <div className="flex items-center gap-2 bg-[#F5F3F0] p-1 rounded-lg border border-[#E0E0D8]">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-[#2D7A4A]' : 'text-[#555555] hover:text-[#333333]'}`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-[#2D7A4A]' : 'text-[#555555] hover:text-[#333333]'}`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* App Content Area */}
      <div className="flex-1 flex justify-center bg-[#E5E5E5] overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full w-full bg-white">
            <Loader2 className="w-10 h-10 animate-spin text-[#2D7A4A] mb-4" />
            <p className="text-[#555555] font-medium animate-pulse">Initializing SaaS Environment...</p>
          </div>
        ) : (
          <div className={`w-full h-full overflow-y-auto bg-background transition-all duration-500 ease-in-out ${viewMode === 'mobile' ? 'max-w-[400px] border-x border-[#D0D0D0] shadow-2xl' : 'max-w-full'}`}>
            <UnifiedEComDashboard />
          </div>
        )}
      </div>
    </div>
  );
}