import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Fallback to AuthContext if they use a different one, but usually it's the same
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isSuperAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user && !isSuperAdmin) {
    return <Navigate to="/erp/login" state={{ from: location }} replace />;
  }

  // Superadmin bypass: Always allow superadmin regardless of roles array
  if (isSuperAdmin || (user && user.role === 'superadmin')) {
    return <Outlet />;
  }

  // Check role if specified
  if (allowedRoles.length > 0) {
    const userRole = user?.user_metadata?.role || user?.role;
    
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/erp/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;