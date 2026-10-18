import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  ShoppingCart,
  Users,
  Briefcase,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Zap,
  BarChart3,
  Mail,
  Search,
  Filter,
  Grid3x3,
  List,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';

const ApplicationHub = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const applications = [
    {
      id: 'mystore',
      name: 'MyStore',
      description: 'Complete e-commerce platform with product catalog, shopping cart, and order management',
      category: 'E-Commerce',
      icon: ShoppingCart,
      route: '/mystore',
      color: 'bg-blue-500',
      features: ['Product Catalog', 'Shopping Cart', 'Order Tracking', 'Payment Integration'],
    },
    {
      id: 'erp',
      name: 'Angsum AI Corp ERP',
      description: 'Comprehensive HR management system for employee, payroll, and attendance tracking',
      category: 'HR',
      icon: Users,
      route: '/erp',
      color: 'bg-green-500',
      features: ['Employee Management', 'Payroll Processing', 'Attendance Tracking', 'Performance Reviews'],
    },
    {
      id: 'job-assistant',
      name: 'Job Assistant',
      description: 'AI-powered resume matching and job application automation platform',
      category: 'AI',
      icon: Briefcase,
      route: '/job-assistant',
      color: 'bg-purple-500',
      features: ['Resume Upload', 'Job Matching', 'Auto-Apply', 'Skill Analysis'],
    },
    {
      id: 'crm',
      name: 'CRM Dashboard',
      description: 'Customer relationship management with contact tracking and sales pipeline',
      category: 'CRM',
      icon: TrendingUp,
      route: '/crm',
      color: 'bg-orange-500',
      features: ['Contact Management', 'Lead Tracking', 'Sales Pipeline', 'Interaction History'],
    },
    {
      id: 'education',
      name: 'Education Portal',
      description: 'Learning management system with courses, resources, and assessments',
      category: 'Education',
      icon: GraduationCap,
      route: '/education',
      color: 'bg-indigo-500',
      features: ['Course Library', 'Learning Materials', 'Quizzes', 'Progress Tracking'],
    },
    {
      id: 'fraud-detection',
      name: 'Fraud Detection',
      description: 'Real-time transaction monitoring and fraud prevention system',
      category: 'Finance',
      icon: AlertTriangle,
      route: '/fraud',
      color: 'bg-red-500',
      features: ['Transaction Monitoring', 'Risk Analysis', 'Case Management', 'Alerts'],
    },
    {
      id: 'stock-dashboard',
      name: 'Stock Market Dashboard',
      description: 'Real-time stock market analytics and AI-powered recommendations',
      category: 'Finance',
      icon: BarChart3,
      route: '/stock-dashboard',
      color: 'bg-cyan-500',
      features: ['Live Market Data', 'AI Recommendations', 'Portfolio Tracking', 'Technical Analysis'],
    },
    {
      id: 'trading',
      name: 'Trading Platform',
      description: 'Advanced trading platform with AI agents and market insights',
      category: 'Finance',
      icon: Zap,
      route: '/trading',
      color: 'bg-yellow-500',
      features: ['Live Trading', 'AI Agents', 'Portfolio Management', 'Risk Analysis'],
    },
    {
      id: 'seo-app',
      name: 'SEO Marketing',
      description: 'Social media automation and multi-platform content scheduling',
      category: 'Marketing',
      icon: Mail,
      route: '/seo-app',
      color: 'bg-pink-500',
      features: ['Content Scheduling', 'Multi-Platform', 'AI Copy Generation', 'Analytics'],
    },
    {
      id: 'weather',
      name: 'Weather Forecaster',
      description: 'State-wise weather monitoring and forecasting system',
      category: 'Analytics',
      icon: BarChart3,
      route: '/weather',
      color: 'bg-teal-500',
      features: ['Live Weather', 'Forecasting', 'State Coverage', 'Risk Analysis'],
    },
    {
      id: 'health-monitor',
      name: 'Health Monitor',
      description: 'Personal health tracking and fitness goal management',
      category: 'Health',
      icon: Users,
      route: '/health-monitor',
      color: 'bg-emerald-500',
      features: ['Vital Metrics', 'Fitness Goals', 'Progress Tracking', 'Health History'],
    },
    {
      id: 'ats-optimizer',
      name: 'ATS Optimizer',
      description: 'Resume optimization for Applicant Tracking Systems',
      category: 'AI',
      icon: Briefcase,
      route: '/ats-optimizer',
      color: 'bg-violet-500',
      features: ['Resume Analysis', 'ATS Scoring', 'Keyword Optimization', 'Recommendations'],
    },
    {
      id: 'mobile-hub',
      name: 'Mobile Hub',
      description: 'Mobile device comparison and recommendation platform',
      category: 'E-Commerce',
      icon: ShoppingCart,
      route: '/mobile-hub',
      color: 'bg-blue-600',
      features: ['Device Catalog', 'Price Comparison', 'Specifications', 'Reviews'],
    },
    {
      id: 'cricket-analytics',
      name: 'Cricket Analytics',
      description: 'Cricket player statistics and performance analytics',
      category: 'Analytics',
      icon: BarChart3,
      route: '/cricket-analytics',
      color: 'bg-green-600',
      features: ['Player Stats', 'Team Analysis', 'Match History', 'Performance Metrics'],
    },
    {
      id: 'program-manager',
      name: 'AI Program Manager',
      description: 'AI-powered program and project management platform',
      category: 'AI',
      icon: Zap,
      route: '/ai-program-manager',
      color: 'bg-purple-600',
      features: ['Project Planning', 'Resource Management', 'Risk Analysis', 'AI Insights'],
    },
    {
      id: 'tech-job-finder',
      name: 'Tech Job Finder',
      description: 'Specialized job search platform for tech professionals',
      category: 'Jobs',
      icon: Briefcase,
      route: '/tech-job-finder',
      color: 'bg-indigo-600',
      features: ['Job Search', 'Skill Matching', 'Salary Insights', 'Application Tracking'],
    },
  ];

  const categories = ['all', ...new Set(applications.map(app => app.category))];

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, applications]);

  const AppCard = ({ app }) => {
    const Icon = app.icon;
    return (
      <Card className="app-card-hover h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-lg ${app.color} bg-opacity-10`}>
              <Icon className={`h-6 w-6 ${app.color.replace('bg-', 'text-')}`} />
            </div>
            <Badge variant="secondary">{app.category}</Badge>
          </div>
          <CardTitle className="mt-4">{app.name}</CardTitle>
          <CardDescription className="line-clamp-2">{app.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Key Features:</p>
            <ul className="space-y-1">
              {app.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => navigate(app.route)}
          >
            Launch Application
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      <Helmet>
        <title>Application Hub - Angsum AI Corp</title>
        <meta name="description" content="Access all your business applications from one central hub" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <AppHeader appName="Application Hub" />

        <main className="flex-1 app-container py-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold">Application Hub</h1>
              <p className="text-xl text-muted-foreground">
                Access all your business applications from one place
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-4">
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList>
                    {categories.map(category => (
                      <TabsTrigger key={category} value={category} className="capitalize">
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-2 border rounded-md p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredApps.length} of {applications.length} applications
              </p>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              )}
            </div>

            {filteredApps.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="space-y-2">
                  <Filter className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-semibold">No applications found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {filteredApps.map(app => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            )}
          </div>
        </main>

        <AppFooter />
      </div>
    </>
  );
};

export default ApplicationHub;