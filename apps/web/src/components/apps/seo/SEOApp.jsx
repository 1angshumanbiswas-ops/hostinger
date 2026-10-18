import React, { useState, useEffect } from 'react';
import SEOAppHeader from '@/components/apps/seo/SEOAppHeader';
import PlatformTabContent from '@/components/apps/seo/PlatformTabContent';
import CampaignHistory from '@/components/apps/seo/CampaignHistory';
import RefreshTab from '@/components/apps/seo/RefreshTab';
import PostTab from '@/components/apps/seo/PostTab';
import LinkedInDebugPanel from '@/components/apps/seo/LinkedInDebugPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { useScheduling } from '@/hooks/useScheduling';
import { Button } from '@/components/ui/button';
import { Bug, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const SEOApp = () => {
  const [activePlatform, setActivePlatform] = useState('linkedin');
  const [showHistory, setShowHistory] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { isSuperAdmin } = useAuth();
  
  // Use custom hook to initialize scheduling system globally
  const { initializeSchedule } = useScheduling();

  useEffect(() => {
    initializeSchedule();
  }, []);

  // Helper to render correct tab content
  const renderContent = () => {
      if (showDebug) return <LinkedInDebugPanel />;
      if (activePlatform === 'refresh') return <RefreshTab />;
      if (activePlatform === 'post') return <PostTab />;
      return <PlatformTabContent platform={activePlatform} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      <SEOAppHeader 
        activePlatform={activePlatform} 
        setActivePlatform={setActivePlatform} 
        showHistory={showHistory}
        setShowHistory={(val) => { setShowHistory(val); setShowDebug(false); }}
      />

      <div className="absolute top-20 right-4 z-10 flex gap-2">
         {isSuperAdmin && (
             <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-md text-sm font-medium border border-purple-200">
                <ShieldCheck className="w-4 h-4" />
                Super Admin
             </div>
         )}
         <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDebug(!showDebug)}
            className={`text-slate-400 hover:text-slate-600 ${showDebug ? 'bg-slate-200 text-slate-800' : ''}`}
         >
            <Bug className="w-4 h-4 mr-2" /> LinkedIn Debug
         </Button>
      </div>
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <AnimatePresence mode="wait">
          {showHistory ? (
             <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
             >
                <CampaignHistory />
             </motion.div>
          ) : (
             <motion.div
                key={showDebug ? 'debug' : activePlatform}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
             >
                {renderContent()}
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SEOApp;