import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Shield, 
  Briefcase, 
  Bell, 
  FileText,
  BarChart3,
  KeyRound,
  Rocket,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/fraud',
      description: 'Overview & metrics'
    },
    {
      title: 'Transaction Monitoring',
      icon: Activity,
      path: '/fraud/transactions',
      description: 'Real-time tracking'
    },
    {
      title: 'Fraud Rules',
      icon: Shield,
      path: '/fraud/rules',
      description: 'Configure detection'
    },
    {
      title: 'Case Management',
      icon: Briefcase,
      path: '/fraud/cases',
      description: 'Investigation cases'
    },
    {
      title: 'Alerts',
      icon: Bell,
      path: '/fraud/alerts',
      description: 'Notifications'
    },
    {
      title: 'Audit Logs',
      icon: FileText,
      path: '/fraud/audit-logs',
      description: 'System activity'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      path: '/fraud/analytics',
      description: 'Reports & insights'
    },
    {
      title: 'Two-Factor Auth',
      icon: KeyRound,
      path: '/fraud/2fa-setup',
      description: '2FA configuration'
    },
    {
      title: 'Deployment',
      icon: Rocket,
      path: '/fraud/deployment',
      description: 'Production setup'
    },
    {
      title: 'Security',
      icon: Lock,
      path: '/fraud/security',
      description: 'Access control'
    }
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'group flex w-full flex-col gap-1 rounded-lg px-3 py-3 text-left transition-all duration-200',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn(
                    'h-5 w-5 transition-transform group-hover:scale-110',
                    isActive && 'text-primary-foreground'
                  )} />
                  <span className="font-semibold">{item.title}</span>
                </div>
                <span className={cn(
                  'ml-8 text-xs',
                  isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}>
                  {item.description}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs font-semibold text-foreground">System Status</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;