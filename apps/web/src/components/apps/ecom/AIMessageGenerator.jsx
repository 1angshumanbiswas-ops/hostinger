import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Sparkles, Save, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CustomerSegmentationEngine } from '@/utils/ecom/CustomerSegmentationEngine';

export default function AIMessageGenerator() {
  const { toast } = useToast();
  const [segment, setSegment] = useState('VIP');
  const [scenario, setScenario] = useState('abandoned_cart');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let baseMsg = scenario === 'abandoned_cart' ? 'Looks like you left items in your cart.' : 'We found great alternatives for the out-of-stock item.';
      const personalized = CustomerSegmentationEngine.applySegmentationToMessages(segment, baseMsg);
      setGeneratedText(`Hi [Name],\n\n${personalized}\n\nClick here to complete purchase: [Link]`);
      setIsGenerating(false);
      toast({ title: "Message Generated", description: "AI successfully crafted a personalized message." });
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">AI Communications</h1>
        <p className="text-slate-500">Generate hyper-personalized messages based on LTV and intent.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Context Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Segment (LTV Based)</label>
              <Select value={segment} onValueChange={setSegment}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New Customer (0 orders)</SelectItem>
                  <SelectItem value="Regular">Regular (&lt;$200 LTV)</SelectItem>
                  <SelectItem value="Loyal">Loyal (+$200 LTV)</SelectItem>
                  <SelectItem value="VIP">VIP (+$500 LTV)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Scenario</label>
              <Select value={scenario} onValueChange={setScenario}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="abandoned_cart">Abandoned Cart Recovery</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock Alternative</SelectItem>
                  <SelectItem value="post_purchase">Post-Purchase Follow up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full mt-4" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? <span className="animate-pulse">Generating...</span> : <><Sparkles className="w-4 h-4 mr-2"/> Generate Template</>}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Message Preview</CardTitle>
              <CardDescription>Powered by Groq / OpenRouter API</CardDescription>
            </div>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700">Token Cost: ~$0.0002</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              className="min-h-[250px] font-mono text-sm p-4 bg-slate-50 border-slate-200 text-slate-900" 
              value={generatedText}
              onChange={(e) => setGeneratedText(e.target.value)}
              placeholder="Your generated message will appear here..."
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline"><Save className="w-4 h-4 mr-2"/> Save Template</Button>
              <Button onClick={() => toast({title: "Dispatched", description: "Sent to test queue."})}><Send className="w-4 h-4 mr-2"/> Send Test</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}