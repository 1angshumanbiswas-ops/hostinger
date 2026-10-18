import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, Briefcase, Bell, TrendingUp, Eye } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Dashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalTransactions: 0,
    flaggedTransactions: 0,
    activeCases: 0,
    alertsSent: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState({ low: 0, medium: 0, high: 0 });
  const [caseStatus, setCaseStatus] = useState({
    investigating: 0,
    confirmed_fraud: 0,
    false_positive: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .gte('created_at', today.toISOString());

    const { data: cases } = await supabase
      .from('fraud_cases')
      .select('*');

    const { data: alerts } = await supabase
      .from('alerts')
      .select('*')
      .gte('sent_at', today.toISOString());

    const { data: recentTx } = await supabase
      .from('transactions')
      .select(`
        *,
        customers (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    setMetrics({
      totalTransactions: transactions?.length || 0,
      flaggedTransactions: transactions?.filter(t => (t.risk_score || 0) >= 40).length || 0,
      activeCases: cases?.filter(c => c.status === 'investigating').length || 0,
      alertsSent: alerts?.length || 0
    });

    setRecentTransactions(recentTx || []);

    const riskDist = {
      low: transactions?.filter(t => (t.risk_score || 0) < 40).length || 0,
      medium: transactions?.filter(t => (t.risk_score || 0) >= 40 && (t.risk_score || 0) < 70).length || 0,
      high: transactions?.filter(t => (t.risk_score || 0) >= 70).length || 0
    };
    setRiskDistribution(riskDist);

    const caseStatusData = {
      investigating: cases?.filter(c => c.status === 'investigating').length || 0,
      confirmed_fraud: cases?.filter(c => c.status === 'confirmed_fraud').length || 0,
      false_positive: cases?.filter(c => c.status === 'false_positive').length || 0,
      resolved: cases?.filter(c => c.status === 'resolved').length || 0
    };
    setCaseStatus(caseStatusData);

    setLoading(false);
  };

  const getRiskBadge = (score) => {
    if (score >= 70) return <Badge variant="destructive">High Risk</Badge>;
    if (score >= 40) return <Badge className="bg-yellow-500">Medium Risk</Badge>;
    return <Badge className="bg-green-500">Low Risk</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Bank Fraud Detection</title>
        <meta name="description" content="Fraud detection dashboard overview and metrics" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fraud Detection Dashboard</h1>
          <p className="text-muted-foreground">Real-time overview of fraud detection activities</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
                Today's transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Flagged Transactions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{metrics.flaggedTransactions}</div>
              <p className="text-xs text-muted-foreground">
                Requiring review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{metrics.activeCases}</div>
              <p className="text-xs text-muted-foreground">
                Under investigation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alerts Sent</CardTitle>
              <Bell className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.alertsSent}</div>
              <p className="text-xs text-muted-foreground">
                Today's notifications
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Risk Score Distribution</CardTitle>
              <CardDescription>Transaction risk assessment breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">Low Risk</span>
                </div>
                <span className="text-2xl font-bold">{riskDistribution.low}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-sm font-medium">Medium Risk</span>
                </div>
                <span className="text-2xl font-bold">{riskDistribution.medium}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium">High Risk</span>
                </div>
                <span className="text-2xl font-bold">{riskDistribution.high}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Case Status Breakdown</CardTitle>
              <CardDescription>Current investigation status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">Investigating</span>
                </div>
                <span className="text-2xl font-bold">{caseStatus.investigating}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium">Confirmed Fraud</span>
                </div>
                <span className="text-2xl font-bold">{caseStatus.confirmed_fraud}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">False Positive</span>
                </div>
                <span className="text-2xl font-bold">{caseStatus.false_positive}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-500" />
                  <span className="text-sm font-medium">Resolved</span>
                </div>
                <span className="text-2xl font-bold">{caseStatus.resolved}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest transaction activity</CardDescription>
              </div>
              <Button variant="outline" onClick={() => navigate('/fraud/transactions')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Risk Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : recentTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No recent transactions
                    </TableCell>
                  </TableRow>
                ) : (
                  recentTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{tx.customers?.name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{tx.customers?.email || 'N/A'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${parseFloat(tx.amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.transaction_type || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(tx.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>{getRiskBadge(tx.risk_score || 0)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={() => navigate('/fraud/transactions')} className="flex-1">
            View All Transactions
          </Button>
          <Button onClick={() => navigate('/fraud/cases')} variant="outline" className="flex-1">
            View All Cases
          </Button>
          <Button onClick={() => navigate('/fraud/rules')} variant="outline" className="flex-1">
            Configure Rules
          </Button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;