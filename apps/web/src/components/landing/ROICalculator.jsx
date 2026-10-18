import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, DollarSign, TrendingUp, Percent, Building2, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { marketData, getIndustryById, getDeviceById } from '@/utils/MarketAnalysisData';
import DataSourceCitations from './DataSourceCitations';

export default function ROICalculator() {
  const [industry, setIndustry] = useState('general');
  const [device, setDevice] = useState('all');
  const [monthlyTraffic, setMonthlyTraffic] = useState(50000);
  const [aov, setAov] = useState(120);
  const [abandonmentRate, setAbandonmentRate] = useState(70.22);
  
  const [results, setResults] = useState({
    lostRevenue: 0,
    recoveredMonthly: 0,
    recoveredAnnual: 0,
    roi: 0,
    recoveryPotentialMax: 0
  });

  // Handle Industry Preset Changes
  const handleIndustryChange = (val) => {
    setIndustry(val);
    const indData = getIndustryById(val);
    setAov(indData.defaultAov);
    
    // If device is specific, let device rule, else use industry rate
    if (device === 'all') {
      setAbandonmentRate(indData.rate);
    }
  };

  // Handle Device Preset Changes
  const handleDeviceChange = (val) => {
    setDevice(val);
    if (val !== 'all') {
      const devData = getDeviceById(val);
      setAbandonmentRate(devData.rate);
    } else {
      const indData = getIndustryById(industry);
      setAbandonmentRate(indData.rate);
    }
  };

  useEffect(() => {
    // Current state
    const abandonedCarts = monthlyTraffic * (abandonmentRate / 100);
    const lostRevenueMonthly = abandonedCarts * aov;
    
    // Projection (Assuming we recover 25% of the abandoned carts conservatively, up to max)
    const recoveryRate = 0.25; 
    const recoveredCarts = abandonedCarts * recoveryRate;
    const recoveredRevenueMonthly = recoveredCarts * aov;
    
    // Assuming 'Growth' plan cost for ROI calc
    const softwareCost = 7999;
    const monthlyROI = ((recoveredRevenueMonthly - softwareCost) / softwareCost) * 100;

    const indData = getIndustryById(industry);

    setResults({
      lostRevenue: lostRevenueMonthly,
      recoveredMonthly: recoveredRevenueMonthly,
      recoveredAnnual: recoveredRevenueMonthly * 12,
      roi: monthlyROI > 0 ? monthlyROI : 0,
      recoveryPotentialMax: indData.rate
    });
  }, [monthlyTraffic, aov, abandonmentRate, industry]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <div className="space-y-8">
        <div>
          <h3 className="text-3xl font-bold text-white mb-4">Calculate Your Recovery Potential</h3>
          <p className="text-muted-foreground">Adjust the sliders or use real 2026 industry benchmarks to see how much revenue our AI agents can recover.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" /> Industry Preset
            </label>
            <Select value={industry} onValueChange={handleIndustryChange}>
              <SelectTrigger className="bg-background border-border text-white">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                {marketData.industries.map(ind => (
                  <SelectItem key={ind.id} value={ind.id}>{ind.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-secondary" /> Traffic Source
            </label>
            <Tabs value={device} onValueChange={handleDeviceChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
                <TabsTrigger value="desktop">Desktop</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="space-y-8 bg-card/30 p-6 rounded-xl border border-border">
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-foreground">Monthly Site Traffic</label>
              <span className="text-primary font-bold">{monthlyTraffic.toLocaleString()}</span>
            </div>
            <Slider value={[monthlyTraffic]} min={5000} max={500000} step={1000} onValueChange={(val) => setMonthlyTraffic(val[0])} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-foreground">Average Order Value (AOV)</label>
              <span className="text-primary font-bold">${aov}</span>
            </div>
            <Slider value={[aov]} min={20} max={2000} step={10} onValueChange={(val) => setAov(val[0])} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-foreground">Cart Abandonment Rate</label>
              <span className="text-primary font-bold">{abandonmentRate.toFixed(1)}%</span>
            </div>
            <Slider value={[abandonmentRate]} min={40} max={95} step={0.1} onValueChange={(val) => setAbandonmentRate(val[0])} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="bg-card/50 border-primary/20 shadow-[0_0_30px_rgba(0,217,255,0.1)] relative overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50"></div>
          <CardContent className="p-8 relative z-10 space-y-8">
            
            <div className="p-4 rounded-xl bg-background/50 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <DollarSign className="text-destructive w-5 h-5" />
                  <span className="text-sm font-medium text-muted-foreground">Current Lost Revenue / Mo</span>
                </div>
                <p className="text-3xl font-bold text-white">{formatCurrency(results.lostRevenue)}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {results.recoveryPotentialMax}% Total Potential
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-primary w-4 h-4" />
                  <span className="text-xs font-medium text-primary">Est. Monthly Recovery</span>
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(results.recoveredMonthly)}</p>
              </div>
              
              <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="text-secondary w-4 h-4" />
                  <span className="text-xs font-medium text-secondary">Est. ROI (Growth Tier)</span>
                </div>
                <p className="text-2xl font-bold text-white">{results.roi.toFixed(0)}%</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-muted-foreground">Projected Annual Savings</span>
              </div>
              <p className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{formatCurrency(results.recoveredAnnual)}</p>
              <p className="text-xs text-muted-foreground mt-2">Based on a conservative 25% recovery rate of abandoned carts via AI concierges.</p>
            </div>

            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg">
              <a href="#contact">Get Your Custom Plan <ArrowRight className="ml-2 w-5 h-5" /></a>
            </Button>

          </CardContent>
        </Card>
        
        <DataSourceCitations />
      </div>
    </div>
  );
}