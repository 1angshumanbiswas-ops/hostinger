import React from 'react';
import { BrainCircuit } from 'lucide-react';
import JobAssistantDashboard from '@/components/apps/job-assistant/JobAssistantDashboard';

const JobApplicationAssistant = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3F0] via-white to-[#E8F5E9] p-4 md:p-8 rounded-xl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-[#2D7A4A] flex items-center gap-2">
              <BrainCircuit className="w-8 h-8" />
              Agentic AI Job Assistant {/* Renamed here */}
            </h1>
            <p className="text-[#555555] mt-1">
              Autonomous agent utilizing <span className="font-semibold text-[#2D7A4A]">Semantic Analysis</span> & <span className="font-semibold text-[#2D7A4A]">Auto-Apply</span> engines.
            </p>
          </div>
        </div>

        {/* Main Dashboard */}
        <JobAssistantDashboard />
      </div>
    </div>
  );
};

export default JobApplicationAssistant;