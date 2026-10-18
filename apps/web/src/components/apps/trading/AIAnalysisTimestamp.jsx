import React, { useState, useEffect } from 'react';
import { Clock, Play, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AIAnalysisTimestamp = ({ onTrigger, loading }) => {
  const [nextRun, setNextRun] = useState('');
  const [lastRun, setLastRun] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      
      const diff = nextHour - now;
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setNextRun(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg border shadow-sm mb-6">
      <div className="flex items-center gap-4 mb-4 sm:mb-0">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span>Last Run: <strong>{lastRun}</strong></span>
        </div>
        <div className="h-4 w-px bg-slate-200"></div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <RefreshCw className="w-4 h-4 text-emerald-500" />
          <span>Next Auto-Run in: <strong className="text-emerald-600 tabular-nums">{nextRun}</strong></span>
        </div>
      </div>
      
      <Button 
        onClick={() => {
          setLastRun(new Date().toLocaleTimeString());
          onTrigger();
        }} 
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
      >
        <Play className={`w-4 h-4 mr-2 ${loading ? 'animate-pulse' : ''}`} />
        {loading ? 'Analyzing...' : 'Force Analysis Now'}
      </Button>
    </div>
  );
};

export default AIAnalysisTimestamp;