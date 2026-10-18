import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appsData } from '@/data/appsData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Construction, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function GenericAppPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find app details based on the URL parameter
  // We match the path '/apps/:appId' with the app.path like '/apps/expense-tracker'
  const app = appsData.find(a => a.path === `/apps/${appId}`) || {
    title: 'Unknown Application',
    description: 'This module could not be found.',
    category: 'System',
    icon: Wrench
  };

  const Icon = app.icon;

  const handleAction = () => {
    toast({
      title: "Action Recorded",
      description: `Interaction within ${app.title} module was logged.`,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/dashboard')}
          className="shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{app.title}</h1>
            <span className="bg-secondary/20 text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap hidden sm:inline-block">
              {app.category}
            </span>
          </div>
          <p className="text-muted-foreground mt-1">{app.description}</p>
        </div>
      </div>

      <Card className="border-dashed border-2 border-border bg-card/50">
        <CardContent className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <Construction className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Module Under Construction</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            The <strong>{app.title}</strong> module is currently being developed. 
            Check back soon for fully functional tools to manage your {app.category.toLowerCase()} processes.
          </p>
          <div className="flex gap-4">
            <Button onClick={handleAction} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Notify Me When Ready
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}