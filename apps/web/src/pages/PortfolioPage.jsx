import React from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Briefcase } from 'lucide-react';
import PortfolioUploadTab from '@/components/portfolio/PortfolioUploadTab';
import PortfolioDownloadTab from '@/components/portfolio/PortfolioDownloadTab';

export default function PortfolioPage() {
  return (
    <>
      <Helmet>
        <title>My Portfolio - Professional CV Management</title>
        <meta name="description" content="Upload and download professional CV files. Manage your portfolio documents easily." />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Hero Section */}
        <section className="portfolio-hero-section py-16 md:py-20">
          <div className="portfolio-hero-pattern" />
          <div className="relative z-10 app-container">
            <div className="flex flex-col items-center text-center space-y-6 fade-in-up">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-xl">
                <Briefcase className="h-10 w-10 text-white" />
              </div>
              
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  Angshuman Biswas
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                  Full Stack Developer & AI Solutions Architect
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <FileText className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-medium">Secure Document Management</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="app-container -mt-8 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="portfolio-card p-6 md:p-8 shadow-2xl animate-in">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                  <TabsTrigger 
                    value="upload" 
                    className="portfolio-tab-trigger data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Upload CV
                  </TabsTrigger>
                  <TabsTrigger 
                    value="download" 
                    className="portfolio-tab-trigger data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Download CV
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="animate-in fade-in-up">
                  <PortfolioUploadTab />
                </TabsContent>

                <TabsContent value="download" className="animate-in fade-in-up">
                  <PortfolioDownloadTab />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 dark:bg-black text-white py-8 mt-16 border-t border-slate-800">
          <div className="app-container text-center">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} Angshuman Biswas. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}