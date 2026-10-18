import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, TrendingDown, Wallet, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export default function FinancialHealthPage() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [metricId, setMetricId] = useState(null);
  const [fetchError, setFetchError] = useState(false);

  const [revenue, setRevenue] = useState(2500000);
  const [revenueInput, setRevenueInput] = useState('');

  const [expenses, setExpenses] = useState(1200000);
  const [expensesInput, setExpensesInput] = useState('');

  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const netProfit = revenue - expenses;

  useEffect(() => {
    fetchFinanceData();
  }, [currentPage]);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      setFetchError(false);

      // Fetch metrics
      const metricsResult = await supabase
        .from('finance_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (metricsResult.error && metricsResult.error.code !== 'PGRST116') {
        throw metricsResult.error;
      }

      if (metricsResult.data) {
        setMetricId(metricsResult.data.id);
        setRevenue(metricsResult.data.total_revenue || 2500000);
        setExpenses(metricsResult.data.operational_expenses || 1200000);
      }

      // Fetch total count for pagination
      const { count, error: countError } = await supabase
        .from('transaction_tracker')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      const total = count || 0;
      setTotalPages(Math.max(1, Math.ceil(total / itemsPerPage)));

      // Fetch transactions with pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const transactionsResult = await supabase
        .from('transaction_tracker')
        .select('*')
        .order('date', { ascending: false })
        .range(from, to);

      if (transactionsResult.error) throw transactionsResult.error;
      setTransactions(transactionsResult.data || []);

    } catch (error) {
      console.error('Error fetching finance data:', error);
      setFetchError(true);
      toast({
        title: "Error Loading Data",
        description: "Failed to load financial data from database.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMetrics = async (updates) => {
    try {
      setUpdating(true);

      if (metricId) {
        const { error } = await supabase
          .from('finance_metrics')
          .update({
            ...updates,
            net_profit: updates.total_revenue !== undefined && updates.operational_expenses !== undefined
              ? updates.total_revenue - updates.operational_expenses
              : (updates.total_revenue || revenue) - (updates.operational_expenses || expenses),
            updated_at: new Date().toISOString()
          })
          .eq('id', metricId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('finance_metrics')
          .insert([{
            total_revenue: revenue,
            operational_expenses: expenses,
            net_profit: revenue - expenses,
            ...updates
          }])
          .select()
          .single();

        if (error) throw error;
        if (data) setMetricId(data.id);
      }

      toast({
        title: "Success",
        description: "Financial metrics updated successfully."
      });
    } catch (error) {
      console.error('Error updating finance metrics:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update financial metrics in database.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (value) => {
    const absValue = Math.abs(value);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(absValue);
  };

  const formatAmount = (amount) => {
    const formatted = formatCurrency(amount);
    if (amount >= 0) {
      return `+${formatted}`;
    }
    return `-${formatted}`;
  };

  const handleUpdateRevenue = async () => {
    const val = parseInt(revenueInput.replace(/,/g, ''), 10);
    if (!isNaN(val) && val >= 0) {
      setRevenue(val);
      await updateMetrics({ total_revenue: val, operational_expenses: expenses });
      setRevenueInput('');
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid revenue amount.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateExpenses = async () => {
    const val = parseInt(expensesInput.replace(/,/g, ''), 10);
    if (!isNaN(val) && val >= 0) {
      setExpenses(val);
      await updateMetrics({ total_revenue: revenue, operational_expenses: val });
      setExpensesInput('');
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid expense amount.",
        variant: "destructive"
      });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f5233] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading financial data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">Failed to load financial data</p>
            <Button onClick={fetchFinanceData} className="bg-[#1f5233] text-white hover:bg-[#173d26]">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Financial Health</h2>
          <p className="text-muted-foreground mt-1">Track revenue, expenses, and overall financial health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Total Revenue</CardTitle>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-bold text-slate-900 dark:text-white py-2 truncate">
              {formatCurrency(revenue)}
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-border">
              <Label htmlFor="revenue-input" className="text-sm font-semibold text-slate-600 dark:text-gray-300">
                Update Revenue
              </Label>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="revenue-input"
                    type="number"
                    value={revenueInput} 
                    onChange={(e) => setRevenueInput(e.target.value)}
                    className="pl-9 bg-white dark:bg-background text-slate-900 dark:text-white focus-visible:ring-[#1f5233]"
                    placeholder="Enter total revenue"
                    disabled={updating}
                  />
                </div>
                <Button 
                  onClick={handleUpdateRevenue}
                  className="bg-[#1f5233] text-white hover:bg-[#173d26] font-medium w-full shadow-sm"
                  disabled={updating || !revenueInput}
                >
                  {updating ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Operational Expenses</CardTitle>
            <TrendingDown className="w-5 h-5 text-rose-500" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-bold text-slate-900 dark:text-white py-2 truncate">
              {formatCurrency(expenses)}
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-border">
              <Label htmlFor="expenses-input" className="text-sm font-semibold text-slate-600 dark:text-gray-300">
                Update Expenses
              </Label>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="expenses-input"
                    type="number"
                    value={expensesInput} 
                    onChange={(e) => setExpensesInput(e.target.value)}
                    className="pl-9 bg-white dark:bg-background text-slate-900 dark:text-white focus-visible:ring-[#1f5233]"
                    placeholder="Enter total expenses"
                    disabled={updating}
                  />
                </div>
                <Button 
                  onClick={handleUpdateExpenses}
                  className="bg-[#1f5233] text-white hover:bg-[#173d26] font-medium w-full shadow-sm"
                  disabled={updating || !expensesInput}
                >
                  {updating ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Net Profit</CardTitle>
            <Wallet className="w-5 h-5 text-[#1f5233]" />
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
            <div className={`text-4xl font-bold py-2 truncate ${netProfit >= 0 ? 'text-[#1f5233] dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {formatCurrency(netProfit)}
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-border">
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800 p-4 rounded-lg space-y-2">
                <Label className="text-sm font-semibold text-slate-600 dark:text-gray-400">Calculation</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Net Profit is automatically calculated by subtracting Operational Expenses from Total Revenue.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border mt-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Transaction Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="w-[150px] font-semibold text-slate-700 dark:text-slate-300">Date</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Description</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Category</TableHead>
                  <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Amount (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                        {tx.date}
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">
                        {tx.description}
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">
                        {tx.category}
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${tx.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {formatAmount(tx.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {transactions.length > 0 && (
            <div className="flex items-center justify-between mt-6 px-2">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="text-slate-700 dark:text-slate-300"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="text-slate-700 dark:text-slate-300"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}