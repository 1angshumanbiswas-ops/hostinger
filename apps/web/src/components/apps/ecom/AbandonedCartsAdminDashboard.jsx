import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/customSupabaseClient';
import { formatDistanceToNow, format } from 'date-fns';
import { Download, Search, RefreshCw, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';
import AbandonedCartDetailsModal from './AbandonedCartDetailsModal';
import { useToast } from '@/components/ui/use-toast';

export default function AbandonedCartsAdminDashboard() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCart, setSelectedCart] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchCarts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('abandoned_carts')
        .select('*')
        .order('abandoned_at', { ascending: false });
      
      if (error) throw error;
      setCarts(data || []);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error loading carts', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCarts = carts.filter(c => {
    const matchesSearch = (c.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (c.customer_email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : 
                          statusFilter === 'recovered' ? c.recovered : !c.recovered;
    return matchesSearch && matchesStatus;
  });

  const totalAbandoned = carts.length;
  const recoveredCount = carts.filter(c => c.recovered).length;
  const recoveryRate = totalAbandoned > 0 ? ((recoveredCount / totalAbandoned) * 100).toFixed(1) : 0;
  const valueAtRisk = carts.filter(c => !c.recovered).reduce((acc, c) => acc + Number(c.cart_value), 0);
  const valueRecovered = carts.filter(c => c.recovered).reduce((acc, c) => acc + Number(c.cart_value), 0);

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Customer', 'Email', 'Value', 'Status', 'Abandoned At', 'Notified At'].join(','),
      ...filteredCarts.map(c => [
        c.id, c.customer_name, c.customer_email, c.cart_value, 
        c.recovered ? 'Recovered' : 'Abandoned',
        c.abandoned_at, c.notification_sent_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abandoned_carts_${format(new Date(), 'yyyyMMdd')}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Abandoned Carts</h1>
          <p className="text-slate-500">Monitor and manage recovery efforts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
          <Button onClick={fetchCarts}><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Abandoned</p><h3 className="text-2xl font-bold">{totalAbandoned}</h3></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Recovery Rate</p><h3 className="text-2xl font-bold text-blue-600">{recoveryRate}%</h3></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Value at Risk</p><h3 className="text-2xl font-bold text-amber-600">${valueAtRisk.toFixed(2)}</h3></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Value Recovered</p><h3 className="text-2xl font-bold text-green-600">${valueRecovered.toFixed(2)}</h3></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle>Cart List</CardTitle>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input className="pl-8" placeholder="Search customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Carts</SelectItem>
                  <SelectItem value="recovered">Recovered</SelectItem>
                  <SelectItem value="abandoned">Not Recovered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Customer</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Notification</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8"><RefreshCw className="w-6 h-6 animate-spin mx-auto text-slate-400" /></TableCell></TableRow>
              ) : filteredCarts.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-500">No carts found.</TableCell></TableRow>
              ) : (
                filteredCarts.map(cart => (
                  <TableRow key={cart.id}>
                    <TableCell className="pl-4">
                      <div className="font-medium">{cart.customer_name || 'Guest'}</div>
                      <div className="text-xs text-slate-500">{cart.customer_email || 'No email'}</div>
                    </TableCell>
                    <TableCell className="font-semibold">${Number(cart.cart_value).toFixed(2)}</TableCell>
                    <TableCell>
                      {cart.recovered ? 
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Recovered</Badge> : 
                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Abandoned</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {cart.abandoned_at ? formatDistanceToNow(new Date(cart.abandoned_at), { addSuffix: true }) : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {cart.notification_sent_at ? (
                        <span className="text-xs text-green-600 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1"/> Sent</span>
                      ) : (
                        <span className="text-xs text-slate-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Pending</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedCart(cart); setModalOpen(true); }}>
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AbandonedCartDetailsModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        cart={selectedCart} 
        onRefresh={fetchCarts}
      />
    </div>
  );
}