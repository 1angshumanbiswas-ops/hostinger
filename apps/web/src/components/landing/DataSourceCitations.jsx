import React from 'react';
import { Badge } from '@/components/ui/badge';
import { marketData } from '@/utils/MarketAnalysisData';
import { ExternalLink, Database } from 'lucide-react';

export default function DataSourceCitations() {
  return (
    <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 py-1">
          <Database className="w-3 h-3" />
          <span>Data Sourced from 2026 Industry Reports</span>
        </Badge>
      </div>
      
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="font-medium">Sources:</span>
        {marketData.sources.map((source, idx) => (
          <React.Fragment key={source.name}>
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              {source.name}
              <ExternalLink className="w-3 h-3" />
            </a>
            {idx < marketData.sources.length - 1 && <span className="text-border hidden sm:inline">•</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}