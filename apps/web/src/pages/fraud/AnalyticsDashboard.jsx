import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Calendar as CalendarIcon, Download, TrendingUp, AlertCircle, DollarSign, Users } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  aggregateDailyFraudTrends,
  calculateWeeklySummary,
  generateHeatmapData,
  calculateFraudLossMetrics,
  getRiskDistribution,
  getTopFlaggedCustomers,
  getTopFraudRules,
  exportToCSV,
  exportToPDF
} from '@/utils/fraudAnalyticsService';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const AnalyticsDashboard = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString()
  });
  const [date, setDate] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() });
  
  const [weeklySummary, setWeeklySummary] = useState({});
  const [dailyTrends, setDailyTrends] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [lossMetrics, setLossMetrics] = useState({});
  const [topCustomers, setTopCustomers] = useState([]);
  const [topRules, setTopRules] = useState([]);
  const [heatmapLocation, setHeatmapLocation] = useState([]);
  const [heatmapTime, setHeatmapTime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [summary, trends, risk, losses, customers, rules, locHeatmap, timeHeatmap] = await Promise.all([
        calculateWeeklySummary(dateRange),
        aggregateDailyFraudTrends(dateRange),
        getRiskDistribution(dateRange),
        calculateFraudLossMetrics(dateRange),
        getTopFlaggedCustomers(10),
        getTopFraudRules(10),
        generateHeatmapData('location'),
        generateHeatmapData('time')
      ]);

      setWeeklySummary(summary);
      setDailyTrends(trends);
      setRiskDistribution(risk);
      setLossMetrics(losses);
      setTopCustomers(customers);
      setTopRules(rules);
      setHeatmapLocation(locHeatmap);
      setHeatmapTime(timeHeatmap);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (newDate) => {
    setDate(newDate);
    if (newDate?.from && newDate?.to) {
      setDateRange({
        startDate: newDate.from.toISOString(),
        endDate: newDate.to.toISOString()
      });
    }
  };

  const handleExportCSV = () => {
    try {
      exportToCSV([
        { section: 'Weekly Summary', ...weeklySummary },
        ...topCustomers.map(c => ({ section: 'Top Customers', ...c })),
        ...topRules.map(r => ({ section: 'Top Rules', ...r }))
      ], 'fraud_analytics_report');
      
      toast({
        title: 'Export Successful',
        description: 'CSV report downloaded successfully'
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF([
        { metric: 'Total Cases', value: weeklySummary.totalCases },
        { metric: 'Confirmed Fraud', value: weeklySummary.confirmedFraud },
        { metric: 'False Positives', value: weeklySummary.falsePositives },
        { metric: 'Resolution Rate', value: weeklySummary.resolutionRate }
      ], 'fraud_analytics_report');
      
      toast({
        title: 'Export Successful',
        description: 'PDF report downloaded successfully'
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard - Fraud Detection</title>
        <meta name="description" content="Comprehensive fraud detection analytics and reporting" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive fraud detection insights and metrics</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn(!date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Button onClick={handleExportCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            
            <Button onClick={handleExportPDF} className="bg-primary">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                Total Fraud Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{weeklySummary.totalCases || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">This period</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-red-500" />
                Confirmed Fraud
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{weeklySummary.confirmedFraud || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Verified incidents</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                False Positives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{weeklySummary.falsePositives || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Legitimate transactions</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                Resolution Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{weeklySummary.resolutionRate || '0%'}</div>
              <p className="text-xs text-muted-foreground mt-1">Cases resolved</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Daily Fraud Trend</CardTitle>
              <CardDescription>Fraud cases over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#7C3AED" strokeWidth={2} name="Total Cases" />
                  <Line type="monotone" dataKey="confirmed" stroke="#ef4444" strokeWidth={2} name="Confirmed Fraud" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
              <CardDescription>Transaction risk breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fraud Loss Metrics</CardTitle>
            <CardDescription>Financial impact analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Total Flagged Amount</p>
                <p className="text-2xl font-bold text-yellow-600 mt-2">{lossMetrics.totalFlagged || '$0.00'}</p>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Confirmed Losses</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{lossMetrics.confirmedLosses || '$0.00'}</p>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Prevented Losses</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{lossMetrics.preventedLosses || '$0.00'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>High-Risk Activities by Location</CardTitle>
              <CardDescription>Geographic fraud hotspots</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={heatmapLocation.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7C3AED" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>High-Risk Activities by Time</CardTitle>
              <CardDescription>Temporal fraud patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={heatmapTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Flagged Customers</CardTitle>
            <CardDescription>Customers with highest fraud incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Fraud Count</TableHead>
                  <TableHead className="text-right">Total Loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  topCustomers.map((customer, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="destructive">{customer.fraudCount}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${customer.totalLoss.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Fraud Rules Triggered</CardTitle>
            <CardDescription>Most frequently activated detection rules</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Rule Type</TableHead>
                  <TableHead className="text-right">Trigger Count</TableHead>
                  <TableHead className="text-right">Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topRules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  topRules.map((rule, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{rule.rule_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.rule_type}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {rule.triggerCount}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          rule.impact === 'High' ? 'bg-red-500' :
                          rule.impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }>
                          {rule.impact}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AnalyticsDashboard;