import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ShoppingBag, 
  Building2, 
  Briefcase, 
  Users, 
  GraduationCap, 
  Sparkles,
  TrendingUp,
  Zap,
  Laptop,
  LineChart,
  Cloud,
  Target,
  BarChart3,
  FileText
} from 'lucide-react';

export default function PublicLandingPage() {
  const navigate = useNavigate();

  const featuredApps = [
    {
      id: 'mystore',
      name: 'Mystore.com',
      category: 'E-Commerce',
      description: 'Complete online store platform with product management, shopping cart, and order processing',
      icon: ShoppingBag,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      route: '/mystore'
    },
    {
      id: 'erp',
      name: 'Angsuman AI Corp ERP',
      category: 'Enterprise',
      description: 'Comprehensive enterprise resource planning system for HR, finance, CRM, and supply chain management',
      icon: Building2,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      route: '/erp'
    },
    {
      id: 'job-assistant',
      name: 'Job Assistant',
      category: 'Career',
      description: 'AI-powered job matching and application assistant with resume optimization and interview prep',
      icon: Briefcase,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      route: '/job-assistant'
    },
    {
      id: 'crm',
      name: 'CRM Dashboard',
      category: 'Sales',
      description: 'Customer relationship management with contact tracking, pipeline management, and analytics',
      icon: Users,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      route: '/crm'
    },
    {
      id: 'education',
      name: 'Education Portal',
      category: 'Learning',
      description: 'Digital learning platform with courses, materials, quizzes, and student progress tracking',
      icon: GraduationCap,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
      route: '/education'
    },
    {
      id: 'program-manager',
      name: 'AI Program Manager',
      category: 'Project Management',
      description: 'Intelligent program management with planning, execution, risk tracking, and reporting',
      icon: Target,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-100 dark:bg-rose-900/30',
      route: '/ai-program-manager'
    }
  ];

  const moreApps = [
    {
      id: 'bse-dashboard',
      name: 'BSE Stock Market AI',
      category: 'Finance',
      description: 'Real-time BSE stock analysis with AI-powered recommendations and market insights',
      icon: TrendingUp,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      route: '/bse-dashboard'
    },
    {
      id: 'tech-jobs',
      name: 'Tech Job Finder',
      category: 'Career',
      description: 'Specialized job board for tech professionals with smart filtering and application tracking',
      icon: Laptop,
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/30',
      route: '/tech-job-finder'
    },
    {
      id: 'seo-app',
      name: 'SEO App',
      category: 'Marketing',
      description: 'Social media post scheduler with AI-powered content suggestions and engagement tracking',
      icon: Sparkles,
      iconColor: 'text-pink-600',
      iconBg: 'bg-pink-100 dark:bg-pink-900/30',
      route: '/seo-app'
    },
    {
      id: 'trading',
      name: 'Trading Dashboard',
      category: 'Finance',
      description: 'Advanced trading platform with real-time data, technical analysis, and portfolio management',
      icon: LineChart,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      route: '/trading'
    },
    {
      id: 'weather',
      name: 'Weather Forecaster',
      category: 'Analytics',
      description: 'AI-enhanced weather forecasting with risk analysis and predictive insights',
      icon: Cloud,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-100 dark:bg-sky-900/30',
      route: '/weather'
    },
    {
      id: 'cricket',
      name: 'Cricket Analytics',
      category: 'Sports',
      description: 'Comprehensive cricket statistics, player analysis, and match predictions',
      icon: BarChart3,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-100 dark:bg-teal-900/30',
      route: '/cricket-analytics'
    },
    {
      id: 'mobile',
      name: 'Mobile Hub',
      category: 'Technology',
      description: 'Mobile device comparison platform with specs, reviews, and pricing information',
      icon: Zap,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-100 dark:bg-violet-900/30',
      route: '/mobile-hub'
    },
    {
      id: 'ats',
      name: 'ATS CV Optimizer',
      category: 'Career',
      description: 'Resume optimization tool for ATS systems with keyword analysis and formatting suggestions',
      icon: FileText,
      iconColor: 'text-fuchsia-600',
      iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',
      route: '/ats-optimizer'
    }
  ];

  const AppCard = ({ app }) => {
    const Icon = app.icon;
    return (
      <Card 
        className="h-full cursor-pointer border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 portfolio-card-hover group"
        onClick={() => navigate(app.route)}
      >
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className={`w-12 h-12 rounded-lg ${app.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`h-6 w-6 ${app.iconColor}`} />
            </div>
            <Badge variant="secondary" className="text-xs font-medium">
              {app.category}
            </Badge>
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {app.name}
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {app.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium text-sm group-hover:gap-2 transition-all">
            Launch Application
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Helmet>
        <title>AI-Powered Applications Hub - Innovation at Your Fingertips</title>
        <meta name="description" content="Explore cutting-edge AI tools and no-code platforms designed to solve real-world problems. Transforming ideas into intelligent solutions." />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Hero Section */}
        <section className="relative portfolio-gradient-bg overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTI2IDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0xMCAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8 animate-in">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <Sparkles className="h-5 w-5 text-white" />
                <span className="text-white font-semibold text-sm">AI-Powered Innovation</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-5xl mx-auto leading-tight">
                We Study Trends Your Needs, Build Smart Tools, and Ensure You Love Using Them
              </h1>

              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Transforming ideas into intelligent solutions that drive real business impact
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button 
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-full shadow-xl"
                  onClick={() => {
                    const featuredSection = document.getElementById('featured-apps');
                    featuredSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore AI Apps
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-full"
                  onClick={() => navigate('/portfolio')}
                >
                  View Portfolio
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Applications Section */}
        <section id="featured-apps" className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Featured AI-Driven Applications
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Discover our most popular and powerful tools designed to transform your business operations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </div>
        </section>

        {/* More Applications Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                More Applications
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Explore additional specialized tools tailored for specific industries and use cases
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {moreApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="portfolio-gradient-bg py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start exploring our AI-powered applications today and experience the future of productivity
            </p>
            <Button 
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-full shadow-xl"
              onClick={() => {
                const featuredSection = document.getElementById('featured-apps');
                featuredSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 dark:bg-black text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} Angsuman AI Corp. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}