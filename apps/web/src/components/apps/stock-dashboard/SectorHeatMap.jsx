import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Grid, AlertCircle } from 'lucide-react';
import { useSectorPerformanceData, PREDEFINED_SECTORS } from '@/hooks/useSectorPerformanceData';

export default function SectorHeatMap() {
  const { sectors, loading, error } = useSectorPerformanceData();

  const getColorClass = (status) => {
    if (status === 'positive') return 'bg-emerald-500 text-white border-emerald-600';
    if (status === 'negative') return 'bg-[#EF4444] text-white border-red-600';
    return 'bg-gray-400 dark:bg-gray-600 text-white border-gray-500'; // Neutral
  };

  const displaySectors = sectors && sectors.length > 0 ? sectors : PREDEFINED_SECTORS;

  if (loading && (!sectors || sectors.length === 0)) {
    return (
      <Card className="bg-card border-border h-full min-h-[250px] w-full">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && (!displaySectors || displaySectors.length === 0)) {
    return (
      <Card className="bg-card border-border h-full min-h-[250px] w-full flex items-center justify-center flex-col">
        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-muted-foreground text-sm">Failed to load sector data</p>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border h-full w-full shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
          <Grid className="h-5 w-5 text-primary" />
          Quick Sector Overview (Unified Source)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {displaySectors.map((sector) => (
            <div 
              key={sector.sectorName} 
              className={`p-4 rounded-xl flex flex-col justify-center items-center transition-all duration-300 hover:scale-105 shadow-sm border ${getColorClass(sector.status)}`}
            >
              <span className="font-extrabold text-sm text-center tracking-tight">{sector.sectorName}</span>
              <span className="text-sm font-bold mt-1">
                {sector.changePercent > 0 ? '+' : ''}{sector.changePercent}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}