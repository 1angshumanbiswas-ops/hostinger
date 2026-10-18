import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, FileCheck, BarChart, ListChecks, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CVUploadArea from './ats/CVUploadArea';
import ScoreBreakdown from './ats/ScoreBreakdown';
import RecommendationsPanel from './ats/RecommendationsPanel';
import { analyzeCV } from '@/utils/CVAnalysisEngine';

const ATSCVOptimizer = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setIsAnalyzing(true);
    
    try {
      // Simulate slight network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = await analyzeCV(selectedFile);
      setAnalysis(result);
      setActiveTab("score");
      
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${selectedFile.name}`,
        className: "bg-[#E8F5E9] border-[#2D7A4A] text-[#2D7A4A]",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Analysis Failed",
        description: "Could not parse the file. Please try another PDF or DOCX.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysis(null);
    setActiveTab("upload");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3F0] via-white to-[#E8F5E9] p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2D7A4A]">ATS CV Optimizer</h1>
            <p className="text-[#555555] mt-1">
              Optimize your resume for Applicant Tracking Systems with AI-driven insights.
            </p>
          </div>
          {file && (
            <button 
              onClick={resetAnalysis}
              className="flex items-center text-sm font-medium text-[#555555] hover:text-[#2D7A4A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Analyze New File
            </button>
          )}
        </div>

        {/* Main Content Area */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-[#E0E0D8] bg-[#F5F3F0] px-6 py-2">
              <TabsList className="bg-transparent w-full justify-start gap-6 p-0 h-auto">
                <TabsTrigger 
                  value="upload" 
                  disabled={isAnalyzing}
                  className="data-[state=active]:bg-white data-[state=active]:text-[#2D7A4A] data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-[#555555]"
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Upload CV
                </TabsTrigger>
                <TabsTrigger 
                  value="score" 
                  disabled={!analysis || isAnalyzing}
                  className="data-[state=active]:bg-white data-[state=active]:text-[#2D7A4A] data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-[#555555]"
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  Score Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="recommendations" 
                  disabled={!analysis || isAnalyzing}
                  className="data-[state=active]:bg-white data-[state=active]:text-[#2D7A4A] data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-[#555555]"
                >
                  <ListChecks className="w-4 h-4 mr-2" />
                  Recommendations
                  {analysis?.recommendations?.length > 0 && (
                    <span className="ml-2 bg-[#2D7A4A] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {analysis.recommendations.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="p-6 min-h-[500px] relative">
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10"
                  >
                    <Loader2 className="w-16 h-16 text-[#2D7A4A] animate-spin mb-4" />
                    <h3 className="text-xl font-bold text-[#2D7A4A]">Analyzing Your Resume...</h3>
                    <p className="text-[#555555]">Checking keywords, formatting, and structure</p>
                  </motion.div>
                ) : (
                  <>
                    <TabsContent value="upload" className="mt-0 h-full flex items-center justify-center">
                      <CVUploadArea onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
                    </TabsContent>

                    <TabsContent value="score" className="mt-0">
                      {analysis && <ScoreBreakdown analysisResult={analysis} />}
                    </TabsContent>

                    <TabsContent value="recommendations" className="mt-0">
                      {analysis && <RecommendationsPanel recommendations={analysis.recommendations} />}
                    </TabsContent>
                  </>
                )}
              </AnimatePresence>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ATSCVOptimizer;