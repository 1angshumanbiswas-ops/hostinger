import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import TopApplications from '@/components/TopApplications';
import AllAppsGrid from '@/components/AllAppsGrid';

const FeatureCard = ({ icon: Icon, title, description, features, buttonText, onClick }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    className="bg-card rounded-2xl p-8 shadow-md hover:shadow-xl border border-border hover:border-primary flex flex-col h-full transition-all duration-300 cursor-pointer group"
    onClick={onClick}
  >
    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
      <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
    </div>
    
    <h3 className="text-xl font-bold text-dark-green mb-3">{title}</h3>
    <p className="text-foreground/80 mb-8 leading-relaxed">
      {description}
    </p>

    <div className="space-y-3 mb-8 flex-grow">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center text-sm text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
          {feature}
        </div>
      ))}
    </div>

    <div className="flex items-center font-semibold text-primary group-hover:text-primary/80 transition-colors mt-auto">
      {buttonText}
      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
    </div>
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background space-y-16 pb-20 pt-16">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-dark-green tracking-tight drop-shadow-sm"
        >
          Welcome to My Digital Space
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
        >
          Explore my professional portfolio and try out my AI-powered tools. Choose your path to discover innovative applications and solutions.
        </motion.p>
      </section>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FeatureCard 
            icon={Briefcase}
            title="AI-Powered Job Assistant"
            description="Intelligent job matching and application assistance"
            features={[
              "Smart Job Matching",
              "Auto-Apply Capability",
              "ATS Score Analysis"
            ]}
            buttonText="Launch AI Assistant"
            onClick={() => navigate('/job-assistant')}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FeatureCard 
            icon={Code}
            title="My Portfolio"
            description="Showcase your professional work and achievements"
            features={[
              "Project Showcase",
              "Skills Highlight",
              "Professional Network"
            ]}
            buttonText="View Portfolio"
            onClick={() => navigate('/portfolio')}
          />
        </motion.div>
      </section>

      {/* Action Button */}
      <section className="flex flex-col items-center justify-center space-y-3 px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-3"
        >
          <Button 
            size="lg" 
            onClick={() => navigate('/job-assistant')}
            className="text-lg px-8 py-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-transform hover:scale-105"
          >
            Get Started with Job Assistant
          </Button>
          <p className="text-sm text-muted-foreground font-medium">
            Requires login to save your data
          </p>
        </motion.div>
      </section>

      {/* Top Applications Section */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-dark-green mb-2">Featured Apps</h2>
          <p className="text-muted-foreground">Discover our most popular AI-powered tools and dashboards</p>
        </div>
        <TopApplications />
      </section>

      {/* All Applications Grid Section */}
      <section className="w-full border-t border-border pt-8 bg-card/30">
        <AllAppsGrid />
      </section>
    </div>
  );
};

export default Home;