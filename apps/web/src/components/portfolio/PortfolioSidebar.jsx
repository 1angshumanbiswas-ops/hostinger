import React from 'react';
import { User, FileText, Briefcase, GraduationCap, Award, Target, Settings, LayoutDashboard, Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PORTFOLIO_PROFILE } from '@/lib/profileData';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const PortfolioSidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Target },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="portfolio-sidebar h-full flex flex-col">
      {/* Profile Section */}
      <div className="p-6 space-y-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-lg mb-4">
            {PORTFOLIO_PROFILE.avatar ? (
              <img 
                src={PORTFOLIO_PROFILE.avatar} 
                alt={PORTFOLIO_PROFILE.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <User className="w-12 h-12 text-white/50" />
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-white mb-1">{PORTFOLIO_PROFILE.name}</h2>
          <p className="text-sm text-white/80 mb-3">{PORTFOLIO_PROFILE.title}</p>
          
          <div className="space-y-2 text-xs text-white/70 w-full">
            <div className="flex items-center gap-2 justify-center">
              <Mail className="w-3 h-3 shrink-0" />
              <span className="truncate">{PORTFOLIO_PROFILE.email}</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Phone className="w-3 h-3 shrink-0" />
              <span>{PORTFOLIO_PROFILE.phone}</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{PORTFOLIO_PROFILE.location}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200",
                isActive && "bg-white/20 text-white font-semibold shadow-sm"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-white")} />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <Separator className="bg-white/10" />

      {/* Footer Section */}
      <div className="p-4 space-y-3">
        <a 
          href={PORTFOLIO_PROFILE.linkedin.startsWith('http') ? PORTFOLIO_PROFILE.linkedin : `https://${PORTFOLIO_PROFILE.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
        >
          <Linkedin className="w-4 h-4" />
          <span>Connect on LinkedIn</span>
        </a>
        
        <div className="text-xs text-white/50">
          <p>Portfolio v1.0</p>
          <p>© 2024 {PORTFOLIO_PROFILE.name}</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSidebar;