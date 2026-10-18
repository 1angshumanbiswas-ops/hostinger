import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, AlertTriangle, DollarSign, TrendingUp, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';

export default function FraudDetectionDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*, customers(name, email)')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load transactions',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out'
    });
    navigate('/login');
  };

  const getRiskBadge = (riskScore) => {
    if (riskScore < 30) {
      return <Badge className="bg-green-600 hover:bg-green-700">Low Risk</Badge>;
    } else if (riskScore < 70) {
      return <Badge className="bg-yellow-600 hover:bg-yellow-700">Medium Risk</Badge>;
    } else {
      return <Badge className="bg-red-600 hover:bg-red-700">High Risk</Badge>;
    }
  };

  const getRiskColor = (riskScore) => {
    if (riskScore < 30) return 'text-green-600 dark:text-green-400';
    if (riskScore < 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const totalTransactions = transactions.length;
  const fraudAlerts = transactions.filter(t => t.risk_score > 70).length;
  const avgRiskScore = transactions.length > 0 
    ? (transactions.reduce((sum, t) => sum + t.risk_score, 0) / transactions.length).toFixed(1)
    : 0;

  return (
    <>
      <Helmet>
        <title>Dashboard - Fraud Detection System</title>
        <meta name="description" content="Monitor and analyze fraudulent transactions in real-time" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="fraud-header sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold">Fraud Detection Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Real-time transaction monitoring</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{currentUser?.email}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {currentUser?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTransactions}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fraud Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{fraudAlerts}</div>
                <p className="text-xs text-muted-foreground">High risk transactions</p>
              </CardContent>
            </Card>

            <Card className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getRiskColor(avgRiskScore)}`}>
                  {avgRiskScore}%
                </div>
                <p className="text-xs text-muted-foreground">Across all transactions</p>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <Card className="dashboard-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Monitor and analyze transaction patterns</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/alerts')}>
                  <Filter className="h-4 w-4 mr-2" />
                  View Alerts
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          Loading transactions...
                        </TableCell>
                      </TableRow>
                    ) : transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="table-row-hover">
                          <TableCell className="font-mono text-sm">
                            {transaction.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{transaction.customers?.name || 'Unknown'}</p>
                              <p className="text-xs text-muted-foreground">{transaction.customers?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${transaction.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>{transaction.location || 'N/A'}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${getRiskColor(transaction.risk_score)}`}>
                                {transaction.risk_score}%
                              </span>
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    transaction.risk_score < 30 ? 'bg-green-600' :
                                    transaction.risk_score < 70 ? 'bg-yellow-600' : 'bg-red-600'
                                  }`}
                                  style={{ width: `${transaction.risk_score}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getRiskBadge(transaction.risk_score)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: 'Feature Coming Soon',
                                  description: 'Transaction analysis will be available soon'
                                });
                              }}
                            >
                              Review
                            </Button>
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