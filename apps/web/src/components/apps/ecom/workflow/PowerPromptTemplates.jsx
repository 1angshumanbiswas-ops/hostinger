import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function PowerPromptTemplates() {
  const { toast } = useToast();

  const prompts = [
    {
      id: "p1",
      title: "1. SMS Personalization (Sizing)",
      content: "Act as a helpful stylist. The customer {{customer_name}} left a {{product_name}} (Size {{size}}) in their cart. Mention their usual size preference based on history and create urgency."
    },
    {
      id: "p2",
      title: "2. Objection Handling (Shipping)",
      content: "Customer abandoned at checkout step. Address shipping costs directly: 'Hi {{customer_name}}, shipping costs can be annoying. Here's a code for FREE SHIPPING on your {{product_name}}.'"
    },
    {
      id: "p3",
      title: "3. Stock Alternative (OOS)",
      content: "The item {{cart_items}} is OUT OF STOCK. Suggest 3 highly relevant alternatives from the {{category}} category. Include a 10% discount to apologize for the inconvenience."
    },
    {
      id: "p4",
      title: "4. VIP Customer Exclusive",
      content: "Customer LTV is over $500. Tone: Exclusive and grateful. 'As one of our top customers, we saved your cart and added a special 15% VIP discount + Free Next Day Delivery.'"
    },
    {
      id: "p5",
      title: "5. New Customer Welcome",
      content: "Customer has 0 previous orders. Tone: Welcoming, reassuring. Include a link to customer support FAQ and a first-time buyer discount."
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Power Prompt Library</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {prompts.map((p) => (
            <AccordionItem key={p.id} value={p.id}>
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  {p.title}
                  <Badge variant="secondary">Editable</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <Textarea 
                  defaultValue={p.content} 
                  className="min-h-[100px] text-sm text-slate-900"
                />
                <Button size="sm" onClick={() => toast({ title: "Saved", description: "Prompt template updated." })}>
                  Save Template
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}