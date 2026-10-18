import React from 'react';
import { Shield, Key } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const SettingsHeader = ({ configuredCount, totalCount }) => {
  const percentage = totalCount > 0 ? (configuredCount / totalCount) * 100 : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 text-white shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <Key className="w-6 h-6 text-indigo-400" />
            API Configuration
          </h1>
          <p className="text-slate-400 max-w-xl text-sm leading-relaxed mb-4">
            Securely store and manage your API keys to enable live market data and AI analysis. 
            Keys are encrypted at rest and never displayed in plain text after saving.
          </p>
        </div>
        
        <div className="hidden sm:flex flex-col items-end bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-300">Configuration Status</span>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {configuredCount} <span className="text-sm text-slate-500 font-normal">/ {totalCount} configured</span>
          </div>
          <Progress value={percentage} className="h-1.5 w-32 bg-slate-700" indicatorClassName="bg-emerald-500" />
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;