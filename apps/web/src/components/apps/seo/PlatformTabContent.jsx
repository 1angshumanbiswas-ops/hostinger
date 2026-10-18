import React, { useState } from 'react';
import AdCopyGenerator from '@/components/apps/seo/AdCopyGenerator';
import TwitterCopyGenerator from '@/components/apps/seo/TwitterCopyGenerator';
import SnapchatCopyGenerator from '@/components/apps/seo/SnapchatCopyGenerator';
import YouTubeCopyGenerator from '@/components/apps/seo/YouTubeCopyGenerator';
import TemplateColorSelector from '@/components/apps/seo/TemplateColorSelector';
import AdPreview from '@/components/apps/seo/AdPreview';
import PlatformEngagementTracker from '@/components/apps/seo/PlatformEngagementTracker';
import SchedulingDashboard from '@/components/apps/seo/SchedulingDashboard';
import TriggerTab from '@/components/apps/seo/TriggerTab';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAIImageSelection } from '@/hooks/useAIImageSelection';
import { Zap } from 'lucide-react';

const PlatformTabContent = ({ platform }) => {
  const [currentCopy, setCurrentCopy] = useState({ 
     id: `${platform}-default`, 
     content: '', 
     tone: 'Professional' 
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  
  const [snapchatImageUrl, setSnapchatImageUrl] = useState("https://horizons-cdn.hostinger.com/e0687bb0-98a0-45d4-8f73-50f1c1652251/458871fe584c6a34dce9a67d14642588.png");

  const jobDetails = {
      title: "HR Recruiter",
      salary: "₹28,000 - ₹85,000",
      location: "Remote (India)",
      company: "TechCorp"
  };

  const copyText = typeof currentCopy === 'string' ? currentCopy : currentCopy?.content || '';
  
  // Image selection is still here but not used in generic AdCopyGenerator anymore, 
  // keeping logic for AdPreview or other components if needed.
  const { 
    selectedImage, 
    isLoading: imageLoading, 
    error: imageError, 
    triggerRefresh, 
    reasoning 
  } = useAIImageSelection(platform, copyText);

  React.useEffect(() => {
    if (platform !== 'snapchat') {
        setCurrentCopy({ id: `${platform}-default`, content: '', tone: 'Professional' });
    }
    setSelectedTemplate(null);
    setSelectedColor(null);
  }, [platform]);

  const handleCopyUpdate = (newContent) => {
    if (platform === 'youtube' && typeof newContent === 'object') {
        setCurrentCopy(newContent); 
        return;
    }

    const contentVal = typeof newContent === 'string' ? newContent : newContent?.content || '';
    
    setCurrentCopy(prev => ({
      ...prev,
      content: contentVal
    }));
  };

  if (platform === 'schedule') {
     return <SchedulingDashboard />;
  }

  const generatorProps = {
     key: platform,
     platform,
     currentCopy,
     onCopyUpdate: handleCopyUpdate,
     currentImage: platform === 'snapchat' ? { imageUrl: snapchatImageUrl } : selectedImage,
     imageLoading,
     imageError,
     refreshImage: triggerRefresh,
     lastImageRefreshed: selectedImage ? new Date() : null,
     selectedColor,
     selectedTemplate,
     currentTheme: { name: "AI Selection", description: reasoning },
     reasoning,
     jobDetails
  };

  const renderGenerator = () => {
      switch(platform) {
          case 'twitter':
              return <TwitterCopyGenerator {...generatorProps} />;
          case 'snapchat':
              return <SnapchatCopyGenerator 
                        {...generatorProps} 
                        refreshImage={() => {}} 
                     />;
          case 'youtube':
              return <YouTubeCopyGenerator {...generatorProps} />;
          default:
              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <Tabs defaultValue="generator" className="w-full">
                           <TabsList className="flex flex-wrap w-full mb-4">
                              <TabsTrigger value="generator" className="flex-1">Editor</TabsTrigger>
                              <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
                              <TabsTrigger value="trigger" className="flex-1 gap-1 text-indigo-600 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                                <Zap className="w-3 h-3" /> Trigger
                              </TabsTrigger>
                           </TabsList>
                           <TabsContent value="generator" className="min-h-[400px]">
                              <AdCopyGenerator {...generatorProps} />
                           </TabsContent>
                           <TabsContent value="style" className="min-h-[400px]">
                              <Card>
                                 <CardContent className="pt-6">
                                    <TemplateColorSelector 
                                      platform={platform}
                                      selectedTemplate={selectedTemplate}
                                      setSelectedTemplate={setSelectedTemplate}
                                      selectedColor={selectedColor}
                                      setSelectedColor={setSelectedColor}
                                    />
                                 </CardContent>
                              </Card>
                           </TabsContent>
                           <TabsContent value="trigger" className="min-h-[400px]">
                              <TriggerTab currentCopy={currentCopy} />
                           </TabsContent>
                        </Tabs>
                    </div>

                    <div className="lg:col-span-5">
                         <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Live Preview</h3>
                         <div className="sticky top-24">
                            <AdPreview 
                               platform={platform}
                               selectedCopy={currentCopy}
                               selectedTemplate={selectedTemplate}
                               selectedColor={selectedColor}
                               currentImage={selectedImage}
                               refreshImage={triggerRefresh}
                               isAiLoading={imageLoading}
                            />
                         </div>
                    </div>

                    <div className="lg:col-span-3">
                         <PlatformEngagementTracker platform={platform} />
                    </div>
                </div>
              );
      }
  };

  return renderGenerator();
};

export default PlatformTabContent;