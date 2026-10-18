import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Search, Rocket } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { appsData, appCategories } from '@/data/appsData';

const AppsHub = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredApps = useMemo(() => {
    return appsData.filter(app => {
      const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleLaunchApp = (path) => {
    navigate(path);
  };

  return (
    <>
      <Helmet>
        <title>All Applications - Angshuman Biswas</title>
        <meta name="description" content="Explore all applications built by Angshuman Biswas - AI Generalist No Code Developer" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b">
          <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold mb-4 dark-green-heading">All Applications</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover and launch powerful applications built with AI and no-code tools
              </p>
            </div>

            {/* Search and Filter */}
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search applications by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={selectedCategory === 'All' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('All')}
                  className="transition-all duration-300"
                >
                  All Apps
                </Button>
                {appCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="transition-all duration-300"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {filteredApps.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-2">No applications found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredApps.length} {filteredApps.length === 1 ? 'application' : 'applications'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredApps.map((app) => {
                  const IconComponent = app.icon;
                  return (
                    <Card 
                      key={app.id} 
                      className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border-border/50 hover:border-primary/50"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {app.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl dark-green-heading group-hover:text-primary transition-colors duration-300">
                          {app.title}
                        </CardTitle>
                        <CardDescription className="text-sm line-clamp-2 min-h-[40px]">
                          {app.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardFooter className="mt-auto pt-0">
                        <Button
                          onClick={() => handleLaunchApp(app.path)}
                          className="w-full group-hover:shadow-lg transition-all duration-300"
                        >
                          <Rocket className="w-4 h-4 mr-2" />
                          Launch App
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AppsHub;