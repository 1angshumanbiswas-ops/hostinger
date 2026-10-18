import React from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AutoApplyPanel = ({ applications }) => {
  return (
    <Card className="h-full border-[#E0E0D8] bg-white shadow-sm flex flex-col">
      <CardHeader className="border-b border-slate-100 bg-[#F5F3F0] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-[#333333]">Auto Applied</CardTitle>
            <p className="text-xs text-[#555555]">
              {applications.length} applications submitted
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-[400px] w-full p-4">
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 space-y-2">
                <Send className="w-8 h-8 opacity-20" />
                <p className="text-sm">No applications sent yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg border border-slate-100 bg-white flex items-center justify-between shadow-sm group hover:border-green-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center shrink-0
                      ${app.status === 'Applied' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}
                    `}>
                      {app.status === 'Applied' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#333333] text-sm truncate max-w-[140px]">{app.job_title}</h4>
                      <p className="text-xs text-[#555555]">{app.company}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="outline" className={`text-[10px] ${
                      app.status === 'Applied' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-slate-50 text-slate-600'
                    }`}>
                      {app.status}
                    </Badge>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(app.applied_at || app.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AutoApplyPanel;