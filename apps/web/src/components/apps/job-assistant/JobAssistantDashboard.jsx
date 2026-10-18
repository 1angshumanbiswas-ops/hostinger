import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Upload, FileText, Home, AlertCircle, Loader2, 
  CheckCircle2, XCircle, Lightbulb, Briefcase, Zap, ShieldAlert, LogIn, ChevronDown, ChevronUp
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { analyzeCV } from '@/utils/CVAnalysisEngine';
import { analyzeMatch } from '@/utils/JobMatchingEngine';
import { parseFile } from '@/utils/fileParser';

/**
 * JobAssistantDashboard Component
 * Manages the interactive state for CV Analysis, JD Matching, and AI Recommendations.
 * Uses Framer Motion for smooth accordion-style card expansions.
 */
const JobAssistantDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();

  // State: expandedCard tracks which section is currently open ('cv', 'jd', 'recs', or null)
  const [expandedCard, setExpandedCard] = useState('cv');

  // CV Analysis State
  const [cvFile, setCvFile] = useState(null);
  const [cvAnalysisResult, setCvAnalysisResult] = useState(null);
  const [isAnalyzingCV, setIsAnalyzingCV] = useState(false);

  // JD Matching State
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [jdMatchResult, setJdMatchResult] = useState(null);
  const [isMatchingJD, setIsMatchingJD] = useState(false);

  /**
   * Toggles the expanded state of a card.
   * @param {string} cardId - The ID of the card to toggle
   */
  const toggleCard = (cardId) => {
    setExpandedCard((prev) => (prev === cardId ? null : cardId));
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/signin');
  };

  /**
   * Handles CV file selection.
   */
  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf' && !file.type.includes('word')) {
      toast({ title: "Invalid File", description: "Please upload PDF or DOC files", variant: "destructive" });
      return;
    }
    setCvFile(file);
    setCvAnalysisResult(null); // Reset previous results on new upload
  };

  /**
   * Analyzes the uploaded CV using the CVAnalysisEngine.
   */
  const handleAnalyzeCV = async () => {
    if (!cvFile) {
      return toast({ title: "No File", description: "Please upload a CV to analyze.", variant: "destructive" });
    }

    setIsAnalyzingCV(true);
    try {
      const result = await analyzeCV(cvFile);
      setCvAnalysisResult(result);
      toast({ title: "Analysis Complete", description: "Your CV has been successfully analyzed." });
      // Automatically expand the next logical step (JD matching or Recommendations)
      setExpandedCard('recs'); 
    } catch (error) {
      toast({ title: "Analysis Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAnalyzingCV(false);
    }
  };

  /**
   * Handles Job Description file selection.
   */
  const handleJdFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf' && !file.type.includes('word')) {
      toast({ title: "Invalid File", description: "Please upload PDF or DOC files", variant: "destructive" });
      return;
    }
    setJdFile(file);
    try {
      const text = await parseFile(file);
      setJdText(text);
      toast({ title: "Job Description Extracted", description: "Text successfully extracted from file." });
    } catch (error) {
      toast({ title: "Extraction Failed", description: "Could not read the job description file.", variant: "destructive" });
    }
  };

  /**
   * Matches the CV against the provided Job Description.
   */
  const handleMatchJD = async () => {
    if (!jdText.trim() && !jdFile) {
      return toast({ title: "No Job Description", description: "Please paste or upload a Job Description.", variant: "destructive" });
    }

    setIsMatchingJD(true);
    try {
      const profile = cvAnalysisResult 
        ? { skills: Object.keys(cvAnalysisResult.breakdown).join(' ') } 
        : { text: "Generic professional profile" };
        
      const job = { title: "Target Role", description: jdText, location: "Remote" };
      
      // Simulate network/processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const matchResult = analyzeMatch(job, profile);
      setJdMatchResult(matchResult);
      toast({ title: "Matching Complete", description: "Successfully compared your profile against the JD." });
    } catch (error) {
      toast({ title: "Match Failed", description: error.message || "Failed to process JD matching.", variant: "destructive" });
    } finally {
      setIsMatchingJD(false);
    }
  };

  const handleActionClick = (action) => {
    toast({
      title: "Action Initiated",
      description: `Starting: ${action}. This feature will be implemented soon! 🚀`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hidden md:flex text-slate-500 hover:text-slate-900">
             <Home className="w-5 h-5" />
          </Button>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Agentic AI Job Assistant
          </span>
          {isAdmin && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
              <ShieldAlert className="w-3 h-3 mr-1" /> Super Admin
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Badge variant="secondary" className="hidden sm:inline-flex bg-blue-50 text-blue-700 hover:bg-blue-100">
                {currentUser?.email}
              </Badge>
              <Button variant="ghost" onClick={handleSignOut} className="text-slate-600 hover:bg-slate-100">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </>
          ) : (
            <Button variant="default" onClick={() => navigate('/signin')} className="bg-blue-600 text-white hover:bg-blue-700">
              <LogIn className="w-4 h-4 mr-2" /> Sign In
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 mt-4">
        {!isAuthenticated && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-blue-50 border-blue-200 shadow-sm">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  You are using the Job Assistant as a guest. Your session data is temporary.
                  <span className="font-semibold cursor-pointer underline ml-1 hover:text-blue-900" onClick={() => navigate('/signin')}>
                    Sign in
                  </span> to save your progress across devices.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stacked Interactive Cards (Accordion Style) */}
        <div className="space-y-4">
          
          {/* CARD 1: CV Analysis */}
          <Card className={`overflow-hidden transition-all duration-300 border-slate-200 ${expandedCard === 'cv' ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-sm'}`}>
            <div 
              className={`p-6 cursor-pointer flex items-center justify-between transition-colors ${expandedCard === 'cv' ? 'bg-blue-50/50' : 'bg-white hover:bg-slate-50'}`}
              onClick={() => toggleCard('cv')}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${expandedCard === 'cv' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${expandedCard === 'cv' ? 'text-blue-900' : 'text-slate-800'}`}>CV Analysis</h2>
                  <p className="text-sm text-slate-500">Upload your resume to get an instant AI-powered analysis.</p>
                </div>
              </div>
              <div>
                {expandedCard === 'cv' ? <ChevronUp className="w-6 h-6 text-blue-500" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
              </div>
            </div>
            
            <AnimatePresence>
              {expandedCard === 'cv' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {/* Stop propagation so clicking inside doesn't close the card */}
                  <div className="p-6 pt-0 border-t border-slate-100 bg-white" onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-6 mt-6">
                      <div className="upload-zone border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer relative group bg-white">
                        <input 
                          type="file" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                          accept=".pdf,.doc,.docx"
                          onChange={handleCvUpload}
                        />
                        <div className="flex flex-col items-center">
                          <div className="p-4 bg-slate-100 rounded-full group-hover:bg-blue-100 transition-colors mb-4">
                             <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-1">Drag & drop your resume here</h3>
                          <p className="text-sm text-slate-500">or click to browse from your computer</p>
                          <p className="text-xs text-slate-400 mt-4">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
                        </div>
                      </div>

                      {cvFile && (
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <span className="text-sm font-medium text-blue-900 flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            {cvFile.name}
                          </span>
                          <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">{Math.round(cvFile.size / 1024)} KB</Badge>
                        </div>
                      )}

                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg shadow-sm transition-all" 
                        onClick={handleAnalyzeCV} 
                        disabled={!cvFile || isAnalyzingCV}
                      >
                        {isAnalyzingCV ? (
                          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing CV...</>
                        ) : (
                          <><Zap className="w-5 h-5 mr-2" /> Analyze My CV</>
                        )}
                      </Button>

                      {cvAnalysisResult && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 border rounded-xl overflow-hidden shadow-sm">
                          <div className="bg-slate-900 p-6 text-white text-center">
                            <h3 className="text-xl font-semibold mb-2">Overall Resume Score</h3>
                            <div className="flex justify-center items-center gap-4">
                              <div className="text-6xl font-extrabold text-blue-400">
                                {cvAnalysisResult.score}
                                <span className="text-2xl text-slate-400">/100</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
                            <div className="space-y-4">
                              <h4 className="font-semibold text-lg border-b pb-2">Score Breakdown</h4>
                              {Object.entries(cvAnalysisResult.breakdown).map(([category, score]) => (
                                <div key={category} className="space-y-1.5">
                                  <div className="flex justify-between text-sm">
                                    <span className="capitalize font-medium text-slate-700">{category}</span>
                                    <span className="font-bold text-slate-900">{score}%</span>
                                  </div>
                                  <Progress value={score} className="h-2" />
                                </div>
                              ))}
                            </div>
                            <div className="space-y-4">
                              <h4 className="font-semibold text-lg border-b pb-2">Key Insights</h4>
                              <ul className="space-y-3">
                                <li className="flex gap-3 text-sm text-slate-700">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                  <span>Resume size is optimal ({cvAnalysisResult.fileSize}).</span>
                                </li>
                                {cvAnalysisResult.recommendations.slice(0, 3).map((rec, i) => (
                                  <li key={i} className="flex gap-3 text-sm text-slate-700">
                                    {rec.priority === 'High' ? (
                                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                                    ) : (
                                      <Lightbulb className="w-5 h-5 text-blue-500 shrink-0" />
                                    )}
                                    <span>{rec.text}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* CARD 2: JD Matching */}
          <Card className={`overflow-hidden transition-all duration-300 border-slate-200 ${expandedCard === 'jd' ? 'ring-2 ring-indigo-500 shadow-md' : 'hover:shadow-sm'}`}>
            <div 
              className={`p-6 cursor-pointer flex items-center justify-between transition-colors ${expandedCard === 'jd' ? 'bg-indigo-50/50' : 'bg-white hover:bg-slate-50'}`}
              onClick={() => toggleCard('jd')}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${expandedCard === 'jd' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${expandedCard === 'jd' ? 'text-indigo-900' : 'text-slate-800'}`}>JD Matching</h2>
                  <p className="text-sm text-slate-500">Compare your profile against a target job description.</p>
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
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-6 pt-0 border-t border-slate-100 bg-white" onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-6 mt-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Paste Job Description</label>
                        <Textarea 
                          placeholder="Paste the full job description here..." 
                          className="textarea-input min-h-[200px] resize-y bg-white border-slate-300 focus-visible:ring-indigo-500 text-slate-900"
                          value={jdText}
                          onChange={(e) => setJdText(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">OR UPLOAD FILE</span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                      </div>

                      <div className="upload-zone flex items-center justify-between p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-colors relative">
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx" 
                          onChange={handleJdFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center gap-3">
                          <Upload className="w-5 h-5 text-indigo-500" />
                          <span className="text-sm font-medium text-slate-700">Upload JD Document (PDF, DOCX)</span>
                        </div>
                        {jdFile && <Badge variant="secondary" className="bg-white border-indigo-200 text-indigo-700 pointer-events-none">{jdFile.name}</Badge>}
                      </div>

                      <Button 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg shadow-sm transition-all" 
                        onClick={handleMatchJD} 
                        disabled={(!jdText.trim() && !jdFile) || isMatchingJD}
                      >
                        {isMatchingJD ? (
                          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Match...</>
                        ) : (
                          <><CheckCircle2 className="w-5 h-5 mr-2" /> Calculate Match Score</>
                        )}
                      </Button>

                      {jdMatchResult && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 border rounded-xl overflow-hidden shadow-sm">
                          <div className={`p-6 text-center text-white ${
                            jdMatchResult.score >= 80 ? 'bg-emerald-600' : 
                            jdMatchResult.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}>
                            <h3 className="text-xl font-semibold mb-1">Job Match Score</h3>
                            <p className="text-white/80 text-sm mb-4">Confidence: {jdMatchResult.confidence}</p>
                            <div className="text-6xl font-extrabold">
                              {jdMatchResult.score}%
                            </div>
                          </div>
                          <div className="p-6 space-y-6 bg-white">
                            <div>
                              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">AI Reasoning</h4>
                              <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                                {jdMatchResult.reasoning}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" /> Matched Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {jdMatchResult.matchedSkills?.length > 0 ? (
                                    jdMatchResult.matchedSkills.map(skill => (
                                      <Badge key={skill} className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                        {skill}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-sm text-slate-500 italic">No exact matches found.</span>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <XCircle className="w-4 h-4" /> Missing Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {jdMatchResult.missingSkills?.length > 0 ? (
                                    jdMatchResult.missingSkills.map(skill => (
                                      <Badge key={skill} variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                                        {skill}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-sm text-slate-500 italic">No critical skills missing!</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* CARD 3: AI Recommendations */}
          <Card className={`overflow-hidden transition-all duration-300 border-slate-200 ${expandedCard === 'recs' ? 'ring-2 ring-emerald-500 shadow-md' : 'hover:shadow-sm'}`}>
            <div 
              className={`p-6 cursor-pointer flex items-center justify-between transition-colors ${expandedCard === 'recs' ? 'bg-emerald-50/50' : 'bg-white hover:bg-slate-50'}`}
              onClick={() => toggleCard('recs')}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${expandedCard === 'recs' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${expandedCard === 'recs' ? 'text-emerald-900' : 'text-slate-800'}`}>AI Recommendations</h2>
                  <p className="text-sm text-slate-500">Get personalized actionable steps to improve your resume and job fit.</p>
                </div>
              </div>
              <div>
                {expandedCard === 'recs' ? <ChevronUp className="w-6 h-6 text-emerald-500" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
              </div>
            </div>
            
            <AnimatePresence>
              {expandedCard === 'recs' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-6 pt-0 border-t border-slate-100 bg-white" onClick={(e) => e.stopPropagation()}>
                    <div className="mt-6">
                      {!cvAnalysisResult ? (
                        <div className="p-12 text-center flex flex-col items-center bg-emerald-50/50 rounded-xl border border-dashed border-emerald-200">
                          <div className="p-4 bg-emerald-100 rounded-full mb-4">
                            <Lightbulb className="w-12 h-12 text-emerald-600" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800">Ready for Insights?</h3>
                          <p className="text-slate-600 mt-2 mb-6 max-w-md">
                            Upload and analyze your CV first to generate personalized, AI-driven recommendations tailored to your profile.
                          </p>
                          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setExpandedCard('cv')}>
                            Go to CV Analysis
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">Your Action Plan</h3>
                            <p className="text-slate-500">Personalized steps based on your recent CV analysis.</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cvAnalysisResult.recommendations.map((rec, idx) => (
                              <Card key={idx} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group bg-white">
                                <CardHeader className="pb-3">
                                  <div className="flex justify-between items-start">
                                    <Badge variant="outline" className={`
                                      ${rec.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                      ${rec.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                                      ${rec.priority === 'Low' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                    `}>
                                      {rec.priority} Priority
                                    </Badge>
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                      {rec.category}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pb-4">
                                  <p className="text-slate-700 leading-relaxed text-sm">
                                    {rec.text}
                                  </p>
                                </CardContent>
                                <CardFooter className="pt-0">
                                  <Button 
                                    variant="ghost" 
                                    className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 justify-start px-2"
                                    onClick={() => handleActionClick(`Fix ${rec.category} issue`)}
                                  >
                                    <Zap className="w-4 h-4 mr-2" /> Auto-Fix with AI
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                            {cvAnalysisResult.recommendations.length === 0 && (
                              <div className="col-span-full p-8 text-center text-emerald-600 bg-emerald-50 rounded-xl border border-emerald-200">
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-3" />
                                <h3 className="text-lg font-bold">Your CV looks perfect!</h3>
                                <p>No critical improvements needed based on the current analysis.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
          
        </div>
      </main>
    </div>
  );
};

export default JobAssistantDashboard;