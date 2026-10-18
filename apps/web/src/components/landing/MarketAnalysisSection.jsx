import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import IndustryBenchmarkChart from './IndustryBenchmarkChart';
import DeviceAbandonmentChart from './DeviceAbandonmentChart';
import AbandonmentTriggerChart from './AbandonmentTriggerChart';
import DataSourceCitations from './DataSourceCitations';

export default function MarketAnalysisSection() {
  return (
    <section className="py-24 bg-background relative border-y border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">2026 E-commerce Market Reality</h2>
          <p className="text-xl text-muted-foreground">Cart abandonment isn't a minor leak; it's a massive revenue drain. Here are the latest industry benchmarks confirming the urgent need for AI intervention.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-card/50 border-border backdrop-blur-sm shadow-lg rounded-xl flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-white">Industry Benchmarks</CardTitle>
              <CardDescription>Average cart abandonment rates by vertical</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <IndustryBenchmarkChart />
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border backdrop-blur-sm shadow-lg rounded-xl flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-white">Device Breakdown</CardTitle>
              <CardDescription>Mobile commerce drives traffic, but also abandonment</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <DeviceAbandonmentChart />
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20 text-center">
                <p className="text-sm font-medium text-destructive">Mobile cart abandonment is at <span className="font-bold text-lg">85%</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border backdrop-blur-sm shadow-lg rounded-xl flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-white">Top Abandonment Triggers</CardTitle>
              <CardDescription>Primary reasons shoppers leave without buying</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <AbandonmentTriggerChart />
            </CardContent>
          </Card>
        </div>

        <DataSourceCitations />
      </div>
    </section>
  );
}