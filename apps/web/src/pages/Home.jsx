import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Grid3x3, Brain, User, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getFeaturedApps, getOtherApps } from '@/data/appsData';
import PortfolioSidebar from '@/components/portfolio/PortfolioSidebar';
import PortfolioContent from '@/components/portfolio/PortfolioContent';

const Home = () => {
  const navigate = useNavigate();
  const featuredApps = getFeaturedApps();
  const otherApps = getOtherApps();
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleAppClick = (path) => {
    navigate(path);
  };

  const handleViewAllApps = () => {
    navigate('/apps-hub');
  };

  const handleViewPortfolio = () => {
    navigate('/portfolio');
  };

  return (
    <>
      <Helmet>
        <title>Angshuman Biswas - AI Generalist No Code Developer</title>
        <meta name="description" content="Portfolio and applications showcase by Angshuman Biswas - Building powerful AI-driven solutions with no-code tools" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b">
          <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/20 bg-[size:20px_20px] opacity-20" />
          
          <div className="container mx-auto px-4 py-20 md:py-32 max-w-7xl relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 px-4 py-2 text-sm font-semibold" variant="secondary">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                AI Generalist No Code Developer
              </Badge>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" style={{ color: '#7C3AED' }}>
                We Study Trends Your Needs, Build Smart Tools, and Ensure You Love Using Them
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Transforming ideas into reality with cutting-edge AI tools and no-code platforms. 
                Explore my portfolio of intelligent applications designed to solve real-world problems.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={handleViewAllApps}
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Grid3x3 className="w-5 h-5 mr-2" />
                  Explore All Apps
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleViewPortfolio}
                  className="text-lg px-8 py-6 border-2 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img 
                    src="https://horizons-cdn.hostinger.com/e0687bb0-98a0-45d4-8f73-50f1c1652251/3b16d4871bafbe42531481f9aaf6a9a1.png" 
                    alt="Portfolio Icon" 
                    className="w-5 h-5 mr-2 relative z-10"
                  />
                  <span className="relative z-10">View Portfolio</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tabbed Interface */}
        <section className="container mx-auto px-4 py-8 max-w-7xl">
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14 p-1 bg-muted/50">
              <TabsTrigger value="applications" className="text-base font-semibold data-[state=active]:bg-background">
                <Grid3x3 className="w-4 h-4 mr-2" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="text-base font-semibold data-[state=active]:bg-background">
                <User className="w-4 h-4 mr-2" />
                Portfolio
              </TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-12">
              {/* Featured AI-Driven Applications Section */}
              <div>
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Brain className="w-8 h-8 text-primary" />
                    <h2 className="text-4xl font-bold dark-green-heading">Featured AI-Driven Applications</h2>
                  </div>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover intelligent applications powered by AI and built with no-code tools to solve real-world challenges
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {featuredApps.map((app) => {
                    const IconComponent = app.icon;
                    return (
                      <Card 
                        key={app.id}
                        className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-primary/50 overflow-hidden"
                        onClick={() => handleAppClick(app.path)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <CardHeader className="relative">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-md">
                              <IconComponent className="w-7 h-7 text-primary" />
                            </div>
                            <Badge variant="secondary" className="text-xs font-semibold">
                              {app.category}
                            </Badge>
                          </div>
                          
                          <CardTitle className="text-2xl mb-2 dark-green-heading group-hover:text-primary transition-colors duration-300">
                            {app.title}
                          </CardTitle>
                          <CardDescription className="text-sm line-clamp-2 min-h-[40px]">
                            {app.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="relative">
                          <Button 
                            variant="ghost" 
                            className="w-full group-hover:bg-primary/10 transition-colors duration-300"
                          >
                            Launch Application
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Other Apps Section */}
              {otherApps.length > 0 && (
                <div className="bg-muted/30 border-t rounded-2xl p-8">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 dark-green-heading">More Applications</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Explore additional tools and applications in my portfolio
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {otherApps.map((app) => {
                      const IconComponent = app.icon;
                      return (
                        <Card 
                          key={app.id}
                          className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/50"
                          onClick={() => handleAppClick(app.path)}
                        >
                          <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-lg dark-green-heading group-hover:text-primary transition-colors duration-300">
                              {app.title}
                            </CardTitle>
                            <CardDescription className="text-xs line-clamp-2">
                              {app.description}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="text-center">
                    <Button 
                      size="lg" 
                      onClick={handleViewAllApps}
                      className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Grid3x3 className="w-5 h-5 mr-2" />
                      View All Applications
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="portfolio-layout-container"
              >
                <PortfolioSidebar 
                  activeSection={activeSection}
                  onSectionChange={setActiveSection}
                />
                <div className="portfolio-layout-content">
                  <PortfolioContent activeSection={activeSection} />
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </>
  );
};

export default Home;