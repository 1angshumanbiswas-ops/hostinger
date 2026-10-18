import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import EduHeader from '@/components/edulearn/EduHeader';
import EduFooter from '@/components/edulearn/EduFooter';
import AdminUploadForm from '@/components/edulearn/AdminUploadForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EduAdminDashboardPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUploadSuccess = (material) => {
    toast({
      title: "Success",
      description: `Material "${material.title}" has been uploaded`
    });
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Edulearn</title>
        <meta name="description" content="Admin dashboard for managing educational materials" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <EduHeader />

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Admin <span className="text-[hsl(var(--edulearn-heading))]">Dashboard</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage educational materials and content
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/edulearn/admin/materials')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Manage Materials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View, edit, and delete existing materials
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload New
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Add new educational materials
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configure classes, subjects, and resource types
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AdminUploadForm onSuccess={handleUploadSuccess} />

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <span className="font-medium">Total Materials</span>
                      <Button variant="link" onClick={() => navigate('/edulearn/admin/materials')}>
                        View All
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <span className="font-medium">Recent Uploads</span>
                      <span className="text-muted-foreground">Last 7 days</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <span className="font-medium">Top Downloads</span>
                      <span className="text-muted-foreground">This month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <EduFooter />
      </div>
    </>
  );
}