import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Filter, Download, RefreshCw, Eye } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const TransactionMonitoringDashboard = () => {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [amountRange, setAmountRange] = useState([0, 10000]);

  const { transactions, loading, searchTransactions, refetch } = useTransactions(filters);

  const filteredTransactions = searchTransactions(searchTerm);

  const getRiskBadge = (score) => {
    if (score >= 70) return <Badge variant="destructive">High Risk</Badge>;
    if (score >= 40) return <Badge className="bg-yellow-500">Medium Risk</Badge>;
    return <Badge className="bg-green-500">Low Risk</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      flagged: 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const applyFilters = () => {
    setFilters({
      ...filters,
      minAmount: amountRange[0],
      maxAmount: amountRange[1]
    });
    setShowFilters(false);
  };

  return (
    <>
      <Helmet>
        <title>Transaction Monitoring - Bank Fraud Detection</title>
        <meta name="description" content="Real-time transaction monitoring and fraud detection dashboard" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transaction Monitoring</h1>
            <p className="text-muted-foreground">Real-time transaction feed and fraud detection</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>Monitor and analyze all banking transactions</CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showFilters && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Transaction Type</Label>
                      <Select onValueChange={(value) => setFilters({ ...filters, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                          <SelectItem value="withdrawal">Withdrawal</SelectItem>
                          <SelectItem value="deposit">Deposit</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select onValueChange={(value) => setFilters({ ...filters, status: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="flagged">Flagged</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Amount Range: ${amountRange[0]} - ${amountRange[1]}</Label>
                      <Slider
                        min={0}
                        max={10000}
                        step={100}
                        value={amountRange}
                        onValueChange={setAmountRange}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <Button onClick={applyFilters}>Apply Filters</Button>
                </CardContent>
              </Card>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        Loading transactions...
                      </TableCell>
                    </TableRow>
                  ) : filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono text-xs">
                          {transaction.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{transaction.customers?.name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{transaction.customers?.email || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${parseFloat(transaction.amount || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.transaction_type || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(transaction.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>{transaction.location || 'N/A'}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>{getRiskBadge(transaction.risk_score || 0)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTransaction(transaction)}
                          >
                            <Eye className="h-4 w-4" />
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

      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about this transaction
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Transaction ID</Label>
                  <p className="font-mono text-sm">{selectedTransaction.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p className="font-medium">{selectedTransaction.customers?.name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.customers?.email || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="text-2xl font-bold">${parseFloat(selectedTransaction.amount || 0).toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium capitalize">{selectedTransaction.transaction_type || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Timestamp</Label>
                  <p className="text-sm">{new Date(selectedTransaction.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="text-sm">{selectedTransaction.location || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Risk Assessment</Label>
                  <div className="mt-1">{getRiskBadge(selectedTransaction.risk_score || 0)}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionMonitoringDashboard;