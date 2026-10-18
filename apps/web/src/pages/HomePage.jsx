import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, LayoutGrid, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TopApplications from '@/components/TopApplications';
import { Helmet } from 'react-helmet';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>AI Generalist No Code Developer - Smart Tools & Applications</title>
        <meta name="description" content="Transforming ideas into reality with cutting-edge AI tools and no-code platforms. Explore my portfolio of intelligent applications designed to solve real-world problems." />
      </Helmet>

      <div className="min-h-screen bg-[hsl(280,100%,97%)]">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
              <LayoutGrid className="w-6 h-6 text-[hsl(262,83%,58%)] group-hover:text-[hsl(262,83%,48%)] transition-colors" />
              <span className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">My Digital Space</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/portfolio')} 
                className="hidden sm:inline-flex text-gray-600 hover:text-[hsl(262,83%,58%)] hover:bg-purple-50"
              >
                Portfolio
              </Button>
              <Button 
                variant="default" 
                className="bg-[hsl(262,83%,58%)] text-white hover:bg-[hsl(262,83%,48%)]" 
                onClick={() => navigate('/job-assistant')}
              >
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section - Light Violet Background */}
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-gray-600 text-lg font-medium tracking-wide uppercase"
            >
              AI Generalist No Code Developer
            </motion.p>

            {/* Main Heading - Purple Text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(262,83%,58%)] leading-tight tracking-tight"
            >
              We Study Trends Your Needs, Build Smart Tools, and Ensure You Love Using Them
            </motion.h1>

            {/* Subtitle - Gray Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
            >
              Transforming ideas into reality with cutting-edge AI tools and no-code platforms. 
              Explore my portfolio of intelligent applications designed to solve real-world problems.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button 
                size="lg" 
                className="bg-[hsl(262,83%,58%)] text-white hover:bg-[hsl(262,83%,48%)] text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/job-assistant')}
              >
                Explore All Apps
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-50 hover:border-[hsl(262,83%,58%)] text-lg px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all"
                onClick={() => navigate('/portfolio')}
              >
                View Portfolio
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Top Applications Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(262,83%,58%)] mb-4">
                Top Applications
              </h2>
              <p className="text-gray-600 text-lg">
                Click on any card to launch the live demo
              </p>
            </div>
            <TopApplications />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Angshuman Biswas. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}