import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Layout, FileType, Contact } from 'lucide-react';

const ScoreBreakdown = ({ analysisResult }) => {
  if (!analysisResult) return null;

  const { score, breakdown } = analysisResult;

  const getScoreColor = (value) => {
    if (value >= 80) return "text-[#2D7A4A]";
    if (value >= 60) return "text-yellow-600";
    return "text-red-500";
  };
  
  const getProgressColor = (value) => {
    if (value >= 80) return "bg-[#2D7A4A]";
    if (value >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const categories = [
    { id: 'keywords', label: 'Keywords Optimization', icon: Target, weight: '25%' },
    { id: 'formatting', label: 'Formatting & Layout', icon: Layout, weight: '20%' },
    { id: 'structure', label: 'Structure & Headers', icon: FileType, weight: '20%' },
    { id: 'contact', label: 'Contact Information', icon: Contact, weight: '15%' },
    { id: 'sections', label: 'Required Sections', icon: Trophy, weight: '20%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Main Score Display */}
      <div className="flex flex-col items-center justify-center py-8 relative">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Circular Background */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="#E8F5E9"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress Circle */}
            <motion.circle
              initial={{ pathLength: 0 }}
              animate={{ pathLength: score / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="96"
              cy="96"
              r="88"
              stroke={score >= 80 ? "#2D7A4A" : score >= 60 ? "#D97706" : "#EF4444"}
              strokeWidth="12"
              strokeLinecap="round"
              fill="transparent"
              className="drop-shadow-sm"
              style={{ strokeDasharray: "1 1" }} // Makes pathLength work with circle
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <motion.span 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`text-5xl font-extrabold ${getScoreColor(score)}`}
            >
              {score}
            </motion.span>
            <span className="text-sm font-medium text-[#555555] mt-1">ATS Score</span>
          </div>
        </div>

        <div className="mt-4 text-center max-w-md">
          <h3 className="text-xl font-bold text-[#333333]">
            {score >= 80 ? "Excellent Compatibility!" : score >= 60 ? "Good Foundation" : "Needs Improvement"}
          </h3>
          <p className="text-[#555555] text-sm mt-2">
            {score >= 80 
              ? "Your resume is well-optimized for Applicant Tracking Systems." 
              : "Review the recommendations below to improve your chances of passing ATS filters."}
          </p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 gap-6 bg-white p-6 rounded-xl border border-[#E0E0D8] shadow-sm">
        <h4 className="font-bold text-[#2D7A4A] mb-2 flex items-center gap-2">
          <Trophy className="w-5 h-5" /> Score Breakdown
        </h4>
        
        <div className="space-y-5">
          {categories.map((cat, index) => {
            const catScore = breakdown[cat.id];
            return (
              <motion.div 
                key={cat.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-[#333333] font-medium">
                    <cat.icon className="w-4 h-4 text-[#2D7A4A]" />
                    {cat.label} <span className="text-xs text-[#999999]">({cat.weight})</span>
                  </div>
                  <span className={`font-bold ${getScoreColor(catScore)}`}>{catScore}/100</span>
                </div>
                <div className="h-2.5 w-full bg-[#F5F3F0] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${catScore}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.8 }}
                    className={`h-full rounded-full ${getProgressColor(catScore)}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScoreBreakdown;