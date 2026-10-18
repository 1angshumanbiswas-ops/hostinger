import React from 'react';
import { LayoutDashboard, FileText, Briefcase, GraduationCap, Award, Settings, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PortfolioNavigation = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Target },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="space-y-1 mt-6">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => onSectionChange(item.id)}
            className={`w-full justify-start font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-white/20 text-white hover:bg-white/25 border-l-4 border-white shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10 border-l-4 border-transparent'
            }`}
          >
            <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-white/70'}`} />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
};

export default PortfolioNavigation;