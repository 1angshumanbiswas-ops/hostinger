import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/erp/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ShieldAlert, FileText, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardHome() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const stats = [
    { title: "Total Users", value: "1,248", icon: Users, color: "text-blue-500" },
    { title: "Total Roles", value: "12", icon: ShieldAlert, color: "text-amber-500" },
    { title: "Recent Audit Logs", value: "842", icon: FileText, color: "text-primary" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, Superadmin</h1>
            <p className="text-muted-foreground mt-1">Logged in as {currentUser?.email || '1angshuman.biswas@gmail.com'}</p>
          </div>
          <Button variant="outline" className="md:hidden w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All systems are running normally. No active alerts or pending updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}