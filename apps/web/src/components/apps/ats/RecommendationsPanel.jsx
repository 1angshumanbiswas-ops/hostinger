import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const RecommendationsPanel = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-[#E0E0D8]">
        <CheckCircle className="w-16 h-16 text-[#2D7A4A] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#333333]">No Recommendations Needed!</h3>
        <p className="text-[#555555] mt-2">Your CV looks perfectly optimized based on our current checks.</p>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'Medium': return <Info className="w-5 h-5 text-yellow-600" />;
      case 'Low': return <Info className="w-5 h-5 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-[#2D7A4A]">Action Items</h3>
        <span className="text-sm font-medium text-[#555555] bg-white px-3 py-1 rounded-full border border-[#E0E0D8]">
          {recommendations.length} Suggestions Found
        </span>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border border-[#E0E0D8] hover:border-[#2D7A4A] transition-all duration-300 hover:shadow-md bg-white overflow-hidden">
              <div className={`h-1 w-full ${
                rec.priority === 'High' ? 'bg-red-500' : 
                rec.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} />
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    {getPriorityIcon(rec.priority)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 justify-between">
                      <h4 className="font-semibold text-[#333333] text-lg">{rec.category} Issue</h4>
                      <Badge variant="outline" className={`${getPriorityColor(rec.priority)} border font-semibold`}>
                        {rec.priority} Priority
                      </Badge>
                    </div>
                    <p className="text-[#555555] leading-relaxed">
                      {rec.text}
                    </p>
                    {rec.action && (
                      <div className="pt-2 mt-2 border-t border-slate-100 flex items-center text-sm font-medium text-[#2D7A4A]">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Recommended Action: {rec.action}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPanel;