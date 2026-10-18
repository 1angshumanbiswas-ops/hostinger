import React from 'react';
import { Target, AlertCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ATSScoreBox = ({ score, matchedKeywords = [], missingKeywords = [], analysis, isLoading, hasData }) => {
  
  // 0-30%: "Needs Work" (red)
  // 31-60%: "Fair Match" (yellow)
  // 61-85%: "Good Match" (blue)
  // 86-100%: "Excellent Match" (green)
  
  const getScoreColor = (s) => {
    if (s >= 86) return 'text-green-600';
    if (s >= 61) return 'text-blue-500';
    if (s >= 31) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (s) => {
    if (s >= 86) return 'bg-green-600';
    if (s >= 61) return 'bg-blue-500';
    if (s >= 31) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (s) => {
    if (s >= 86) return 'Excellent Match';
    if (s >= 61) return 'Good Match';
    if (s >= 31) return 'Fair Match';
    return 'Needs Work';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.2 }} 
      className="bg-white p-6 rounded-lg shadow-sm border border-[#EDEBE9] flex flex-col h-full"
    >
      <h3 className="font-semibold text-lg mb-4 flex items-center text-[#323130]">
        <Target className="w-5 h-5 mr-2 text-[#0078D4]" /> 
        ATS Match Score
      </h3>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-[#605E5C] py-8">
          <AlertCircle className="w-10 h-10 mb-3 text-[#C8C6C4]" />
          <p className="text-sm">Upload your CV and save a Job Description to see your ATS Score.</p>
        </div>
      ) : isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-[#0078D4] py-8">
          <Loader2 className="w-10 h-10 mb-3 animate-spin" />
          <p className="text-sm font-medium">Calculating match score...</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center py-2">
          {/* Circular Progress */}
          <div className="relative flex items-center justify-center w-32 h-32 mb-4 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#EDEBE9]"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${score}, 100` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={getScoreColor(score)}
                strokeWidth="3"
                strokeDasharray={`${score}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</span>
            </div>
          </div>
          
          <div className="w-full mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#605E5C] font-medium">Status</span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-xs text-white ${getScoreBg(score)}`}>
                {getScoreLabel(score)}
              </span>
            </div>
            {analysis && (
              <p className="text-xs text-[#605E5C] mt-2 text-center">{analysis}</p>
            )}
          </div>

          {/* Keywords Lists */}
          <div className="w-full grid grid-cols-2 gap-4 mt-auto">
            <div className="bg-[#F3F2F1] p-3 rounded-md">
              <h4 className="text-xs font-semibold text-[#323130] mb-2 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-600" /> Matched ({matchedKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {matchedKeywords.length > 0 ? matchedKeywords.map((kw, i) => (
                  <span key={i} className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                    {kw}
                  </span>
                )) : (
                  <span className="text-[10px] text-[#605E5C] italic">No matches</span>
                )}
              </div>
            </div>
            
            <div className="bg-[#F3F2F1] p-3 rounded-md">
              <h4 className="text-xs font-semibold text-[#323130] mb-2 flex items-center">
                <XCircle className="w-3.5 h-3.5 mr-1 text-red-500" /> Missing ({missingKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {missingKeywords.length > 0 ? missingKeywords.map((kw, i) => (
                  <span key={i} className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                    {kw}
                  </span>
                )) : (
                  <span className="text-[10px] text-[#605E5C] italic">None</span>
                )}
              </div>
            </div>
          </div>
          
        </div>
      )}
    </motion.div>
  );
};

export default ATSScoreBox;