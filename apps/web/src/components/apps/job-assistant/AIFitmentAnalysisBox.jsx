import React from 'react';
import { BrainCircuit, AlertCircle, Loader2, CheckCircle2, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const AIFitmentAnalysisBox = ({ fitmentReasons, improvementSuggestions = [], isLoading, hasData }) => {
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Skills': return 'bg-indigo-50 text-indigo-700';
      case 'Experience': return 'bg-emerald-50 text-emerald-700';
      case 'Qualifications': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.3 }} 
      className="bg-white p-6 rounded-lg shadow-sm border border-[#EDEBE9] flex flex-col h-full"
    >
      <h3 className="font-semibold text-lg mb-4 flex items-center text-[#323130]">
        <BrainCircuit className="w-5 h-5 mr-2 text-[#0078D4]" /> 
        AI Fitment Analysis
      </h3>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-[#605E5C] py-8">
          <AlertCircle className="w-10 h-10 mb-3 text-[#C8C6C4]" />
          <p className="text-sm">Provide both your CV and Job Description to generate AI insights.</p>
        </div>
      ) : isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-[#0078D4] py-8">
          <Loader2 className="w-10 h-10 mb-3 animate-spin" />
          <p className="text-sm font-medium">AI is analyzing your profile...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 max-h-[400px] scrollbar-thin scrollbar-thumb-[#C8C6C4] scrollbar-track-transparent">
          {/* Matched Sections */}
          {fitmentReasons.map((section, idx) => (
            <motion.div 
              key={`match-${idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="space-y-2"
            >
              <h4 className="text-sm font-bold text-[#323130] uppercase tracking-wider">{section.category}</h4>
              <ul className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start text-sm text-[#605E5C]">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
          
          {fitmentReasons.length === 0 && (
            <p className="text-sm text-[#605E5C] text-center italic mt-4">
              Could not extract specific fitment reasons. Try providing a more detailed CV or Job Description.
            </p>
          )}

          {/* Improvement Suggestions Section */}
          {improvementSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 pt-6 border-t border-[#EDEBE9]"
            >
              <h4 className="text-sm font-bold text-[#323130] uppercase tracking-wider mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-[#D83B01]" />
                CV Improvement Suggestions
              </h4>
              <div className="space-y-4">
                {improvementSuggestions.map((sugg, idx) => (
                  <motion.div 
                    key={sugg.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (idx * 0.1) }}
                    className="bg-[#F3F2F1] p-3 rounded-md border border-[#EDEBE9] flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center flex-wrap gap-2">
                        <Badge variant="outline" className={`text-[10px] uppercase font-bold border-none ${getPriorityColor(sugg.priority)}`}>
                          {sugg.priority} Priority
                        </Badge>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getCategoryColor(sugg.category)}`}>
                          {sugg.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#605E5C] font-medium shrink-0 bg-white px-2 py-0.5 rounded shadow-sm border border-[#EDEBE9]">
                        Mentioned {sugg.frequency}x
                      </span>
                    </div>
                    
                    <div className="flex items-start mt-1">
                      <ChevronRight className="w-4 h-4 mr-1.5 text-[#0078D4] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-[#323130]">{sugg.suggestion}</p>
                        <p className="text-xs text-[#605E5C] mt-0.5">{sugg.reason}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      )}
    </motion.div>
  );
};

export default AIFitmentAnalysisBox;