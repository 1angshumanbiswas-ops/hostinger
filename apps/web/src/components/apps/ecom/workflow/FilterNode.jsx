import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Split, ArrowRight, DollarSign } from 'lucide-react';

export default function FilterNode() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Split className="w-5 h-5 text-indigo-500" />
          High-Value Gate Filter
        </CardTitle>
        <CardDescription>Routes customers based on cart value.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Cart Value Threshold ($)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input type="number" defaultValue="150" className="pl-9 text-slate-900" />
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-sm mb-4 text-slate-700">Logic Flow</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">If Cart Value &gt; $150</Badge>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">Route to AI Decision Node (VIP)</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">If Cart Value &le; $150</Badge>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <Badge className="bg-slate-200 text-slate-700 border-slate-300">Generic Template (5% Off)</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}