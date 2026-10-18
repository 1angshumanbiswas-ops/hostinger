import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function AppCard({ app }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const Icon = app.icon;

  const handleClick = () => {
    toast({
      title: `Accessing ${app.title}`,
      description: "Loading application module...",
    });
    if (app.path) {
      navigate(app.path);
    }
  };

  return (
    <Card 
      onClick={handleClick}
      className="group cursor-pointer border-border hover:border-[hsl(var(--dark-green))]/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card overflow-hidden flex flex-col h-full"
    >
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 relative">
        <div className="w-12 h-12 rounded-xl bg-[hsl(var(--dark-green))]/10 text-[hsl(var(--dark-green))] flex items-center justify-center group-hover:bg-[hsl(var(--dark-green))] group-hover:text-white transition-colors duration-300">
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground absolute top-4 right-4">
          {app.category?.split(' ')[0]}
        </Badge>
      </CardHeader>
      <CardContent className="pt-2 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg text-[hsl(var(--dark-green))] mb-1 group-hover:text-[hsl(var(--dark-green-hover))] transition-colors">
          {app.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-auto mb-3">
          {app.description}
        </p>
        <div className="mt-auto pt-3 border-t border-border/50">
          <span className="inline-flex items-center justify-center font-semibold text-[hsl(var(--dark-green))] text-sm group-hover:text-[hsl(var(--dark-green-hover))] transition-colors w-full bg-[hsl(var(--dark-green-light))] hover:bg-[hsl(var(--dark-green))]/10 py-2 rounded-lg">
            Access App
          </span>
        </div>
      </CardContent>
    </Card>
  );
}