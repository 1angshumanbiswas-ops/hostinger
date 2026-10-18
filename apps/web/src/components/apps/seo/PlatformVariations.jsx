import React, { useState } from 'react';
import { Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Note: This component might be redundant now that PlatformTabContent handles the logic, 
// but we'll update it to match requirements just in case it's used elsewhere or restored.
const PlatformVariations = () => {
  const [activeTab, setActiveTab] = useState('linkedin');

  // Hardcoded custom copies for display purposes within this specific component view
  const customCopies = {
    linkedin: "🚀 We are Hiring: Senior HR Manager\n\nJoin our team and drive innovation. We are looking for passionate individuals who are ready to make a difference.\n\n📍 Location: Remote\n💼 Type: Full-time\n\nApply now via the link in comments! 👇\n\n#Hiring #Jobs #Career #HRManager",
    instagram: "✨ DREAM JOB ALERT ✨\n\nWe're looking for a Senior HR Manager! 🌟\n\nSwipe up to apply if you love challenges and coffee ☕️\n.\n.\n.\n#DreamJob #HiringNow #WorkLife #CareerGoals",
    facebook: "📢 We are growing our family! 📢\n\nLooking for a Senior HR Manager to join our amazing team. Do you know someone who would be a perfect fit? Tag them below! 👇\n\nApply here: [Link]",
    whatsapp: "*Job Alert: Senior HR Manager* 🚨\n\nWe are hiring immediately. Salary competitive.\n\nReply *YES* for more details or send your CV."
  };

  const currentContent = customCopies[activeTab] || "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      <div className="lg:col-span-12 space-y-4">
        <h3 className="font-semibold text-slate-900">Platform Specific Variations</h3>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="linkedin"><Linkedin className="w-4 h-4 mr-2" /> LinkedIn</TabsTrigger>
            <TabsTrigger value="facebook"><Facebook className="w-4 h-4 mr-2" /> Facebook</TabsTrigger>
            <TabsTrigger value="instagram"><Instagram className="w-4 h-4 mr-2" /> Instagram</TabsTrigger>
            <TabsTrigger value="whatsapp"><MessageCircle className="w-4 h-4 mr-2" /> WhatsApp</TabsTrigger>
          </TabsList>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Variation
              </CardTitle>
              <CardDescription>
                Review the custom copy for this platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                className="min-h-[200px] font-sans text-base leading-relaxed" 
                value={currentContent}
                readOnly
              />
              <div className="flex justify-end pt-2">
                 <Button variant="outline">Edit in Generator</Button>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default PlatformVariations;