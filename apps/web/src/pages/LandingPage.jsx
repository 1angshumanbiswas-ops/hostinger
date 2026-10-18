import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, FileText, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F3F2F1] text-[#323130] font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#EDEBE9] px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-[#0078D4]" />
          <span className="text-xl font-semibold text-[#323130]">Agentic AI Job Assistant</span>
        </div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate('/signin')} className="text-[#0078D4] hover:bg-[#F3F2F1]">
            Sign In
          </Button>
          <Button onClick={() => navigate('/signup')} className="bg-[#0078D4] hover:bg-[#106EBE] text-white">
            Register
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-white to-[#F3F2F1]">
        <h1 className="text-5xl font-bold mb-6 text-[#323130] max-w-3xl">
          Your Career, Optimized.<br/>Your Matches, Personalized.
        </h1>
        <p className="text-xl text-[#605E5C] mb-10 max-w-2xl">
          Leverage the power of Agentic AI to perfectly align your resume with top job descriptions, automating your path to success.
        </p>
        <Button onClick={() => navigate('/signup')} className="bg-[#0078D4] hover:bg-[#106EBE] text-white text-lg px-8 py-6 h-auto">
          Get Started Free
        </Button>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl w-full text-left">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EDEBE9]">
            <FileText className="h-8 w-8 text-[#0078D4] mb-4" />
            <h3 className="text-lg font-semibold mb-2">CV Analysis</h3>
            <p className="text-[#605E5C]">Upload your CV and let our AI extract key skills and experiences instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EDEBE9]">
            <Briefcase className="h-8 w-8 text-[#0078D4] mb-4" />
            <h3 className="text-lg font-semibold mb-2">JD Matching</h3>
            <p className="text-[#605E5C]">Compare your profile against specific job descriptions to find perfect matches.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EDEBE9]">
            <CheckCircle className="h-8 w-8 text-[#0078D4] mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Recommendations</h3>
            <p className="text-[#605E5C]">Get actionable insights to improve your resume for target roles.</p>
          </div>
        </div>
      </main>
    </div>
  );
}