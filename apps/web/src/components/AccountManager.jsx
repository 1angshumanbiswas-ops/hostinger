import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Users, Plus, Star, Trash2, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import { useMultiAccount } from '@/hooks/useMultiAccount';

const AccountManager = () => {
  const { accounts, currentAccount, loading, addAccount, removeAccount, setPrimaryAccount } = useMultiAccount();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  
  // Mock function for "OAuth" since we can't do real Google OAuth here
  const handleAddAccount = async () => {
    if (!newEmail) return;
    // Simulate tokens
    await addAccount(newEmail, 'mock_access_token', 'mock_refresh_token', newEmail.split('@')[0]);
    setIsAddOpen(false);
    setNewEmail('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Connected Accounts
            </CardTitle>
            <CardDescription>Manage your connected email accounts.</CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" /> Add Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect New Account</DialogTitle>
                <CardDescription>Enter the email address to simulate OAuth connection.</CardDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    placeholder="user@example.com" 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button onClick={handleAddAccount} disabled={!newEmail || loading}>Connect</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading && accounts.length === 0 ? (
          <div className="text-center py-6 text-slate-500">Loading accounts...</div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <Mail className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 font-medium">No accounts connected</p>
            <p className="text-slate-400 text-sm">Add an account to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((acc) => (
              <div key={acc.id} className={`flex items-center justify-between p-4 rounded-lg border ${acc.id === currentAccount?.id ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${acc.is_primary ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-500'}`}>
                    {acc.is_primary ? <Star className="w-4 h-4 fill-current" /> : <Mail className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{acc.account_email}</p>
                        {acc.is_primary && <Badge variant="secondary" className="text-[10px] bg-yellow-50 text-yellow-700 border-yellow-200">Primary</Badge>}
                        {acc.id === currentAccount?.id && <Badge variant="outline" className="text-[10px] border-indigo-200 text-indigo-700">Active</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" /> Connected
                        </span>
                        {acc.last_cleanup_date && (
                             <span>• Last cleanup: {new Date(acc.last_cleanup_date).toLocaleDateString()}</span>
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   {!acc.is_primary && (
                       <Button variant="ghost" size="sm" onClick={() => setPrimaryAccount(acc.id)} title="Make Primary">
                           <Star className="w-4 h-4 text-slate-400 hover:text-yellow-500" />
                       </Button>
                   )}
                   <Button variant="ghost" size="sm" onClick={() => removeAccount(acc.id)} title="Remove Account" className="text-slate-400 hover:text-red-500">
                       <Trash2 className="w-4 h-4" />
                   </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountManager;