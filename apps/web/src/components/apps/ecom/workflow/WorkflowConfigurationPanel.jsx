import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Webhook } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import FilterNode from './FilterNode';
import AIDecisionNode from './AIDecisionNode';
import TwilioWhatsAppAction from './TwilioWhatsAppAction';
import ResendEmailAction from './ResendEmailAction';
import PowerPromptTemplates from './PowerPromptTemplates';
import WorkflowExportDocs from './WorkflowExportDocs';

export default function WorkflowConfigurationPanel() {
  const { toast } = useToast();
  const webhookUrl = "https://[your-project-ref].supabase.co/functions/v1/webhook-cart-abandoned";

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Workflow Studio</h1>
        <p className="text-slate-500">Configure AI-driven recovery automation nodes.</p>
      </div>

      <Card className="border-dashed border-2 border-indigo-200 bg-indigo-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <Webhook className="w-5 h-5 text-indigo-600" />
            Trigger: Incoming Webhook
          </CardTitle>
          <CardDescription>Send your shopify/woocommerce abandon events here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input readOnly value={webhookUrl} className="bg-white font-mono text-xs text-slate-600" />
            <Button variant="outline" onClick={() => {
              navigator.clipboard.writeText(webhookUrl);
              toast({ title: "Copied", description: "Webhook URL copied to clipboard." });
            }}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-3 flex gap-2">
             <Badge variant="outline" className="bg-white">POST</Badge>
             <Badge variant="outline" className="bg-white text-slate-500">Requires JSON body</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FilterNode />
          <AIDecisionNode />
        </div>
        <div className="space-y-6">
          <PowerPromptTemplates />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TwilioWhatsAppAction />
        <ResendEmailAction />
        <WorkflowExportDocs />
      </div>
    </div>
  );
}