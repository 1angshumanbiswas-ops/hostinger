import React from 'react';
import { Check, Palette, Layout } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TEMPLATES, COLOR_SCHEMES } from '@/utils/seoAppUtils';

const TemplateColorSelector = ({ platform, selectedTemplate, setSelectedTemplate, selectedColor, setSelectedColor }) => {
  
  const platformTemplates = TEMPLATES[platform] || [];
  const platformColors = COLOR_SCHEMES[platform] || [];

  return (
    <div className="space-y-6">
      
      {/* Templates */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Layout className="w-3 h-3" /> Layouts
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {platformTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`cursor-pointer border rounded-lg p-3 transition-all relative ${
                selectedTemplate?.id === template.id
                  ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-1.5 right-1.5 bg-indigo-600 rounded-full p-0.5">
                  <Check className="w-2 h-2 text-white" />
                </div>
              )}
              <div className="h-16 bg-slate-100 rounded mb-2 overflow-hidden flex items-center justify-center">
                 <div className="w-8 h-1 bg-slate-300 rounded-full"></div>
              </div>
              <p className="font-semibold text-xs text-slate-900">{template.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Palette className="w-3 h-3" /> Themes
        </h4>
        <div className="space-y-2">
          {platformColors.map((scheme) => (
            <div
              key={scheme.id}
              onClick={() => setSelectedColor(scheme)}
              className={`cursor-pointer flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                selectedColor?.id === scheme.id
                  ? 'border-slate-900 bg-slate-100'
                  : 'border-transparent hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                   className="w-8 h-8 rounded-full shadow-sm ring-1 ring-black/5"
                   style={{ 
                     background: scheme.isGradient 
                       ? `linear-gradient(to right, ${scheme.colors[0]}, ${scheme.colors[1]})` 
                       : scheme.colors[0] 
                   }}
                />
                <span className="text-xs font-medium text-slate-700">{scheme.name}</span>
              </div>
              {selectedColor?.id === scheme.id && <Check className="w-3 h-3 text-slate-900" />}
            </div>
          ))}
        </div>
      </div>
      
      <Button variant="outline" className="w-full text-xs" size="sm">
        Auto-Rotate Theme
      </Button>
    </div>
  );
};

export default TemplateColorSelector;