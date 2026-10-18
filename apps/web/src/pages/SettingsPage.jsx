import React, { useState } from 'react';
import DashboardLayout from '@/components/erp/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, Save, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    // Mock success
    setSuccessMsg("Password updated successfully!");
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your account details and active session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Email Address</Label>
                <div className="font-medium">{currentUser?.email || '1angshuman.biswas@gmail.com'}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">System Role</Label>
                <div className="font-medium capitalize px-2 py-1 bg-primary/10 text-primary w-max rounded-md text-sm mt-1">Superadmin</div>
              </div>
              <div className="pt-4">
                <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account security credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {successMsg && (
                  <Alert className="bg-green-50 text-green-800 border-green-200 py-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="ml-2">{successMsg}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full">
                  <Save className="h-4 w-4 mr-2" /> Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}