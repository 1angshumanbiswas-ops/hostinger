import React from 'react';
import { Check, Smartphone, Monitor } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TEMPLATES, COLOR_SCHEMES, getColorScheme } from '@/utils/seoAppUtils';

const DesignTemplates = ({ selectedTemplate, setSelectedTemplate, selectedColor, setSelectedColor, activePlatform }) => {
  
  // Auto-select effect
  React.useEffect(() => {
    if (activePlatform) {
      const suggested = getColorScheme(activePlatform);
      // Logic to find matching ID or just use custom
    }
  }, [activePlatform]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls */}
      <div className="lg:col-span-4 space-y-8">
        {/* Templates */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">1</span>
            Choose Layout
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`cursor-pointer border rounded-xl p-4 transition-all relative ${
                  selectedTemplate?.id === template.id
                    ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {selectedTemplate?.id === template.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="h-20 bg-slate-100 rounded-lg mb-3 overflow-hidden">
                   {/* Mini preview skeletons */}
                   {template.id === 'corporate' && <div className="h-full w-full bg-slate-200 flex items-center justify-center"><div className="w-16 h-2 bg-slate-400 rounded"/></div>}
                   {template.id === 'gradient' && <div className="h-full w-full bg-gradient-to-br from-indigo-200 to-purple-200"/>}
                   {template.id === 'lifestyle' && <div className="h-full w-full bg-slate-200 relative"><div className="absolute inset-0 bg-black/10"/></div>}
                </div>
                <p className="font-medium text-sm text-slate-900">{template.name}</p>
                <p className="text-xs text-slate-500">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
            Color Scheme
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {COLOR_SCHEMES.map((scheme) => (
              <div
                key={scheme.id}
                onClick={() => setSelectedColor(scheme)}
                className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border transition-all ${
                  selectedColor?.id === scheme.id
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full shadow-sm ${scheme.isGradient ? 'bg-gradient-to-r' : ''}`}
                       style={{ 
                         background: scheme.isGradient 
                           ? `linear-gradient(to right, ${scheme.colors[0]}, ${scheme.colors[1]})` 
                           : scheme.colors[0] 
                       }}
                  />
                  <span className="text-sm font-medium text-slate-700">{scheme.name}</span>
                </div>
                {selectedColor?.id === scheme.id && <Check className="w-4 h-4 text-slate-900" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-8">
        <div className="bg-slate-100 rounded-2xl p-8 h-full flex flex-col items-center justify-center min-h-[500px]">
          <div className="flex gap-2 mb-6 bg-white rounded-full p-1 shadow-sm">
             <Button variant="ghost" size="sm" className="rounded-full gap-2"><Smartphone className="w-4 h-4"/> Mobile</Button>
             <Button variant="ghost" size="sm" className="rounded-full gap-2"><Monitor className="w-4 h-4"/> Desktop</Button>
          </div>

          {/* The Ad Card Visualization */}
          <div 
            className="w-full max-w-sm aspect-[4/5] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500"
            style={{
               fontFamily: selectedTemplate?.id === 'corporate' ? 'serif' : 'sans-serif'
            }}
          >
            {/* Template: Gradient */}
            {selectedTemplate?.id === 'gradient' && (
              <div 
                className="h-1/2 flex items-center justify-center p-8 text-white text-center"
                style={{ background: `linear-gradient(135deg, ${selectedColor?.colors[0]}, ${selectedColor?.colors[1]})` }}
              >
                 <h2 className="text-3xl font-bold">WE ARE HIRING</h2>
              </div>
            )}

             {/* Template: Corporate */}
            {selectedTemplate?.id === 'corporate' && (
              <div 
                className="h-1/3 flex items-center px-8"
                style={{ backgroundColor: selectedColor?.colors[0] }}
              >
                 <div className="border-l-4 border-white pl-4">
                   <h2 className="text-2xl font-bold text-white tracking-widest">HIRING</h2>
                   <p className="text-white/80 text-sm">JOIN OUR TEAM</p>
                 </div>
              </div>
            )}

            {/* Template: Minimalist */}
            {selectedTemplate?.id === 'minimalist' && (
              <div className="p-8 pb-0">
                 <h2 
                    className="text-4xl font-black tracking-tighter"
                    style={{ color: selectedColor?.colors[0] }}
                 >
                    WE'RE<br/>HIRING.
                 </h2>
              </div>
            )}

            {/* Template: Lifestyle */}
            {selectedTemplate?.id === 'lifestyle' && (
               <div className="h-1/2 bg-slate-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">Image Placeholder</div>
                  <div 
                    className="absolute bottom-4 left-4 px-3 py-1 rounded text-xs font-bold text-white"
                    style={{ backgroundColor: selectedColor?.colors[0] }}
                  >
                    NEW ROLE
                  </div>
               </div>
            )}

            {/* Content Body */}
            <div className="flex-1 p-6 flex flex-col justify-between">
               <div>
                  <h3 className="font-bold text-xl mb-2 text-slate-900">HR Manager</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                     <Badge variant="secondary">Remote</Badge>
                     <Badge variant="secondary">₹28k-₹85k</Badge>
                  </div>
                  <p className="text-sm text-slate-600">Join our dynamic team and lead recruitment strategies.</p>
               </div>
               
               <Button 
                 className="w-full"
                 style={{ 
                   backgroundColor: selectedColor?.colors[1] || selectedColor?.colors[0] 
                 }}
               >
                 Apply Now
               </Button>
            </div>
          </div>

          <p className="mt-6 text-slate-400 text-sm">Live Preview Mode</p>
        </div>
      </div>
    </div>
  );
};

export default DesignTemplates;