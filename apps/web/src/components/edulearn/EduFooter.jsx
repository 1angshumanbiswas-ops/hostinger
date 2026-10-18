import React from 'react';
import { GraduationCap, Mail, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EduFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-[hsl(var(--edulearn-heading))]">Edulearn</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your comprehensive platform for NCERT and CBSE educational materials. Access quality resources for Classes 6-12.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-base mb-4 text-foreground">Quick Links</h3>
            <nav className="space-y-2">
              <button onClick={() => navigate('/edulearn')} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </button>
              <button onClick={() => navigate('/edulearn/classes')} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Browse Classes
              </button>
              <button onClick={() => navigate('/edulearn/library')} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Resource Library
              </button>
              <button onClick={() => navigate('/edulearn/login')} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Student Login
              </button>
            </nav>
          </div>

          <div>
            <h3 className="font-bold text-base mb-4 text-foreground">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>support@edulearn.edu</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span>www.edulearn.edu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Edulearn. All educational materials are sourced from NCERT, CBSE, and authorized partners.</p>
        </div>
      </div>
    </footer>
  );
}