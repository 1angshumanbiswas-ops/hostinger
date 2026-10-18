import React from 'react';
import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-slate-900 text-white flex items-center px-6 justify-between sticky top-0 z-50 shadow-md">
      <div 
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => navigate('/')}
      >
        <div className="bg-white/10 p-1.5 rounded-md">
          <Building2 className="w-6 h-6 text-[#1f5233]" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">
          Angshuman AI Corp ERP <span className="text-slate-400 font-normal mx-2">|</span> HR Portal
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-[#1f5233] flex items-center justify-center text-sm font-bold shadow-sm text-white">
          A
        </div>
      </div>
    </header>
  );
}