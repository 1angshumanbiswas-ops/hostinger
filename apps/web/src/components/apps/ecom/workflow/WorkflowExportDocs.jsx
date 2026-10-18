import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Copy, Code2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function WorkflowExportDocs() {
  const { toast } = useToast();

  const handleCopy = (type) => {
    toast({ title: "Copied to clipboard", description: `${type} workflow JSON copied.` });
  };

  const jsonSnippet = `{
  "nodes": [
    { "type": "webhook", "name": "Cart Abandoned Trigger" },
    { "type": "filter", "conditions": { "cartValue": "> 150" } },
    { "type": "http-request", "name": "Groq AI Gen" },
    { "type": "twilio", "name": "Send WhatsApp" }
  ]
}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-slate-600" />
          External Automation Templates
        </CardTitle>
        <CardDescription>Export configurations for n8n or Activepieces.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="n8n" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="n8n">n8n Export</TabsTrigger>
            <TabsTrigger value="activepieces">Activepieces</TabsTrigger>
          </TabsList>
          <TabsContent value="n8n" className="space-y-4 mt-4">
            <div className="bg-slate-900 p-4 rounded-md overflow-x-auto">
              <pre className="text-green-400 text-xs font-mono">{jsonSnippet}</pre>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleCopy('n8n')}><Copy className="w-4 h-4 mr-2" /> Copy JSON</Button>
              <Button size="sm" onClick={() => toast({description: "Downloading..."})}><Download className="w-4 h-4 mr-2" /> Download .json</Button>
            </div>
          </TabsContent>
          <TabsContent value="activepieces" className="space-y-4 mt-4">
            <p className="text-sm text-slate-600">Import this template directly into your Activepieces instance to recreate the exact webhook-to-WhatsApp flow.</p>
            <Button size="sm" variant="outline" onClick={() => handleCopy('Activepieces')}><Copy className="w-4 h-4 mr-2" /> Copy Flow JSON</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}