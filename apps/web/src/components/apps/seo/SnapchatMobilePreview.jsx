import React from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const SnapchatMobilePreview = () => {
  const imageUrl = "https://images.unsplash.com/photo-1612653847654-c870630994b2";

  return (
    <div className="w-full max-w-[768px] mx-auto bg-slate-50 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200/60 font-sans">
      
      {/* Responsive Container: Flex Column on Mobile, Row on Desktop (md) */}
      <div className="flex flex-col md:flex-row h-full md:min-h-[500px]">
        
        {/* 1. Content Section (Left on Desktop, Bottom on Mobile) 
            We use 'order-2 md:order-1' to put it bottom on mobile, left on desktop
        */}
        <div className="flex-1 order-2 md:order-1 flex flex-col justify-between bg-[var(--snap-card-bg)]">
          
          <ScrollArea className="h-[400px] md:h-auto md:flex-1">
            <div className="snap-section space-y-6">
              
              {/* Header Group */}
              <div className="space-y-2">
                <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 px-3 py-1 mb-2">
                  URGENT HIRING
                </Badge>
                <h1 className="snap-heading">
                  🚀 MEGA HR JOB OPENINGS - WORK FROM HOME!
                </h1>
                <p className="snap-subheading">
                  Looking for a fresh start? Join our global team.
                </p>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 snap-label">
                    <Briefcase className="w-3 h-3" /> Position
                  </div>
                  <p className="snap-value">HR - Recruitment</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 snap-label">
                    <DollarSign className="w-3 h-3" /> Salary
                  </div>
                  <p className="snap-value text-green-600">₹28k - ₹85k/mo</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 snap-label">
                    <MapPin className="w-3 h-3" /> Job Type
                  </div>
                  <p className="snap-value">Remote / Permanent</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 snap-label">
                    <Clock className="w-3 h-3" /> Process
                  </div>
                  <p className="snap-value text-amber-600">24h Selection</p>
                </div>
              </div>

              {/* Requirements List */}
              <div className="space-y-3">
                <h3 className="snap-label text-slate-400">REQUIREMENTS</h3>
                <ul className="space-y-2">
                  {[
                    "Excellent communication skills",
                    "Laptop/PC with stable internet",
                    "Available for immediate joining"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </ScrollArea>

          {/* Sticky Footer Action Area */}
          <div className="p-4 sm:p-6 bg-white border-t border-slate-100 z-10">
            <button className="snap-btn-primary group">
              Apply Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-xs text-slate-400 mt-3 font-medium">
              Don't miss out - your HR journey begins today!
            </p>
          </div>
        </div>

        {/* 2. Visual Section (Top on Mobile, Right on Desktop)
            'order-1 md:order-2' ensures it's top on mobile, right on desktop
        */}
        <div className="relative order-1 md:order-2 w-full md:w-[45%] h-[300px] md:h-auto overflow-hidden bg-slate-100">
          {/* Main Image */}
          <img 
            src={imageUrl} 
            alt="Professional HR Manager in modern office setting" 
            className="w-full h-full object-cover object-center md:object-top transition-transform hover:scale-105 duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-l" />

          {/* Top Bar (Mobile Context) */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-white/50 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=HR&background=random" alt="Logo" />
              </div>
              <span className="text-white font-bold text-sm drop-shadow-md">HR Careers</span>
            </div>
            <button className="text-white/80 hover:text-white">
              <MoreHorizontal className="w-5 h-5 drop-shadow-md" />
            </button>
          </div>

          {/* Engagement Icons (Floating) */}
          <div className="absolute bottom-4 right-4 flex flex-row md:flex-col gap-3 z-20">
            <button className="snap-icon-btn group">
              <Heart className="w-5 h-5 group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
            </button>
            <button className="snap-icon-btn group">
              <MessageCircle className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
            </button>
            <button className="snap-icon-btn group">
              <Share2 className="w-5 h-5 group-hover:text-green-500 transition-colors" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SnapchatMobilePreview;