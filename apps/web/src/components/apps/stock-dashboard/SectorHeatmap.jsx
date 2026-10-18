import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Monitor, Briefcase, Zap, Pill, Car, Building, ShoppingBag, Shovel as Pickaxe, Lightbulb, Home, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CompanyList from './CompanyList';
import SectorPerformanceBoxGrid from '@/components/apps/bse-dashboard/SectorPerformanceBoxGrid';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ICONS = {
  'IT': Monitor, 'Finance': Briefcase, 'Energy': Zap, 'Auto': Car,
  'Infrastructure': Building, 'Pharma': Pill, 'FMCG': ShoppingBag,
  'Metals': Pickaxe, 'Utilities': Lightbulb, 'Realty': Home, 'Telecom': Phone
};

export default function SectorHeatmap({ sectors, loading, error, topStocks, lastUpdated, validationErrors }) {
  const [selectedSector, setSelectedSector] = useState('Energy');
  const [sectorCompanies, setSectorCompanies] = useState([]);

  useEffect(() => {
    if (sectors && sectors.length > 0) {
      const sectorData = sectors.find(s => s.sectorName === selectedSector);
      if (sectorData && sectorData.constituentData) {
        setSectorCompanies(sectorData.constituentData);
      } else {
        setSectorCompanies([]);
      }
    } else {
      setSectorCompanies([]);
    }
  }, [selectedSector, sectors]);

  useEffect(() => {
    if (sectors && sectors.length > 0 && !sectors.find(s => s.sectorName === selectedSector)) {
      setSelectedSector(sectors[0].sectorName);
    }
  }, [sectors, selectedSector]);

  const selectedSectorData = sectors?.find(s => s.sectorName === selectedSector) || { 
    sectorName: selectedSector, 
    changePercent: 0, 
    constituents: 'None',
    description: 'Sector'
  };
  
  const hasErrors = validationErrors && validationErrors.length > 0;

  return (
    <Card className="w-full shadow-md bg-card border-border flex flex-col">
      <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50">
        <CardTitle className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          Unified BSE Market Sectors
          {hasErrors && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)] cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-destructive text-destructive-foreground font-semibold max-w-xs">
                  <p>Data validation errors detected:</p>
                  <ul className="list-disc list-inside mt-1 text-xs">
                    {validationErrors.slice(0, 3).map((e, i) => <li key={i}>{e}</li>)}
                    {validationErrors.length > 3 && <li>+ {validationErrors.length - 3} more</li>}
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
        
        <div className="w-full md:w-64">
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-full bg-background border-border shadow-sm">
              <SelectValue placeholder="Select a sector" />
            </SelectTrigger>
            <SelectContent>
              {sectors?.map(s => (
                <SelectItem key={s.sectorName} value={s.sectorName}>
                  <div className="flex items-center justify-between w-full">
                    <span>{s.sectorName}</span>
                    <span className={`text-xs ml-2 font-bold ${s.changePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {s.changePercent >= 0 ? '+' : ''}{s.changePercent}%
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-6 pt-6">
        
        {/* New Box Grid Layout - Single Source of Truth */}
        <div>
          <SectorPerformanceBoxGrid stocks={topStocks} />
        </div>

        <div className="pt-6 mt-2 border-t border-border">
          <CompanyList 
            sector={selectedSector} 
            companies={sectorCompanies} 
            loading={loading}
            lastUpdated={lastUpdated}
          />
        </div>
      </CardContent>
    </Card>
  );
}