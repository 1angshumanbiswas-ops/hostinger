import React, { useState } from 'react';
import { Package, Archive, CheckCircle, ArrowLeft, ChevronLeft, ChevronRight, Save, Truck, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export default function SCMLogisticsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Metrics State
  const [metrics, setMetrics] = useState({
    pendingOrders: 45,
    inventoryLevel: 85,
    fulfillmentRate: 92
  });

  const [metricInputs, setMetricInputs] = useState({
    pendingOrders: '',
    inventoryLevel: '',
    fulfillmentRate: ''
  });

  // Existing Orders State
  const [orders, setOrders] = useState([
    { id: 'ORD-2026-001', description: 'Server Hardware Racks', status: 'Pending', partner: 'FedEx Express' },
    { id: 'ORD-2026-002', description: 'Office Supplies Q2', status: 'Shipped', partner: 'DHL Global' },
    { id: 'ORD-2026-003', description: 'Cloud Infrastructure Nodes', status: 'Delivered', partner: 'AWS Logistics' },
    { id: 'ORD-2026-004', description: 'Marketing Materials', status: 'Cancelled', partner: 'UPS' },
  ]);

  // New Management Boxes States
  const [inventory, setInventory] = useState([
    { id: 1, sku: 'SKU-9901', stock: 450, location: 'Warehouse A' },
    { id: 2, sku: 'SKU-9902', stock: 120, location: 'Warehouse B' }
  ]);

  const [manufacturing, setManufacturing] = useState([
    { id: 1, batchId: 'BATCH-2026-01', status: 'QC', timeline: 'Week 14-16' },
    { id: 2, batchId: 'BATCH-2026-02', status: 'Planning', timeline: 'Week 17-20' }
  ]);

  const [procurement, setProcurement] = useState([
    { id: 1, vendor: 'Global Tech Supplies', po: 'PO-5501', value: 250000 },
    { id: 2, vendor: 'Office Logistics Inc', po: 'PO-5502', value: 45000 }
  ]);

  const handleUpdateMetric = (key) => {
    const val = parseInt(metricInputs[key].replace(/,/g, ''), 10);
    if (!isNaN(val)) {
      setMetrics(prev => ({ ...prev, [key]: val }));
      toast({ title: "Metric Updated", description: "The dashboard has been updated successfully." });
      setMetricInputs(prev => ({ ...prev, [key]: '' }));
    } else {
      toast({ title: "Invalid Input", description: "Please enter a valid number.", variant: "destructive" });
    }
  };

  const handleOrderChange = (id, field, value) => {
    setOrders(orders.map(order => order.id === id ? { ...order, [field]: value } : order));
  };

  const handleUpdateOrder = (id) => {
    toast({ title: "Order Updated", description: `Changes to ${id} have been saved.` });
  };

  // Handlers for New Boxes
  const handleInvChange = (id, field, val) => setInventory(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i));
  const addInvRow = () => setInventory(prev => [...prev, { id: Date.now(), sku: '', stock: 0, location: '' }]);
  const delInvRow = (id) => setInventory(prev => prev.filter(i => i.id !== id));

  const handleMfgChange = (id, field, val) => setManufacturing(prev => prev.map(m => m.id === id ? { ...m, [field]: val } : m));
  const addMfgRow = () => setManufacturing(prev => [...prev, { id: Date.now(), batchId: '', status: 'Planning', timeline: '' }]);
  const delMfgRow = (id) => setManufacturing(prev => prev.filter(m => m.id !== id));

  const handleProcChange = (id, field, val) => setProcurement(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));
  const addProcRow = () => setProcurement(prev => [...prev, { id: Date.now(), vendor: '', po: '', value: 0 }]);
  const delProcRow = (id) => setProcurement(prev => prev.filter(p => p.id !== id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 relative">
      <header className="bg-slate-900 text-white shadow-sm border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#1f5233] rounded-md flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">SCM & Logistics Portal</h1>
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
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">SCM Logistics</h2>
            <p className="text-muted-foreground mt-1">Manage supply chain, track inventory levels, and monitor order fulfillment.</p>
          </div>
        </div>

        {/* 3-Column Grid for Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Pending Orders</CardTitle>
              <Package className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold text-slate-900 dark:text-white py-2">{metrics.pendingOrders}</div>
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-border">
                <Label className="text-sm font-semibold text-slate-600 dark:text-gray-300">Update Orders</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number"
                    value={metricInputs.pendingOrders} 
                    onChange={(e) => setMetricInputs({...metricInputs, pendingOrders: e.target.value})}
                    className="bg-white dark:bg-background text-slate-900 dark:text-white"
                  />
                  <Button onClick={() => handleUpdateMetric('pendingOrders')} className="bg-[#1f5233] text-white hover:bg-[#173d26]">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Inventory Level</CardTitle>
              <Archive className="w-5 h-5 text-amber-500" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold text-slate-900 dark:text-white py-2">{metrics.inventoryLevel}%</div>
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-border">
                <Label className="text-sm font-semibold text-slate-600 dark:text-gray-300">Update Level (%)</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number"
                    value={metricInputs.inventoryLevel} 
                    onChange={(e) => setMetricInputs({...metricInputs, inventoryLevel: e.target.value})}
                    className="bg-white dark:bg-background text-slate-900 dark:text-white"
                  />
                  <Button onClick={() => handleUpdateMetric('inventoryLevel')} className="bg-[#1f5233] text-white hover:bg-[#173d26]">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Fulfillment Rate</CardTitle>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold text-slate-900 dark:text-white py-2">{metrics.fulfillmentRate}%</div>
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-border">
                <Label className="text-sm font-semibold text-slate-600 dark:text-gray-300">Update Rate (%)</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number"
                    value={metricInputs.fulfillmentRate} 
                    onChange={(e) => setMetricInputs({...metricInputs, fulfillmentRate: e.target.value})}
                    className="bg-white dark:bg-background text-slate-900 dark:text-white"
                  />
                  <Button onClick={() => handleUpdateMetric('fulfillmentRate')} className="bg-[#1f5233] text-white hover:bg-[#173d26]">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order & Inventory Flow Table */}
        <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Order & Inventory Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Order ID</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Item/Service Description</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Logistics Partner</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Input 
                          value={order.id}
                          onChange={(e) => handleOrderChange(order.id, 'id', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border min-w-[120px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={order.description}
                          onChange={(e) => handleOrderChange(order.id, 'description', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border min-w-[200px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={order.status} onValueChange={(val) => handleOrderChange(order.id, 'status', val)}>
                          <SelectTrigger className="h-8 w-[140px] bg-transparent border-transparent hover:border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={order.partner}
                          onChange={(e) => handleOrderChange(order.id, 'partner', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border min-w-[150px]"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          className="bg-[#1f5233] text-white hover:bg-[#173d26]"
                          onClick={() => handleUpdateOrder(order.id)}
                        >
                          <Save className="w-3 h-3 mr-2" /> Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* BOX 1: INVENTORY MANAGEMENT */}
        <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Inventory Management</CardTitle>
            <Button size="sm" onClick={addInvRow} className="bg-[#1f5233] text-white hover:bg-[#173d26]">
              <Plus className="w-4 h-4 mr-2" /> Add Row
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Item SKU</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Current Stock</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Location</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input 
                          value={item.sku}
                          onChange={(e) => handleInvChange(item.id, 'sku', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border"
                          placeholder="SKU"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number"
                          value={item.stock}
                          onChange={(e) => handleInvChange(item.id, 'stock', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={item.location}
                          onChange={(e) => handleInvChange(item.id, 'location', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border"
                          placeholder="Location"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => delInvRow(item.id)} className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {inventory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No inventory records found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* BOX 2: MANUFACTURING & PRODUCTION */}
        <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Manufacturing & Production</CardTitle>
            <Button size="sm" onClick={addMfgRow} className="bg-[#1f5233] text-white hover:bg-[#173d26]">
              <Plus className="w-4 h-4 mr-2" /> Add Row
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Batch ID</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Timeline</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manufacturing.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell>
                        <Input 
                          value={batch.batchId}
                          onChange={(e) => handleMfgChange(batch.id, 'batchId', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border"
                          placeholder="Batch ID"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={batch.status} onValueChange={(val) => handleMfgChange(batch.id, 'status', val)}>
                          <SelectTrigger className="h-8 w-[140px] bg-transparent border-transparent hover:border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Planning">Planning</SelectItem>
                            <SelectItem value="QC">QC</SelectItem>
                            <SelectItem value="Done">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={batch.timeline}
                          onChange={(e) => handleMfgChange(batch.id, 'timeline', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border"
                          placeholder="e.g. Q3 2026"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => delMfgRow(batch.id)} className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {manufacturing.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No manufacturing records found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* BOX 3: PROCUREMENT & VENDORS */}
        <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Procurement & Vendors</CardTitle>
            <Button size="sm" onClick={addProcRow} className="bg-[#1f5233] text-white hover:bg-[#173d26]">
              <Plus className="w-4 h-4 mr-2" /> Add Row
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Vendor Name</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">PO Number</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Total Value (₹)</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {procurement.map((proc) => (
                    <TableRow key={proc.id}>
                      <TableCell>
                        <Input 
                          value={proc.vendor}
                          onChange={(e) => handleProcChange(proc.id, 'vendor', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border"
                          placeholder="Vendor Name"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={proc.po}
                          onChange={(e) => handleProcChange(proc.id, 'po', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border"
                          placeholder="PO Number"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number"
                          value={proc.value}
                          onChange={(e) => handleProcChange(proc.id, 'value', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => delProcRow(proc.id)} className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {procurement.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No procurement records found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Back Navigation & Next Navigation */}
        <div className="pt-4 pb-8 flex justify-between items-center">
          <Button
            onClick={() => navigate('/crm-manager')}
            variant="outline"
            className="border-gray-300 text-slate-700 hover:bg-gray-50 flex items-center gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to CRM Manager
          </Button>
          <Button
            onClick={() => navigate('/nse-stock-dashboard')}
            className="bg-[#1f5233] text-white hover:bg-[#173d26] shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
          >
            <span className="font-semibold">Go to NSE STOCK MARKET Agentic AI</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Universal Pagination Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/crm-manager')}
            className="flex items-center gap-2 border-gray-300 text-slate-700 hover:bg-slate-100 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Page 5 of 6
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              SCM Logistics
            </span>
          </div>

          <Button
            onClick={() => navigate('/nse-stock-dashboard')}
            className="flex items-center gap-2 bg-[#1f5233] text-white hover:bg-[#173d26]"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}