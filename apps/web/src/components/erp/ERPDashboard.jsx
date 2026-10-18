import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, Users, Shield, Briefcase, 
  CheckSquare, Calendar, DollarSign, Activity, 
  Settings, LogOut, Menu, X, Building
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import DashboardOverview from './pages/DashboardOverview';
import GenericModulePage from './pages/GenericModulePage';

export default function ERPDashboard() {
  const { currentUser, logout, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/erp' },
    { name: 'Users', icon: Users, path: '/erp/users' },
    { name: 'Roles & Permissions', icon: Shield, path: '/erp/roles' },
    { name: 'Employees', icon: Users, path: '/erp/employees' },
    { name: 'Departments', icon: Building, path: '/erp/departments' },
    { name: 'Projects', icon: Briefcase, path: '/erp/projects' },
    { name: 'Tasks', icon: CheckSquare, path: '/erp/tasks' },
    { name: 'Leaves', icon: Calendar, path: '/erp/leaves' },
    { name: 'Payroll', icon: DollarSign, path: '/erp/payroll' },
    { name: 'Activity Logs', icon: Activity, path: '/erp/logs' },
    { name: 'Settings', icon: Settings, path: '/erp/settings' },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 border-r bg-card transition-all duration-300 flex flex-col`}>
          <div className="h-16 flex items-center justify-between px-4 border-b">
            {sidebarOpen && <span className="font-bold text-xl text-primary tracking-tight">ERP System</span>}
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {menuItems.map((item) => (
                <Link key={item.name} to={item.path}>
                  <Button 
                    variant={location.pathname === item.path ? 'secondary' : 'ghost'} 
                    className={`w-full justify-start ${sidebarOpen ? 'px-4' : 'px-0 justify-center'} ${location.pathname === item.path ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    <item.icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b bg-card flex items-center justify-between px-6">
            <h1 className="text-xl font-semibold">ERP Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-muted-foreground">{currentUser?.email}</span>
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.email}`} />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <Button variant="destructive" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/users" element={<GenericModulePage title="User Management" description="Manage system users and their access." />} />
              <Route path="/roles" element={<GenericModulePage title="Roles & Permissions" description="Configure RBAC settings." />} />
              <Route path="/employees" element={<GenericModulePage title="Employee Directory" description="Manage personnel records." />} />
              <Route path="/departments" element={<GenericModulePage title="Departments" description="Organization structure." />} />
              <Route path="/projects" element={<GenericModulePage title="Project Tracking" description="Monitor active projects." />} />
              <Route path="/tasks" element={<GenericModulePage title="Task Management" description="Assign and track tasks." />} />
              <Route path="/leaves" element={<GenericModulePage title="Leave Management" description="Handle time-off requests." />} />
              <Route path="/payroll" element={<GenericModulePage title="Payroll" description="Salary and compensation." />} />
              <Route path="/logs" element={<GenericModulePage title="Activity Logs" description="System audit trails." />} />
              <Route path="/settings" element={<GenericModulePage title="System Settings" description="Global ERP configuration." />} />
              <Route path="*" element={<Navigate to="/erp" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}