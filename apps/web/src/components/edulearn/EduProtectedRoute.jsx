import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useEduAuth } from '@/contexts/EduAuthContext';
import { Loader2 } from 'lucide-react';

export default function EduProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, isLoading } = useEduAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/edulearn/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/edulearn" replace />;
  }

  return children;
}