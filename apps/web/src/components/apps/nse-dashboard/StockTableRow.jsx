import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import RecommendationBadge from './RecommendationBadge';
import ConfidenceScoreBar from './ConfidenceScoreBar';

export default function StockTableRow({ stock, recommendation, onViewDetails }) {
  const isPositive = stock.change_percent >= 0;

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="font-bold text-foreground">
        {stock.symbol}
      </TableCell>
      <TableCell className="text-muted-foreground hidden md:table-cell">
        {stock.company_name}
      </TableCell>
      <TableCell className="font-mono text-right font-medium">
        ₹{stock.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </TableCell>
      <TableCell className={`text-right font-semibold ${isPositive ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'}`}>
        {isPositive ? '+' : ''}{stock.change_percent}%
      </TableCell>
      <TableCell className="font-mono text-right hidden lg:table-cell">
        ₹{stock.week_52_high.toLocaleString()}
      </TableCell>
      <TableCell className="font-mono text-right hidden lg:table-cell">
        ₹{stock.week_52_low.toLocaleString()}
      </TableCell>
      <TableCell className="font-mono text-right hidden xl:table-cell">
        {stock.pe_ratio}
      </TableCell>
      <TableCell className="text-center">
        <RecommendationBadge recommendation={recommendation?.recommendation} />
      </TableCell>
      <TableCell className="w-[120px]">
        <ConfidenceScoreBar score={recommendation?.confidence_score || 0} />
      </TableCell>
      <TableCell className="text-right">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onViewDetails(stock, recommendation)}
          className="text-primary hover:text-primary hover:bg-primary/10"
        >
          Details <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </TableCell>
    </TableRow>
  );
}