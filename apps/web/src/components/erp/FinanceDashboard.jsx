import React, { useState } from 'react';
import { IndianRupee, ArrowLeft, ArrowRight, TrendingUp, TrendingDown, Wallet, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [revenue, setRevenue] = useState(2500000);
  const [revenueInput, setRevenueInput] = useState('');

  const [expenses, setExpenses] = useState(1200000);
  const [expensesInput, setExpensesInput] = useState('');

  const [transactions] = useState([
    { id: 1, date: '2026-04-10', description: 'Enterprise Software Licenses', category: 'Software', amount: -45000 },
    { id: 2, date: '2026-04-09', description: 'Client Payment - TechCorp Inc.', category: 'Revenue', amount: 350000 },
    { id: 3, date: '2026-04-08', description: 'Q2 Office Rent', category: 'Operations', amount: -120000 },
    { id: 4, date: '2026-04-07', description: 'Consulting Retainer', category: 'Revenue', amount: 150000 },
    { id: 5, date: '2026-04-05', description: 'Server Infrastructure', category: 'IT', amount: -85000 },
  ]);

  const netProfit = revenue - expenses;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleUpdateRevenue = () => {
    const val = parseInt(revenueInput.replace(/,/g, ''), 10);
    if (!isNaN(val)) {
      setRevenue(val);
      toast({
        title: "Revenue Updated",
        description: `Total revenue has been updated to ${formatCurrency(val)}.`,
      });
      setRevenueInput('');
    }
  };

  const handleUpdateExpenses = () => {
    const val = parseInt(expensesInput.replace(/,/g, ''), 10);
    if (!isNaN(val)) {
      setExpenses(val);
      toast({
        title: "Expenses Updated",
        description: `Operational expenses have been updated to ${formatCurrency(val)}.`,
      });
      setExpensesInput('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 relative">
      <header className="bg-slate-900 text-white shadow-sm border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#1f5233] rounded-md flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Finance Portal</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Exit Portal
          </Button>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Finance Dashboard</h2>
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
                    />
                  </div>
                  <Button 
                    onClick={handleUpdateRevenue}
                    className="bg-[#1f5233] text-white hover:bg-[#173d26] font-medium w-full shadow-sm"
                  >
                    Update Revenue
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
                    />
                  </div>
                  <Button 
                    onClick={handleUpdateExpenses}
                    className="bg-[#1f5233] text-white hover:bg-[#173d26] font-medium w-full shadow-sm"
                  >
                    Update Expenses
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
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.date}</TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell>{tx.category}</TableCell>
                      <TableCell className={`text-right font-semibold ${tx.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 pb-8">
          <Button
            onClick={() => navigate('/hr-portal')}
            variant="outline"
            className="border-gray-300 text-slate-700 hover:bg-gray-50 flex items-center gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to HR Dashboard
          </Button>
          <Button
            onClick={() => navigate('/crm-manager')}
            className="bg-[#1f5233] text-white hover:bg-[#173d26] shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
          >
            <span className="font-semibold">Go to CRM Manager</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Universal Pagination Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/hr-portal')}
            className="flex items-center gap-2 border-gray-300 text-slate-700 hover:bg-slate-100 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Page 3 of 6
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Finance Dashboard
            </span>
          </div>

          <Button
            onClick={() => navigate('/crm-manager')}
            className="flex items-center gap-2 bg-[#1f5233] text-white hover:bg-[#173d26]"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}