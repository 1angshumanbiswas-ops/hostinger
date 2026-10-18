import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Globe, Lock, Mail, Database, CheckCircle2, Circle, Server, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  validateDomainConfig,
  generateSSLInstructions,
  validateEmailConfig,
  configureBackupSchedule,
  getDeploymentChecklist,
  performHealthCheck,
  getDeploymentStatus,
  generateDNSRecords,
  saveDeploymentConfig
} from '@/utils/deploymentService';

const DeploymentSetup = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [domain, setDomain] = useState('angshuman.in');
  const [sslEnabled, setSslEnabled] = useState(false);
  const [emailConfig, setEmailConfig] = useState({
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '1angshuman.biswas@gmail.com'
  });
  const [backupSchedule, setBackupSchedule] = useState({
    frequency: 'daily',
    time: '02:00',
    retentionDays: 30
  });
  const [checklist, setChecklist] = useState({ checklist: [], completionPercentage: 0 });
  const [healthStatus, setHealthStatus] = useState({});
  const [deploymentStatus, setDeploymentStatus] = useState({});
  const [dnsRecords, setDnsRecords] = useState([]);
  const [sslInstructions, setSslInstructions] = useState(null);

  useEffect(() => {
    if (user) {
      loadDeploymentData();
    }
  }, [user]);

  const loadDeploymentData = async () => {
    const [checklistData, healthData, statusData] = await Promise.all([
      getDeploymentChecklist(user.id),
      performHealthCheck(),
      getDeploymentStatus(user.id)
    ]);

    setChecklist(checklistData);
    setHealthStatus(healthData);
    setDeploymentStatus(statusData);
    setDnsRecords(generateDNSRecords(domain));
  };

  const handleDomainChange = (e) => {
    const newDomain = e.target.value;
    setDomain(newDomain);
    setDnsRecords(generateDNSRecords(newDomain));
  };

  const handleValidateDomain = () => {
    const result = validateDomainConfig(domain);
    
    if (result.valid) {
      toast({
        title: 'Valid Domain',
        description: 'Domain configuration is valid'
      });
      setSslInstructions(generateSSLInstructions(domain));
    } else {
      toast({
        title: 'Invalid Domain',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  const handleSaveEmailConfig = () => {
    const result = validateEmailConfig(emailConfig);
    
    if (result.valid) {
      saveDeploymentConfig(user.id, { email_config: emailConfig });
      toast({
        title: 'Email Configuration Saved',
        description: 'SMTP settings have been saved successfully'
      });
    } else {
      toast({
        title: 'Invalid Configuration',
        description: result.errors.join(', '),
        variant: 'destructive'
      });
    }
  };

  const handleSaveBackupSchedule = async () => {
    const result = await configureBackupSchedule({
      userId: user.id,
      ...backupSchedule
    });

    if (result.success) {
      toast({
        title: 'Backup Schedule Configured',
        description: 'Daily backup schedule has been set up'
      });
      loadDeploymentData();
    } else {
      toast({
        title: 'Configuration Failed',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  const handleSaveDeployment = async () => {
    const result = await saveDeploymentConfig(user.id, {
      domain,
      ssl_enabled: sslEnabled,
      email_config: emailConfig,
      backup_schedule: backupSchedule,
      deployment_version: 'v1.0.0',
      last_deployment_at: new Date().toISOString()
    });

    if (result.success) {
      toast({
        title: 'Deployment Configuration Saved',
        description: 'All settings have been saved successfully'
      });
      loadDeploymentData();
    } else {
      toast({
        title: 'Save Failed',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Deployment Setup - Fraud Detection</title>
        <meta name="description" content="Configure deployment settings and infrastructure" />
      </Helmet>

      <div className="space-y-6 max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold">Deployment Setup</h1>
          <p className="text-muted-foreground">Configure your production deployment settings</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {deploymentStatus.status === 'active' ? 'Active' : 'Unknown'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Uptime: {deploymentStatus.uptime || 'N/A'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-500" />
                Deployment Version
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {deploymentStatus.version || 'v1.0.0'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Current version
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Setup Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {Math.round(checklist.completionPercentage)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {checklist.completedItems}/{checklist.totalItems} completed
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Custom Domain Configuration
            </CardTitle>
            <CardDescription>Configure your custom domain and DNS settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <div className="flex gap-2">
                <Input
                  id="domain"
                  value={domain}
                  onChange={handleDomainChange}
                  placeholder="example.com"
                />
                <Button onClick={handleValidateDomain} variant="outline">
                  Validate
                </Button>
              </div>
            </div>

            {dnsRecords.length > 0 && (
              <div className="space-y-3">
                <Label>DNS Records</Label>
                <div className="rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Value</th>
                        <th className="px-4 py-2 text-left">TTL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dnsRecords.map((record, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2">
                            <Badge variant="outline">{record.type}</Badge>
                          </td>
                          <td className="px-4 py-2 font-mono">{record.name}</td>
                          <td className="px-4 py-2 font-mono text-xs">{record.value}</td>
                          <td className="px-4 py-2">{record.ttl}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              SSL Certificate Setup
            </CardTitle>
            <CardDescription>Enable HTTPS with SSL/TLS encryption</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-semibold">SSL/TLS Encryption</p>
                <p className="text-sm text-muted-foreground">Secure your domain with HTTPS</p>
              </div>
              <Switch checked={sslEnabled} onCheckedChange={setSslEnabled} />
            </div>

            {sslInstructions && sslEnabled && (
              <div className="space-y-4">
                {sslInstructions.steps.map((step, idx) => (
                  <div key={idx} className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {idx + 1}
                      </div>
                      <h4 className="font-semibold">{step.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                    {step.commands && (
                      <div className="space-y-2">
                        {step.commands.map((cmd, cmdIdx) => (
                          <code key={cmdIdx} className="block bg-muted px-3 py-2 rounded text-xs font-mono">
                            {cmd}
                          </code>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email Configuration
            </CardTitle>
            <CardDescription>Configure branded email for notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input
                  id="smtp-host"
                  value={emailConfig.smtpHost}
                  onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input
                  id="smtp-port"
                  value={emailConfig.smtpPort}
                  onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                  placeholder="587"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-user">SMTP Username</Label>
                <Input
                  id="smtp-user"
                  value={emailConfig.smtpUser}
                  onChange={(e) => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
                  placeholder="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-password">SMTP Password</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  value={emailConfig.smtpPassword}
                  onChange={(e) => setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="from-email">From Email Address</Label>
                <Input
                  id="from-email"
                  type="email"
                  value={emailConfig.fromEmail}
                  onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                  placeholder="1angshuman.biswas@gmail.com"
                />
              </div>
            </div>

            <Button onClick={handleSaveEmailConfig} className="w-full bg-primary">
              Save Email Configuration
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Daily Backup Schedule
            </CardTitle>
            <CardDescription>Configure automated database backups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={backupSchedule.frequency} onValueChange={(value) => setBackupSchedule({ ...backupSchedule, frequency: value })}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-time">Backup Time</Label>
                <Input
                  id="backup-time"
                  type="time"
                  value={backupSchedule.time}
                  onChange={(e) => setBackupSchedule({ ...backupSchedule, time: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention">Retention (Days)</Label>
                <Input
                  id="retention"
                  type="number"
                  value={backupSchedule.retentionDays}
                  onChange={(e) => setBackupSchedule({ ...backupSchedule, retentionDays: parseInt(e.target.value) })}
                  min="1"
                  max="365"
                />
              </div>
            </div>

            <Button onClick={handleSaveBackupSchedule} className="w-full bg-primary">
              Configure Backup Schedule
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deployment Checklist</CardTitle>
            <CardDescription>Complete all steps for production deployment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklist.checklist.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{item.title}</p>
                      <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'}>
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Check Status</CardTitle>
            <CardDescription>System health monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${healthStatus.api?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-semibold">API Health</p>
                    <p className="text-sm text-muted-foreground">{healthStatus.api?.message || 'Checking...'}</p>
                  </div>
                </div>
                <Badge variant={healthStatus.api?.status === 'healthy' ? 'default' : 'destructive'}>
                  {healthStatus.api?.status || 'unknown'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${healthStatus.database?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-semibold">Database Connection</p>
                    <p className="text-sm text-muted-foreground">{healthStatus.database?.message || 'Checking...'}</p>
                  </div>
                </div>
                <Badge variant={healthStatus.database?.status === 'healthy' ? 'default' : 'destructive'}>
                  {healthStatus.database?.status || 'unknown'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${healthStatus.services?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-semibold">Services Status</p>
                    <p className="text-sm text-muted-foreground">{healthStatus.services?.message || 'Checking...'}</p>
                  </div>
                </div>
                <Badge variant={healthStatus.services?.status === 'healthy' ? 'default' : 'destructive'}>
                  {healthStatus.services?.status || 'unknown'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={loadDeploymentData} variant="outline" className="flex-1">
            Refresh Status
          </Button>
          <Button onClick={handleSaveDeployment} className="flex-1 bg-primary">
            Save All Settings
          </Button>
        </div>
      </div>
    </>
  );
};

export default DeploymentSetup;