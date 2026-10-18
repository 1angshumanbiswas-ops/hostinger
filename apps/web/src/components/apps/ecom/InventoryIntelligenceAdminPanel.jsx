import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider';

export default function InventoryIntelligenceAdminPanel() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: "Settings Saved", description: "Inventory intelligence rules updated." });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Inventory Intelligence Rules</h1>
        <p className="text-slate-500">Configure alternative product matching and notifications.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matching Engine Settings</CardTitle>
          <CardDescription>How alternatives are selected when a product is OOS.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Price Bracket Variance (±%)</Label>
              <span className="font-bold text-slate-700">20%</span>
            </div>
            <Slider defaultValue={[20]} max={50} step={1} />
            <p className="text-xs text-slate-500">Only recommend products within this price difference.</p>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Strict Category Matching</p>
              <p className="text-sm text-slate-500">Only suggest alternatives from the exact same category.</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Prioritize High Margin</p>
              <p className="text-sm text-slate-500">If multiple alternatives exist, recommend the one with highest margin.</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex gap-4">
             <Button variant="outline" className="flex-1" onClick={() => toast({title: "Importing...", description: "Feature not implemented."})}>Import Alt Rules (CSV)</Button>
             <Button variant="outline" className="flex-1" onClick={() => toast({title: "Exporting...", description: "Feature not implemented."})}>Export Analytics (CSV)</Button>
           </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full h-12 text-lg">Save Intelligence Rules</Button>
    </div>
  );
}