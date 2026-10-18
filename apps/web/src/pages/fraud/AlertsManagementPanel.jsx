import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Send, Filter } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { AlertService } from '@/utils/alertService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const AlertsManagementPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    alert_type: 'Email',
    message: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
    fetchCustomers();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          customers (
            id,
            name,
            email
          )
        `)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, email')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const handleSendAlert = async (e) => {
    e.preventDefault();
    
    const result = await AlertService.sendCustomAlert(
      formData.customer_id,
      formData.alert_type,
      formData.message
    );

    if (result.success) {
      toast({
        title: 'Alert sent',
        description: `${formData.alert_type} alert has been sent to customer`
      });
      setIsDialogOpen(false);
      setFormData({
        customer_id: '',
        alert_type: 'Email',
        message: ''
      });
      fetchAlerts();
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  const templates = AlertService.getAlertTemplates();

  const getAlertTypeBadge = (type) => {
    const colors = {
      SMS: 'bg-blue-500',
      Email: 'bg-green-500',
      'In-App': 'bg-purple-500'
    };
    return <Badge className={colors[type]}>{type}</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>Alerts Management - Bank Fraud Detection</title>
        <meta name="description" content="Manage customer fraud alerts and notifications" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Alerts Management</h1>
            <p className="text-muted-foreground">Monitor and send fraud alerts to customers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Send Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Custom Alert</DialogTitle>
                <DialogDescription>
                  Send a fraud alert notification to a customer
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSendAlert} className="space-y-4">
                <div className="space-y-2">
                  <Label>Customer</Label>
                  <Select
                    value={formData.customer_id}
                    onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Alert Type</Label>
                  <Select
                    value={formData.alert_type}
                    onValueChange={(value) => setFormData({ ...formData, alert_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="In-App">In-App</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Message Template (Optional)</Label>
                  <Select
                    onValueChange={(value) => setFormData({ ...formData, message: templates[value] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(templates).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter alert message"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Send className="mr-2 h-4 w-4" />
                    Send Alert
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Today's Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {alerts.filter(a => {
                  const today = new Date().toDateString();
                  return new Date(a.sent_at).toDateString() === today;
                }).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Email Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {alerts.filter(a => a.alert_type === 'Email').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alert History</CardTitle>
            <CardDescription>All fraud alerts sent to customers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading alerts...
                    </TableCell>
                  </TableRow>
                ) : alerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No alerts sent yet
                    </TableCell>
                  </TableRow>
                ) : (
                  alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-mono text-xs">
                        {alert.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{alert.customers?.name}</p>
                          <p className="text-xs text-muted-foreground">{alert.customers?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getAlertTypeBadge(alert.alert_type)}</TableCell>
                      <TableCell className="max-w-md truncate">{alert.message}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(alert.sent_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">{alert.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AlertsManagementPanel;