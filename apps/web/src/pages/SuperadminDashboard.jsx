import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogOut, LayoutDashboard, Users, Settings, Shield } from 'lucide-react';

export default function SuperadminDashboard() {
  const { currentUser, logout } = useAuth();

  const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview' },
    { icon: <Users className="h-5 w-5" />, label: 'Users Management' },
    { icon: <Shield className="h-5 w-5" />, label: 'Roles & Permissions' },
    { icon: <Settings className="h-5 w-5" />, label: 'System Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-white font-bold text-xl">
            <Shield className="h-6 w-6 text-blue-500" />
            <span>Admin Portal</span>
          </div>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item, idx) => (
            <button key={idx} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors text-left">
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Button variant="ghost" onClick={logout} className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800">
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your system efficiently</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-slate-700">{currentUser?.email}</span>
          </div>
        </header>

        <div className="p-8 space-y-6 flex-1 overflow-y-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-blue-800">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
              Welcome, {currentUser?.email}! 👋
            </h2>
            <p className="text-sm text-blue-600">
              You are authenticated and logged into the superadmin dashboard. From here, you can manage the entire platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-slate-800">Total Users</CardTitle>
                <CardDescription>Active platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-slate-900">1,248</div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-slate-800">System Status</CardTitle>
                <CardDescription>Current health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-emerald-600 flex items-center gap-2">
                  <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse" />
                  All Systems Operational
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-slate-800">Recent Activity</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-slate-900">84</div>
                <div className="text-sm text-slate-500 mt-1">Audit logs recorded</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}