import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { ShieldCheck } from 'lucide-react';

/**
 * Utility component to visually indicate when a feature is unlocked via Superadmin bypass.
 * Wraps content that normally would be hidden behind a paywall.
 */
const SuperadminAccessBypass = ({ children, fallback = null, featureName = "Premium Feature" }) => {
  const { isSuperAdmin } = useAuth();

  if (isSuperAdmin) {
    return (
      <div className="relative group">
        <div className="absolute -top-3 -right-3 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
             <ShieldCheck className="w-3 h-3" />
             Superadmin Bypass Active
           </div>
        </div>
        {children}
      </div>
    );
  }

  // If not superadmin, render the fallback (e.g. paywall, login screen)
  return fallback;
};

export default SuperadminAccessBypass;