import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  Briefcase, FileText, CheckCircle, ChevronDown, ChevronUp, 
  Upload, Zap, Lightbulb, AlertCircle 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function JobAssistantLandingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // 1. Initialize expandedCard state
  const [expandedCard, setExpandedCard] = useState(null);

  // Demo states
  const [demoCv, setDemoCv] = useState(null);
  const [demoJd, setDemoJd] = useState('');

  // 4. Click handler to toggle expanded state
  const toggleCard = (cardId) => {
    console.log(`Toggling card: ${cardId}`);
    setExpandedCard(prev => prev === cardId ? null : cardId);
  };

  const handleDemoAction = (action) => {
    toast({
      title: "Demo Mode",
      description: `This is a landing page demo. Sign up to use the full ${action} feature! 🚀`,
    });
    setTimeout(() => navigate('/signup'), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F3F2F1] text-[#323130] font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#EDEBE9] px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <Briefcase className="h-6 w-6 text-emerald-600" />
          <span className="text-xl font-semibold text-[#323130]">Agentic AI Job Assistant</span>
        </div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate('/signin')} className="text-emerald-700 hover:bg-emerald-50">
            Sign In
          </Button>
          {/* 6 & 7. Change button text to "Sign Up" and maintain green background */}
          <Button 
            onClick={() => navigate('/signup')} 
            className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
          >
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-start pt-16 p-8 text-center bg-gradient-to-b from-white to-[#F3F2F1]">
        <h1 className="text-5xl font-bold mb-6 text-[#323130] max-w-3xl">
          Your Career, Optimized.<br/>Your Matches, Personalized.
        </h1>
        <p className="text-xl text-[#605E5C] mb-10 max-w-2xl">
          Leverage the power of Agentic AI to perfectly align your resume with top job descriptions, automating your path to success. Try the interactive demo below!
        </p>

        {/* 2 & 3. Interactive Feature Cards (Accordion Style) */}
        <div className="w-full max-w-4xl space-y-4 mt-8 text-left">
          
          {/* CV Analysis Card */}
          <Card className={`overflow-hidden transition-all duration-300 border-[#EDEBE9] ${expandedCard === 'cv' ? 'ring-2 ring-emerald-500 shadow-md' : 'hover:shadow-sm'}`}>
            <div 
              className={`p-6 cursor-pointer flex items-center justify-between transition-colors ${expandedCard === 'cv' ? 'bg-emerald-50/50' : 'bg-white hover:bg-slate-50'}`}
              onClick={() => toggleCard('cv')}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${expandedCard === 'cv' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${expandedCard === 'cv' ? 'text-emerald-900' : 'text-[#323130]'}`}>CV Analysis</h2>
                  <p className="text-sm text-[#605E5C]">Upload your CV and let our AI extract key skills and experiences instantly.</p>
                </div>
              </div>
              <div>
                {expandedCard === 'cv' ? <ChevronUp className="w-6 h-6 text-emerald-500" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
              </div>
            </div>
            
            <AnimatePresence>
              {/* 3 & 5. Conditional rendering for expanded content */}
              {expandedCard === 'cv' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 pt-0 border-t border-slate-100 bg-white" onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-6 mt-6">
                      <div className="upload-zone border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer relative group bg-white">
                        <input 
                          type="file" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            if(e.target.files[0]) setDemoCv(e.target.files[0].name);
                          }}
                        />
                        <div className="flex flex-col items-center">
                          <div className="p-4 bg-slate-100 rounded-full group-hover:bg-emerald-100 transition-colors mb-4">
                             <Upload className="w-8 h-8 text-slate-500 group-hover:text-emerald-600 transition-colors" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-1">Drag & drop your resume here</h3>
                          <p className="text-sm text-slate-500">or click to browse for a demo file</p>
                        </div>
                      </div>
                      
                      {demoCv && (
                        <div className="p-4 bg-emerald-50 rounded-lg text-emerald-800 text-sm font-medium border border-emerald-200">
                          Demo file selected: {demoCv}
                        </div>
                      )}

                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg shadow-sm" 
                        onClick={() => handleDemoAction('CV Analysis')}
                      >
                        <Zap className="w-5 h-5 mr-2" /> Try Demo Analysis
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* JD Matching Card */}
          <Card className={`overflow-hidden transition-all duration-300 border-[#EDEBE9] ${expandedCard === 'jd' ? 'ring-2 ring-indigo-500 shadow-md' : 'hover:shadow-sm'}`}>
            <div 
              className={`p-6 cursor-pointer flex items-center justify-between transition-colors ${expandedCard === 'jd' ? 'bg-indigo-50/50' : 'bg-white hover:bg-slate-50'}`}
              onClick={() => toggleCard('jd')}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${expandedCard === 'jd' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${expandedCard === 'jd' ? 'text-indigo-900' : 'text-[#323130]'}`}>JD Matching</h2>
                  <p className="text-sm text-[#605E5C]">Compare your profile against specific job descriptions to find perfect matches.</p>
                </div>
              </div>
              <div>
                {expandedCard === 'jd' ? <ChevronUp className="w-6 h-6 text-indigo-500" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
              </div>
            </div>
            
            <AnimatePresence>
              {expandedCard === 'jd' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 pt-0 border-t border-slate-100 bg-white" onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-6 mt-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Paste Job Description (Demo)</label>
                        <Textarea 
                          placeholder="Paste a sample job description here..." 
                          className="min-h-[150px] resize-y bg-white border-slate-300 focus-visible:ring-indigo-500 text-slate-900"
                          value={demoJd}
                          onChange={(e) => setDemoJd(e.target.value)}
                        />
                      </div>
                      <Button 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg shadow-sm" 
                        onClick={() => handleDemoAction('Job Matching')}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" /> Calculate Demo Score
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* AI Recommendations Card */}
          <Card className={`overflow-hidden transition-all duration-300 border-[#EDEBE9] ${expandedCard === 'recs' ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-sm'}`}>
            <div 
              className={`p-6 cursor-pointer flex items-center justify-between transition-colors ${expandedCard === 'recs' ? 'bg-blue-50/50' : 'bg-white hover:bg-slate-50'}`}
              onClick={() => toggleCard('recs')}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${expandedCard === 'recs' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${expandedCard === 'recs' ? 'text-blue-900' : 'text-[#323130]'}`}>AI Recommendations</h2>
                  <p className="text-sm text-[#605E5C]">Get actionable insights to improve your resume for target roles.</p>
                </div>
              </div>
              <div>
                {expandedCard === 'recs' ? <ChevronUp className="w-6 h-6 text-blue-500" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
              </div>
            </div>
            
            <AnimatePresence>
              {expandedCard === 'recs' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 pt-0 border-t border-slate-100 bg-white" onClick={(e) => e.stopPropagation()}>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Sample Recommendation Cards */}
                      <Card className="border-slate-200 shadow-sm bg-white">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High Priority</Badge>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600">Keywords</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-700 text-sm">Add more explicit mentions of "React" and "Node.js" to match the target JD density.</p>
                        </CardContent>
                        <CardFooter className="pt-0">
                           <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 justify-start px-2" onClick={() => handleDemoAction('Auto-Fix')}>
                            <Zap className="w-4 h-4 mr-2" /> Auto-Fix (Demo)
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      <Card className="border-slate-200 shadow-sm bg-white">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Medium Priority</Badge>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600">Formatting</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-700 text-sm">Quantify your achievements in your latest role. Use metrics like "increased by X%".</p>
                        </CardContent>
                        <CardFooter className="pt-0">
                           <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 justify-start px-2" onClick={() => handleDemoAction('Auto-Fix')}>
                            <Zap className="w-4 h-4 mr-2" /> Auto-Fix (Demo)
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#EDEBE9] py-8 text-center">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-[#605E5C] text-sm">© {new Date().getFullYear()} Agentic AI Job Assistant. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-[#605E5C]">
             <span className="text-sm cursor-pointer hover:text-emerald-600 transition-colors">Privacy Policy</span>
             <span className="text-sm cursor-pointer hover:text-emerald-600 transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}