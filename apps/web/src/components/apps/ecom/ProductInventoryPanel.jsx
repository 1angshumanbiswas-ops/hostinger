import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function ProductInventoryPanel() {
  const { toast } = useToast();
  
  const products = [
    { id: 1, name: 'Premium Wireless Headphones', sku: 'AUDIO-01', price: 199.99, stock: 45, status: 'In Stock' },
    { id: 2, name: 'Ergonomic Office Chair', sku: 'FURN-02', price: 249.50, stock: 0, status: 'Out of Stock', alts: 2 },
    { id: 3, name: 'Mechanical Keyboard (Blue Switch)', sku: 'TECH-03', price: 129.00, stock: 5, status: 'Low Stock' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory Catalog</h1>
          <p className="text-slate-500">Live sync from Shopify/WooCommerce.</p>
        </div>
        <Button onClick={() => toast({title: "Syncing", description: "Pulling latest catalog data..."})} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" /> Sync Now
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Package className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-slate-500">Total Products</p>
              <p className="text-2xl font-bold">1,204</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertCircle className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-slate-500">Out of Stock</p>
              <p className="text-2xl font-bold">45</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Alternatives (OOS)</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b bg-white hover:bg-slate-50">
                    <td className="px-4 py-4 font-medium text-slate-900">{p.name}</td>
                    <td className="px-4 py-4">{p.sku}</td>
                    <td className="px-4 py-4">${p.price.toFixed(2)}</td>
                    <td className="px-4 py-4">{p.stock}</td>
                    <td className="px-4 py-4">
                      <Badge variant={p.status === 'In Stock' ? 'success' : p.status === 'Out of Stock' ? 'destructive' : 'secondary'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      {p.status === 'Out of Stock' ? (
                        <span className="text-blue-600 font-medium">{p.alts} Mapped</span>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}