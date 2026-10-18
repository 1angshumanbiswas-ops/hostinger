import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Clock, Globe, Activity, Key, Lock, AlertTriangle, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  setSessionTimeout,
  addIPToWhitelist,
  removeIPFromWhitelist,
  getLoginActivity,
  getIPWhitelist,
  validatePasswordStrength
} from '@/utils/securityService';

const SecuritySettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [sessionTimeout, setSessionTimeoutValue] = useState('30');
  const [ipWhitelist, setIpWhitelist] = useState([]);
  const [newIP, setNewIP] = useState('');
  const [loginActivity, setLoginActivity] = useState([]);
  const [showAddIPDialog, setShowAddIPDialog] = useState(false);
  const [passwordTest, setPasswordTest] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);

  useEffect(() => {
    if (user) {
      loadSecurityData();
    }
  }, [user]);

  const loadSecurityData = async () => {
    const [activity, whitelist] = await Promise.all([
      getLoginActivity(user.id, 50),
      getIPWhitelist(user.id)
    ]);

    setLoginActivity(activity);
    setIpWhitelist(whitelist);
  };

  const handleSetTimeout = async () => {
    const result = await setSessionTimeout(user.id, parseInt(sessionTimeout));
    
    if (result.success) {
      toast({
        title: 'Session Timeout Updated',
        description: `Session timeout set to ${sessionTimeout} minutes`
      });
    } else {
      toast({
        title: 'Update Failed',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  const handleAddIP = async () => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    
    if (!ipRegex.test(newIP)) {
      toast({
        title: 'Invalid IP Address',
        description: 'Please enter a valid IPv4 address',
        variant: 'destructive'
      });
      return;
    }

    const result = await addIPToWhitelist(user.id, newIP);
    
    if (result.success) {
      toast({
        title: 'IP Added',
        description: 'IP address added to whitelist successfully'
      });
      setNewIP('');
      setShowAddIPDialog(false);
      loadSecurityData();
    } else {
      toast({
        title: 'Failed to Add IP',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  const handleRemoveIP = async (ipAddress) => {
    const result = await removeIPFromWhitelist(user.id, ipAddress);
    
    if (result.success) {
      toast({
        title: 'IP Removed',
        description: 'IP address removed from whitelist'
      });
      loadSecurityData();
    } else {
      toast({
        title: 'Failed to Remove IP',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  const handlePasswordCheck = () => {
    const result = validatePasswordStrength(passwordTest);
    setPasswordStrength(result);
  };

  const getStatusBadge = (status) => {
    if (status === 'success') return <Badge className="bg-green-500">Success</Badge>;
    if (status === 'failed') return <Badge variant="destructive">Failed</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  const getSuspiciousBadge = (suspicious) => {
    if (suspicious) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Suspicious
      </Badge>;
    }
    return null;
  };

  return (
    <>
      <Helmet>
        <title>Security Settings - Fraud Detection</title>
        <meta name="description" content="Manage security settings and access controls" />
      </Helmet>

      <div className="space-y-6 max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground">Manage authentication and access control settings</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Protected</div>
              <p className="text-xs text-muted-foreground mt-1">All systems secure</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Session Timeout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{sessionTimeout} min</div>
              <p className="text-xs text-muted-foreground mt-1">Current setting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Whitelisted IPs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{ipWhitelist.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Authorized addresses</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Session Timeout Configuration
            </CardTitle>
            <CardDescription>Set automatic logout timeout for inactive sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="timeout">Timeout Duration</Label>
                <Select value={sessionTimeout} onValueChange={setSessionTimeoutValue}>
                  <SelectTrigger id="timeout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSetTimeout} className="bg-primary">
                Update Timeout
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  IP Whitelist Management
                </CardTitle>
                <CardDescription>Restrict access to specific IP addresses</CardDescription>
              </div>
              <Button onClick={() => setShowAddIPDialog(true)}>
                Add IP Address
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {ipWhitelist.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No IP addresses in whitelist. Add trusted IPs to restrict access.
              </div>
            ) : (
              <div className="space-y-2">
                {ipWhitelist.map((ip, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <code className="font-mono text-sm">{ip}</code>
                    </div>
                    <Button onClick={() => handleRemoveIP(ip)} variant="destructive" size="sm">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Password Strength Validator
            </CardTitle>
            <CardDescription>Test password strength against security requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="password-test">Test Password</Label>
                <Input
                  id="password-test"
                  type="password"
                  value={passwordTest}
                  onChange={(e) => setPasswordTest(e.target.value)}
                  placeholder="Enter password to test"
                />
              </div>
              <Button onClick={handlePasswordCheck}>
                Check Strength
              </Button>
            </div>

            {passwordStrength && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Password Strength</span>
                  <Badge className={
                    passwordStrength.strength === 'strong' ? 'bg-green-500' :
                    passwordStrength.strength === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }>
                    {passwordStrength.strength.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {passwordStrength.requirements.minLength ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />}
                    Minimum 12 characters
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordStrength.requirements.hasUppercase ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />}
                    Contains uppercase letter
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordStrength.requirements.hasLowercase ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />}
                    Contains lowercase letter
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordStrength.requirements.hasNumber ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />}
                    Contains number
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordStrength.requirements.hasSpecialChar ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />}
                    Contains special character
                  </div>
                </div>

                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      passwordStrength.strength === 'strong' ? 'bg-green-500' :
                      passwordStrength.strength === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Login Activity Logs
            </CardTitle>
            <CardDescription>Recent authentication attempts and access history</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Flags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginActivity.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No login activity recorded
                    </TableCell>
                  </TableRow>
                ) : (
                  loginActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="text-sm">
                        {new Date(activity.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs font-mono">{activity.ip_address}</code>
                      </TableCell>
                      <TableCell className="text-sm">{activity.device || 'Unknown'}</TableCell>
                      <TableCell className="text-sm">{activity.location || 'Unknown'}</TableCell>
                      <TableCell>{getStatusBadge(activity.status)}</TableCell>
                      <TableCell>{getSuspiciousBadge(activity.suspicious)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={showAddIPDialog} onOpenChange={setShowAddIPDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add IP to Whitelist</DialogTitle>
              <DialogDescription>
                Enter the IP address you want to authorize for access
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3">
              <Label htmlFor="new-ip">IP Address</Label>
              <Input
                id="new-ip"
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
                placeholder="192.168.1.1"
              />
              <p className="text-xs text-muted-foreground">
                Enter a valid IPv4 address (e.g., 192.168.1.1)
              </p>
            </div>

            <DialogFooter>
              <Button onClick={() => setShowAddIPDialog(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleAddIP} className="bg-primary">
                Add IP Address
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default SecuritySettings;