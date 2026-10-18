import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Edit2, Package, Archive, CheckCircle, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export default function SCMLogisticsPage() {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [metricId, setMetricId] = useState(null);

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

  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [manufacturing, setManufacturing] = useState([]);

  useEffect(() => {
    fetchSCMData();
  }, []);

  const fetchSCMData = async () => {
    try {
      setLoading(true);

      const [metricsResult, ordersResult, inventoryResult, manufacturingResult] = await Promise.all([
        supabase
          .from('scm_metrics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('orders_scm')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('inventory')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('manufacturing')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      if (metricsResult.error && metricsResult.error.code !== 'PGRST116') {
        throw metricsResult.error;
      }

      if (metricsResult.data) {
        setMetricId(metricsResult.data.id);
        setMetrics({
          pendingOrders: metricsResult.data.pending_orders,
          inventoryLevel: metricsResult.data.inventory_level,
          fulfillmentRate: metricsResult.data.fulfillment_rate
        });
      }

      if (ordersResult.error) throw ordersResult.error;
      setOrders((ordersResult.data || []).map(order => ({ ...order, isEditing: false })));

      if (inventoryResult.error) throw inventoryResult.error;
      setInventory(inventoryResult.data || []);

      if (manufacturingResult.error) throw manufacturingResult.error;
      setManufacturing(manufacturingResult.data || []);

    } catch (error) {
      console.error('Error fetching SCM data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load SCM data from database.",
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
          .from('scm_metrics')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', metricId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('scm_metrics')
          .insert([{
            pending_orders: metrics.pendingOrders,
            inventory_level: metrics.inventoryLevel,
            fulfillment_rate: metrics.fulfillmentRate,
            ...updates
          }])
          .select()
          .single();

        if (error) throw error;
        if (data) setMetricId(data.id);
      }

      toast({
        title: "Success",
        description: "SCM metrics updated successfully."
      });
    } catch (error) {
      console.error('Error updating SCM metrics:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update SCM metrics in database.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateMetric = async (key) => {
    const val = parseInt(metricInputs[key].replace(/,/g, ''), 10);
    if (!isNaN(val) && val >= 0) {
      const updates = { ...metrics };
      
      if (key === 'pendingOrders') updates.pendingOrders = val;
      if (key === 'inventoryLevel') updates.inventoryLevel = val;
      if (key === 'fulfillmentRate') updates.fulfillmentRate = val;

      setMetrics(updates);
      
      await updateMetrics({
        pending_orders: updates.pendingOrders,
        inventory_level: updates.inventoryLevel,
        fulfillment_rate: updates.fulfillmentRate
      });
      
      setMetricInputs(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleOrderChange = (id, field, value) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, [field]: value } : order
    ));
  };

  const toggleOrderEdit = (id) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, isEditing: !order.isEditing } : order
    ));
  };

  const saveOrder = async (id) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    try {
      const { error } = await supabase
        .from('orders_scm')
        .update({
          order_id: order.order_id,
          item_description: order.item_description,
          status: order.status,
          logistics_partner: order.logistics_partner
        })
        .eq('id', id);

      if (error) throw error;

      toggleOrderEdit(id);
      toast({
        title: "Success",
        description: "Order updated successfully."
      });
    } catch (error) {
      console.error('Error saving order:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update order in database.",
        variant: "destructive"
      });
    }
  };

  const handleInvChange = (id, field, val) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i));
  };

  const addInvRow = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .insert([{
          item_sku: '',
          current_stock: 0,
          location: ''
        }])
        .select()
        .single();

      if (error) throw error;
      setInventory(prev => [...prev, data]);
      
      toast({
        title: "Success",
        description: "New inventory row added."
      });
    } catch (error) {
      console.error('Error adding inventory row:', error);
      toast({
        title: "Add Failed",
        description: "Failed to add inventory row to database.",
        variant: "destructive"
      });
    }
  };

  const delInvRow = async (id) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setInventory(prev => prev.filter(i => i.id !== id));
      
      toast({
        title: "Success",
        description: "Inventory row deleted."
      });
    } catch (error) {
      console.error('Error deleting inventory row:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete inventory row from database.",
        variant: "destructive"
      });
    }
  };

  const handleMfgChange = (id, field, val) => {
    setManufacturing(prev => prev.map(m => m.id === id ? { ...m, [field]: val } : m));
  };

  const addMfgRow = async () => {
    try {
      const { data, error } = await supabase
        .from('manufacturing')
        .insert([{
          batch_id: '',
          status: 'Planning',
          timeline: ''
        }])
        .select()
        .single();

      if (error) throw error;
      setManufacturing(prev => [...prev, data]);
      
      toast({
        title: "Success",
        description: "New manufacturing row added."
      });
    } catch (error) {
      console.error('Error adding manufacturing row:', error);
      toast({
        title: "Add Failed",
        description: "Failed to add manufacturing row to database.",
        variant: "destructive"
      });
    }
  };

  const delMfgRow = async (id) => {
    try {
      const { error } = await supabase
        .from('manufacturing')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setManufacturing(prev => prev.filter(m => m.id !== id));
      
      toast({
        title: "Success",
        description: "Manufacturing row deleted."
      });
    } catch (error) {
      console.error('Error deleting manufacturing row:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete manufacturing row from database.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f5233] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading SCM data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">SCM & Logistics</h2>
          <p className="text-muted-foreground mt-1">Track shipments and manage supply chain operations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Pending Orders</CardTitle>
            <Package className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-bold text-foreground">{metrics.pendingOrders}</div>
            <div className="space-y-3 pt-4 border-t border-border/50">
              <Label className="text-sm font-semibold">Update Orders</Label>
              <div className="flex gap-2">
                <Input 
                  type="number"
                  value={metricInputs.pendingOrders} 
                  onChange={(e) => setMetricInputs({...metricInputs, pendingOrders: e.target.value})}
                  className="bg-background text-foreground"
                  disabled={updating}
                />
                <Button 
                  onClick={() => handleUpdateMetric('pendingOrders')} 
                  className="bg-[#1f5233] text-white hover:bg-[#173d26]"
                  disabled={updating || !metricInputs.pendingOrders}
                >
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Inventory Level</CardTitle>
            <Archive className="w-5 h-5 text-amber-600" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-bold text-foreground">{metrics.inventoryLevel}%</div>
            <div className="space-y-3 pt-4 border-t border-border/50">
              <Label className="text-sm font-semibold">Update Level (%)</Label>
              <div className="flex gap-2">
                <Input 
                  type="number"
                  value={metricInputs.inventoryLevel} 
                  onChange={(e) => setMetricInputs({...metricInputs, inventoryLevel: e.target.value})}
                  className="bg-background text-foreground"
                  disabled={updating}
                />
                <Button 
                  onClick={() => handleUpdateMetric('inventoryLevel')} 
                  className="bg-[#1f5233] text-white hover:bg-[#173d26]"
                  disabled={updating || !metricInputs.inventoryLevel}
                >
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Fulfillment Rate</CardTitle>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-bold text-foreground">{metrics.fulfillmentRate}%</div>
            <div className="space-y-3 pt-4 border-t border-border/50">
              <Label className="text-sm font-semibold">Update Rate (%)</Label>
              <div className="flex gap-2">
                <Input 
                  type="number"
                  value={metricInputs.fulfillmentRate} 
                  onChange={(e) => setMetricInputs({...metricInputs, fulfillmentRate: e.target.value})}
                  className="bg-background text-foreground"
                  disabled={updating}
                />
                <Button 
                  onClick={() => handleUpdateMetric('fulfillmentRate')} 
                  className="bg-[#1f5233] text-white hover:bg-[#173d26]"
                  disabled={updating || !metricInputs.fulfillmentRate}
                >
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card shadow-sm border-border">
        <CardHeader className="pb-0 border-b border-border/50 mb-4">
          <CardTitle className="text-lg font-bold pb-4">Order & Inventory Flow</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="min-w-[140px] font-semibold text-foreground">Order ID</TableHead>
                  <TableHead className="min-w-[200px] font-semibold text-foreground">Item Description</TableHead>
                  <TableHead className="min-w-[120px] font-semibold text-foreground">Status</TableHead>
                  <TableHead className="min-w-[150px] font-semibold text-foreground">Logistics Partner</TableHead>
                  <TableHead className="w-[120px] text-right font-semibold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No orders found in logistics system.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        {order.isEditing ? (
                          <Input 
                            type="text"
                            value={order.order_id}
                            onChange={(e) => handleOrderChange(order.id, 'order_id', e.target.value)}
                            className="h-9 w-full bg-background"
                          />
                        ) : (
                          <span className="font-medium">{order.order_id}</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {order.isEditing ? (
                          <Input 
                            type="text"
                            value={order.item_description}
                            onChange={(e) => handleOrderChange(order.id, 'item_description', e.target.value)}
                            className="h-9 w-full bg-background"
                          />
                        ) : (
                          <span>{order.item_description}</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {order.isEditing ? (
                          <Select 
                            value={order.status} 
                            onValueChange={(value) => handleOrderChange(order.id, 'status', value)}
                          >
                            <SelectTrigger className="h-9 w-full bg-background">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Shipped">Shipped</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                              order.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
                              'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'}`}
                          >
                            {order.status}
                          </span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {order.isEditing ? (
                          <Input 
                            type="text"
                            value={order.logistics_partner}
                            onChange={(e) => handleOrderChange(order.id, 'logistics_partner', e.target.value)}
                            className="h-9 w-full bg-background"
                          />
                        ) : (
                          <span>{order.logistics_partner}</span>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {order.isEditing ? (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => saveOrder(order.id)}
                              className="h-8 w-8 text-[#1f5233] hover:text-[#173d26] hover:bg-[#1f5233]/10"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleOrderEdit(order.id)}
                              className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
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

      <Card className="bg-card shadow-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Inventory Management</CardTitle>
          <Button size="sm" onClick={addInvRow} className="bg-[#1f5233] text-white hover:bg-[#173d26]">
            <Plus className="w-4 h-4 mr-2" /> Add Row
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold text-foreground">Item SKU</TableHead>
                  <TableHead className="font-semibold text-foreground">Current Stock</TableHead>
                  <TableHead className="font-semibold text-foreground">Location</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input 
                        value={item.item_sku}
                        onChange={(e) => handleInvChange(item.id, 'item_sku', e.target.value)}
                        className="h-8 bg-transparent border-transparent hover:border-border focus:border-border"
                        placeholder="SKU"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number"
                        value={item.current_stock}
                        onChange={(e) => handleInvChange(item.id, 'current_stock', e.target.value)}
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => delInvRow(item.id)} 
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {inventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No inventory records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Manufacturing & Production</CardTitle>
          <Button size="sm" onClick={addMfgRow} className="bg-[#1f5233] text-white hover:bg-[#173d26]">
            <Plus className="w-4 h-4 mr-2" /> Add Row
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold text-foreground">Batch ID</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground">Timeline</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manufacturing.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>
                      <Input 
                        value={batch.batch_id}
                        onChange={(e) => handleMfgChange(batch.id, 'batch_id', e.target.value)}
                        className="h-8 bg-transparent border-transparent hover:border-border focus:border-border"
                        placeholder="Batch ID"
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={batch.status} 
                        onValueChange={(val) => handleMfgChange(batch.id, 'status', val)}
                      >
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
                        placeholder="e.g. Week 14-16"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => delMfgRow(batch.id)} 
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {manufacturing.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No manufacturing records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}