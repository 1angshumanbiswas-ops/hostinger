import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Store, TrendingUp, User, ShoppingCart, LineChart, Brain, Activity, Cloud, Globe, BarChart3, Smartphone, Heart, Target, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AllAppsPage = () => {
  const navigate = useNavigate();

  const userApps = [
    {
      id: 'job-assistant',
      title: 'Job Assistant',
      description: 'AI agent that scans, matches, and optimizes resumes',
      icon: Briefcase,
      path: '/job-assistant',
      category: 'Productivity'
    },
    {
      id: 'ats-optimizer',
      title: 'ATS CV Optimizer',
      description: 'Helps applicants pass Applicant Tracking Systems',
      icon: Target,
      path: '/ats-optimizer',
      category: 'Career'
    },
    {
      id: 'tech-job-finder',
      title: 'Tech Job Finder',
      description: 'Search and apply for the latest tech industry jobs',
      icon: Globe,
      path: '/tech-job-finder',
      category: 'Career'
    },
    {
      id: 'education',
      title: 'Education Portal',
      description: 'Comprehensive learning platform with interactive resources',
      icon: Brain,
      path: '/education',
      category: 'Learning'
    },
    {
      id: 'health-monitor',
      title: 'Health Monitor',
      description: 'Track vital metrics, fitness goals, and well‑being',
      icon: Heart,
      path: '/health-monitor',
      category: 'Health'
    },
    {
      id: 'weather',
      title: 'Weather Forecaster',
      description: 'AI‑driven forecasting and alerts',
      icon: Cloud,
      path: '/weather',
      category: 'Utilities'
    },
    {
      id: 'cricket',
      title: 'Cricket Analytics',
      description: 'Sports stats and match predictions',
      icon: Activity,
      path: '/cricket-analytics',
      category: 'Sports'
    }
  ];

  const smallBusinessApps = [
    {
      id: 'mystore',
      title: 'Mystore.com',
      description: 'Complete e‑commerce platform with products, cart, and checkout',
      icon: Store,
      path: '/mystore',
      category: 'E-commerce'
    },
    {
      id: 'erp',
      title: 'Angshuman AI Corp ERP',
      description: 'HR and resource management system',
      icon: Building2,
      path: '/hr-portal',
      category: 'Enterprise'
    },
    {
      id: 'crm',
      title: 'CRM Dashboard',
      description: 'Advanced customer relationship management and lead tracking',
      icon: Users,
      path: '/crm',
      category: 'Sales'
    },
    {
      id: 'seo',
      title: 'SEO App',
      description: 'AI‑powered social media ad generator and SEO tool',
      icon: TrendingUp,
      path: '/seo-app',
      category: 'Marketing'
    },
    {
      id: 'ecom-recovery',
      title: 'E‑Commerce Recovery',
      description: 'Recover lost carts and boost conversions',
      icon: ShoppingCart,
      path: '/ecom-revenue-recovery',
      category: 'E-commerce'
    },
    {
      id: 'mobile-hub',
      title: 'Mobile Hub',
      description: 'Centralized mobile device management platform',
      icon: Smartphone,
      path: '/mobile-hub',
      category: 'Management'
    }
  ];

  const advancedApps = [
    {
      id: 'program-manager',
      title: 'AI Program Manager',
      description: 'Intelligent project oversight with automated risk detection',
      icon: Brain,
      path: '/ai-program-manager',
      category: 'AI & Automation'
    },
    {
      id: 'bse-dashboard',
      title: 'BSE Stock Market AI',
      description: 'Real‑time BSE stock market analysis with AI recommendations',
      icon: LineChart,
      path: '/bse-dashboard',
      category: 'Finance'
    },
    {
      id: 'trading',
      title: 'Trading Dashboard',
      description: 'Global market dashboard with AI insights',
      icon: BarChart3,
      path: '/trading',
      category: 'Finance'
    }
  ];

  const handleLaunch = (path) => {
    navigate(path);
  };

  const renderAppCard = (app) => {
    const IconComponent = app.icon;
    return (
      <Card 
        key={app.id}
        className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-purple-accent/50 overflow-hidden all-apps-card"
        onClick={() => handleLaunch(app.path)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-purple-accent/10 flex items-center justify-center group-hover:bg-purple-accent/20 group-hover:scale-110 transition-all duration-300 shadow-md">
              <IconComponent className="w-6 h-6 text-purple-accent" />
            </div>
            <Badge variant="secondary" className="text-xs font-semibold">
              {app.category}
            </Badge>
          </div>
          
          <CardTitle className="text-xl mb-2 group-hover:text-purple-accent transition-colors duration-300">
            {app.title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed min-h-[40px]">
            {app.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative pt-0">
          <Button 
            className="w-full bg-purple-accent hover:bg-purple-accent-hover text-white transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Launch Application
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Helmet>
        <title>All Applications - Angshuman Biswas</title>
        <meta name="description" content="Explore all AI-powered applications and tools built by Angshuman Biswas" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-accent/10 via-background to-purple-accent/5 border-b sticky top-0 z-10 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="group hover:bg-purple-accent/10"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Home
              </Button>
              <h1 className="text-3xl font-bold" style={{ color: '#7C3AED' }}>
                All Applications
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* User Apps Section */}
          <section className="mb-16">
            <div className="all-apps-section-header mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-accent/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-accent" />
                </div>
                <h2 className="text-3xl font-bold" style={{ color: '#7C3AED' }}>
                  User Apps
                </h2>
              </div>
              <p className="text-muted-foreground text-lg ml-13">
                Personal productivity and lifestyle applications
              </p>
            </div>
            <div className="all-apps-grid">
              {userApps.map(renderAppCard)}
            </div>
          </section>

          {/* Small Business Apps Section */}
          <section className="mb-16">
            <div className="all-apps-section-header mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-accent/10 flex items-center justify-center">
                  <Store className="w-6 h-6 text-purple-accent" />
                </div>
                <h2 className="text-3xl font-bold" style={{ color: '#7C3AED' }}>
                  Small Business Apps
                </h2>
              </div>
              <p className="text-muted-foreground text-lg ml-13">
                Tools to grow and manage your business
              </p>
            </div>
            <div className="all-apps-grid">
              {smallBusinessApps.map(renderAppCard)}
            </div>
          </section>

          {/* Advanced AI & B2B Apps Section */}
          <section className="mb-16">
            <div className="all-apps-section-header mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-accent/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-accent" />
                </div>
                <h2 className="text-3xl font-bold" style={{ color: '#7C3AED' }}>
                  Advanced AI & B2B Apps
                </h2>
              </div>
              <p className="text-muted-foreground text-lg ml-13">
                Enterprise-grade AI solutions for businesses
              </p>
            </div>
            <div className="all-apps-grid">
              {advancedApps.map(renderAppCard)}
            </div>
          </section>

          {/* Call to Action */}
          <div className="text-center mt-16 py-12 px-6 rounded-2xl bg-gradient-to-r from-purple-accent/10 via-purple-accent/5 to-transparent border border-purple-accent/20">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#7C3AED' }}>
              Can't find what you're looking for?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              I'm constantly building new AI-powered applications. Get in touch to discuss your custom needs.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/portfolio')}
              className="bg-purple-accent hover:bg-purple-accent-hover text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View Portfolio
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllAppsPage;