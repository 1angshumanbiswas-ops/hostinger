import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Trash2, ShieldAlert, Archive, Clock, ArrowRight, Settings, CalendarCheck, ChevronsUpDown, Check, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAutoCleanupSchedule } from '@/hooks/useAutoCleanupSchedule';
import { useMultiAccount } from '@/hooks/useMultiAccount';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
  <Card className="border-l-4 shadow-sm hover:shadow-md transition-shadow" style={{ borderLeftColor: color }}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-full bg-opacity-10`} style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const MailHelperDashboard = () => {
  const { currentAccount, accounts, switchAccount, loading: accountsLoading } = useMultiAccount();
  const { schedule, countdown, nextCleanupTime } = useAutoCleanupSchedule(currentAccount); // Updated hook usage
  
  // Mock Data (would be fetched from Supabase based on currentAccount in real integration)
  const stats = {
      total: currentAccount ? 1250 : 0,
      deleted: currentAccount ? 450 : 0,
      junk: currentAccount ? 85 : 0,
      important: currentAccount ? 12 : 0
  };

  const lastCleanup = {
      date: 'Today, 9:00 AM',
      deleted: 145,
      junk: 23,
      important: 4
  };

  return (
    <div className="space-y-6">
      
      {/* Header Section with Account Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
             <p className="text-slate-500">Managing:</p>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed border-slate-300 bg-transparent hover:bg-slate-50">
                        {accountsLoading ? "Loading..." : currentAccount ? currentAccount.account_email : "No Account Selected"}
                        <ChevronsUpDown className="ml-2 h-3 w-3 text-slate-400" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>My Accounts</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {accounts.map((acc) => (
                        <DropdownMenuItem key={acc.id} onClick={() => switchAccount(acc.id)} className="flex items-center justify-between">
                            <span>{acc.account_email}</span>
                            {currentAccount?.id === acc.id && <Check className="h-4 w-4 text-indigo-600" />}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link to="/mail-helper/settings" className="flex items-center cursor-pointer text-indigo-600">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Account
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <Link to="/mail-helper/settings">
                <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                </Button>
            </Link>
            <Button className="bg-indigo-600 hover:bg-indigo-700" disabled={!currentAccount}>
                <Trash2 className="w-4 h-4 mr-2" />
                Run Cleanup Now
            </Button>
        </div>
      </div>

      {!currentAccount ? (
         <Card className="border-dashed border-2 border-slate-200">
             <CardContent className="flex flex-col items-center justify-center py-12 text-slate-500">
                 <Mail className="w-12 h-12 mb-4 text-slate-300" />
                 <h3 className="text-lg font-medium text-slate-900">No Account Selected</h3>
                 <p className="mb-4">Please select an account or add a new one to view stats.</p>
                 <Link to="/mail-helper/settings">
                    <Button>Go to Settings</Button>
                 </Link>
             </CardContent>
         </Card>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Scanned" value={stats.total} icon={Mail} color="#6366f1" subtext="Last 7 days" />
            <StatCard title="Cleaned" value={stats.deleted} icon={Trash2} color="#10b981" subtext="Emails removed" />
            <StatCard title="Junk Detected" value={stats.junk} icon={ShieldAlert} color="#ef4444" subtext="Blocked/Filtered" />
            <StatCard title="Important" value={stats.important} icon={Archive} color="#f59e0b" subtext="Flagged for review" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                   {/* Quick Summary Card */}
                   <Card>
                       <CardHeader>
                           <CardTitle>Recent Activity</CardTitle>
                           <CardDescription>Latest actions for <strong>{currentAccount.account_email}</strong>.</CardDescription>
                       </CardHeader>
                       <CardContent>
                           <div className="space-y-4">
                               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-full text-green-600">
                                            <CalendarCheck className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">Weekly Cleanup Completed</p>
                                            <p className="text-xs text-slate-500">{lastCleanup.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-slate-700">-{lastCleanup.deleted} emails</span>
                                        <div className="flex gap-2 text-[10px] text-slate-400 mt-1">
                                            <span>{lastCleanup.junk} Junk</span>
                                            <span>•</span>
                                            <span>{lastCleanup.important} Important</span>
                                        </div>
                                    </div>
                               </div>
                               {/* More items would map here */}
                           </div>
                       </CardContent>
                   </Card>
              </div>

              {/* Sidebar / Schedule Widget */}
              <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                      <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-indigo-900">
                              <Clock className="w-5 h-5" />
                              Next Cleanup
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          {schedule?.enabled ? (
                              <div className="text-center py-4">
                                  <div className="text-3xl font-bold text-indigo-600 mb-1 font-mono">
                                      {countdown}
                                  </div>
                                  <p className="text-xs text-indigo-400 font-medium mb-4">
                                      Until scheduled run for {currentAccount.account_email}
                                  </p>
                                  <div className="text-sm text-slate-600 bg-white/50 p-2 rounded border border-indigo-50 inline-block w-full">
                                      Scheduled: <span className="font-semibold text-slate-800">
                                          {nextCleanupTime ? nextCleanupTime.toLocaleString('en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit' }) : '...'}
                                      </span>
                                  </div>
                              </div>
                          ) : (
                              <div className="text-center py-6 text-slate-500">
                                  <p className="mb-4">Auto-cleanup is disabled for this account.</p>
                                  <Link to="/mail-helper/settings">
                                    <Button variant="secondary" size="sm" className="w-full">Enable Now</Button>
                                  </Link>
                              </div>
                          )}
                          
                          {schedule?.enabled && (
                              <div className="mt-4 pt-4 border-t border-indigo-100">
                                  <Link to="/mail-helper/settings">
                                      <Button variant="ghost" size="sm" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                          Manage Schedule <ArrowRight className="w-3 h-3 ml-1" />
                                      </Button>
                                  </Link>
                              </div>
                          )}
                      </CardContent>
                  </Card>
              </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MailHelperDashboard;