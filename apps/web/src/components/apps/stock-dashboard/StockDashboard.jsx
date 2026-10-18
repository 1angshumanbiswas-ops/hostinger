import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCcw, CheckCircle2, Bug, TerminalSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import TopStocksTable from '@/components/apps/stock-dashboard/TopStocksTable';
import SENSEXDashboard from '@/components/apps/stock-dashboard/SENSEXDashboard';
import SectorHeatmap from '@/components/apps/stock-dashboard/SectorHeatmap';
import RefreshButton from '@/components/apps/stock-dashboard/RefreshButton';
import MarketSentimentCard from '@/components/apps/stock-dashboard/MarketSentimentCard';
import OverallSensexMetricCard from '@/components/apps/stock-dashboard/OverallSensexMetricCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useRealTimeSectorData } from '@/hooks/useRealTimeSectorData';

function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 md:w-96 rounded-lg" />
          <Skeleton className="h-4 w-48 rounded-md" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function StockDashboard() {
  const { 
    sensexData, 
    topStocks, 
    sectors, 
    loading, 
    error, 
    lastUpdated, 
    validationErrors, 
    refresh 
  } = useRealTimeSectorData();

  const [debugMode, setDebugMode] = useState(false);

  const handleRefresh = () => {
    refresh();
  };

  const formattedTime = lastUpdated?.toLocaleTimeString('en-IN', {
    hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
  });

  if (loading && !sensexData) {
    return <DashboardSkeleton />;
  }

  const hasValidationErrors = validationErrors && validationErrors.length > 0;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 bg-background min-h-screen text-foreground">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">BSE Market AI Dashboard</h1>
            <Badge variant="outline" className="font-bold border px-2 py-0.5 border-emerald-500 text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 gap-1 flex items-center data-consistent">
              <CheckCircle2 className="w-3 h-3" /> UNIFIED DATA
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm md:text-base text-muted-foreground font-medium">
              Last Updated: {formattedTime} IST
            </p>
            {loading && <RefreshCcw className="w-3.5 h-3.5 text-primary animate-spin" />}
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 mr-2">
            <Switch id="debug-mode" checked={debugMode} onCheckedChange={setDebugMode} />
            <label htmlFor="debug-mode" className="text-sm font-semibold cursor-pointer text-muted-foreground flex items-center gap-1">
              <Bug className="w-4 h-4" /> Debug Mode
            </label>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="gap-2 font-bold text-primary border-primary/20 hover:bg-primary/10">
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync All Data
          </Button>
        </div>
      </div>

      {/* Validation Warning Banner */}
      {hasValidationErrors && debugMode && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-start gap-3 shadow-sm animate-in slide-in-from-top-2 data-inconsistent">
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="font-bold text-sm">Data Consistency Warning</p>
            <ul className="text-xs opacity-90 list-disc list-inside ml-4">
              {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Debug Panel */}
      {debugMode && (
        <div className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-700 shadow-inner">
          <div className="flex items-center gap-2 mb-2 text-white border-b border-slate-700 pb-2">
            <TerminalSquare className="w-4 h-4" />
            <span className="font-bold uppercase">System Debug Console</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400">Total Stocks Fetched: <span className="text-green-400">{topStocks.length}</span></p>
              <p className="text-slate-400">Sectors Computed: <span className="text-green-400">{sectors.length}</span></p>
              <p className="text-slate-400">Last Fetch Timestamp: <span className="text-green-400">{lastUpdated?.toISOString()}</span></p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Sector TTL Strategy:</p>
              <div className="bg-slate-800 p-2 rounded text-[10px] whitespace-pre">
                {`Cache TTL: 5 Minutes (300,000ms)\nValidation: Validating constituent drift bounds.`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. Main SENSEX Overview Dashboard */}
      <div className="w-full">
        <SENSEXDashboard sensexData={sensexData} loading={loading} error={error} />
      </div>
      
      {/* 2. Top Stocks Performance Table */}
      <div className="w-full">
        <TopStocksTable topStocks={topStocks} loading={loading} error={error} />
      </div>

      {/* Grid Layout for AI Insights and Sector Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 md:gap-6">
        <div className="xl:col-span-2 flex flex-col gap-5 md:gap-6 w-full">
          
          {/* 3. Detailed Market Sectors and Companies - Unified View */}
          <SectorHeatmap 
            sectors={sectors}
            loading={loading}
            error={error}
            topStocks={topStocks}
            lastUpdated={lastUpdated}
            validationErrors={validationErrors}
          />

          {/* 4. Market Sentiment AI Card */}
          <MarketSentimentCard topStocks={topStocks} loading={loading} />
          
        </div>
        
        <div className="flex flex-col gap-5 md:gap-6 w-full">
          {/* Overall Sensex Metric Card - NEW */}
          <OverallSensexMetricCard topStocks={topStocks} loading={loading} />

          <div className="p-6 rounded-xl border border-dashed border-border bg-muted/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unified Data Architecture</span>
            </div>
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              All dashboard sections have been fully consolidated into a single source of truth. Duplicate sector displays were removed to prevent data fragmentation. Sector values are guaranteed to sync with underlying constituent prices via a unified robust data hook with 5-minute TTL caching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}