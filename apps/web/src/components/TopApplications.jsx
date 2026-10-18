import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { appsData } from '@/data/appsData';

const TopApplications = () => {
  const navigate = useNavigate();
  
  const featuredApps = appsData
    .filter(app => app.id !== 'job-assistant')
    .slice(0, 6);

  const handleAppCardClick = (app) => {
    if (app.path) {
      navigate(app.path);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-12">
      {featuredApps.map((app, index) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => handleAppCardClick(app)}
          whileHover={{ scale: 1.02, translateY: -4 }}
          className="group bg-card rounded-xl p-6 border border-border hover:border-[hsl(var(--dark-green))] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row gap-6"
        >
          <div className="w-16 h-16 bg-[hsl(var(--dark-green))]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[hsl(var(--dark-green))] transition-colors duration-300">
            {app.icon && <app.icon className="w-8 h-8 text-[hsl(var(--dark-green))] group-hover:text-white transition-colors duration-300" />}
          </div>
          
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-[hsl(var(--dark-green))] mb-2 flex items-center gap-2 group-hover:text-[hsl(var(--dark-green-hover))] transition-colors">
              {app.title}
              <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-[hsl(var(--dark-green))]" />
            </h3>
            <p className="text-foreground/80 text-sm leading-relaxed mb-4 flex-grow">
              {app.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs font-medium text-[hsl(var(--dark-green))]/80">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--dark-green))] animate-pulse" />
                  {app.status || 'Live Application'}
                </span>
              </div>
              <span className="text-xs font-bold text-[hsl(var(--dark-green))] group-hover:text-[hsl(var(--dark-green-hover))] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Launch App <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TopApplications;