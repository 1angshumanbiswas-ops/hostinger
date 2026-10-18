import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export default function FraudAlertsPanel() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*, customers(name, email)')
        .gt('risk_score', 70)
        .order('risk_score', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load fraud alerts',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = (transactionId) => {
    toast({
      title: 'Review Started',
      description: 'Transaction is now under review'
    });
  };

  const handleDismiss = (transactionId) => {
    toast({
      title: 'Alert Dismissed',
      description: 'Transaction marked as safe'
    });
  };

  return (
    <>
      <Helmet>
        <title>Fraud Alerts - Fraud Detection System</title>
        <meta name="description" content="High-risk transaction alerts and monitoring" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="fraud-header sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <h1 className="text-xl font-bold">Fraud Alerts</h1>
                  <p className="text-sm text-muted-foreground">High-risk transaction monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Summary Card */}
          <Card className="metric-card mb-8">
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Transactions with risk score above 70%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-destructive">
                {alerts.length}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          {/* Alerts Table */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>High-Risk Transactions</CardTitle>
              <CardDescription>Review and take action on suspicious activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alert ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Risk Reason</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          Loading alerts...
                        </TableCell>
                      </TableRow>
                    ) : alerts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                            <p className="font-medium">No high-risk alerts</p>
                            <p className="text-sm text-muted-foreground">All transactions are within normal parameters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      alerts.map((alert) => (
                        <TableRow key={alert.id} className="table-row-hover">
                          <TableCell className="font-mono text-sm">
                            {alert.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{alert.customers?.name || 'Unknown'}</p>
                              <p className="text-xs text-muted-foreground">{alert.customers?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-destructive">
                            ${alert.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>{alert.location || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-red-600 hover:bg-red-700">
                                {alert.risk_score}%
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {alert.risk_score > 90 ? 'Critical anomaly detected' :
                               alert.risk_score > 80 ? 'Unusual transaction pattern' :
                               'Elevated risk indicators'}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(alert.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleReview(alert.id)}
                              >
                                <Shield className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDismiss(alert.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}