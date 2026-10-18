import React, { useState } from 'react';
import SEOAppHeader from '@/components/apps/seo/SEOAppHeader';
import PlatformTabContent from '@/components/apps/seo/PlatformTabContent';
import CampaignHistory from '@/components/apps/seo/CampaignHistory';
import { motion, AnimatePresence } from 'framer-motion';

const SEOApp = () => {
  const [activePlatform, setActivePlatform] = useState('linkedin');
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <SEOAppHeader 
        activePlatform={activePlatform} 
        setActivePlatform={setActivePlatform} 
        showHistory={showHistory}
        setShowHistory={setShowHistory}
      />
      
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
                key={activePlatform}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
             >
                <PlatformTabContent platform={activePlatform} />
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SEOApp;