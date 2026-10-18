import React, { useState } from 'react';
import CRMNavigation from '@/components/crm/CRMNavigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CRMLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading CRM...</p>
        </div>
      </div>
    );
  }

  // Show authentication prompt if user is not logged in
  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Authentication Required</h2>
              <p className="text-muted-foreground">
                Please log in to access the CRM system. You need to be authenticated to manage contacts and view your pipeline.
              </p>
            </div>
            <Button onClick={() => navigate('/login')} className="w-full gap-2">
              <LogIn className="w-4 h-4" />
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <CRMNavigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}