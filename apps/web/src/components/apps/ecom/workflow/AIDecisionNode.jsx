import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Sparkles, Bot } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function AIDecisionNode() {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);

  const defaultPrompt = "You are a luxury sales assistant. Analyze this cart: {{cart_items}}. If items are 'Out of Stock', suggest alternatives. If in stock, offer 'Free Shipping' code valid for 2 hours only. Keep message short, friendly, personalized. Reference customer's previous purchases. Use their first name and mention specific products.";

  const handleTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      toast({ title: "AI Output Generated", description: "Successfully simulated Groq Llama 3 response." });
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500" />
          AI Decision & Personalization
        </CardTitle>
        <CardDescription>Generates hyper-personalized recovery messages using LLMs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Primary Model</label>
            <Select defaultValue="groq-llama3">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="groq-llama3">Groq (Llama 3 70B)</SelectItem>
                <SelectItem value="openrouter-mixtral">OpenRouter (Mixtral 8x7B)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fallback Model</label>
            <Select defaultValue="openrouter-mixtral">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="openrouter-mixtral">OpenRouter (Mixtral 8x7B)</SelectItem>
                <SelectItem value="openai-gpt4o">OpenAI (GPT-4o)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">System Prompt</label>
          <Textarea 
            className="min-h-[120px] text-sm text-slate-900 font-mono" 
            defaultValue={defaultPrompt}
          />
          <p className="text-xs text-slate-500">Available variables: {'{{cart_items}}, {{customer_name}}, {{customer_ltv}}, {{stock_status}}'}</p>
        </div>

        <Button onClick={handleTest} disabled={isTesting} className="w-full" variant="secondary">
          {isTesting ? "Simulating..." : <><Sparkles className="w-4 h-4 mr-2" /> Test Prompt with Mock Data</>}
        </Button>
      </CardContent>
    </Card>
  );
}