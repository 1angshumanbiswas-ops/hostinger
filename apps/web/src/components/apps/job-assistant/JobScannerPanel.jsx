import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, RefreshCw, Loader2, CheckCircle2, Play, MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const JobScannerPanel = ({ scanStatus, onRunScan, scannedCount, scannedJobs }) => {
  return (
    <Card className="h-full border-[#E0E0D8] bg-white shadow-sm flex flex-col relative overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-[#F5F3F0] pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
              scanStatus === 'scanning' ? 'bg-blue-100 text-blue-600' : 
              scanStatus === 'completed' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
            }`}>
              {scanStatus === 'scanning' ? <Loader2 className="w-5 h-5 animate-spin" /> : 
               scanStatus === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
               <ScanLine className="w-5 h-5" />}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#333333]">Job Scanner</CardTitle>
              <div className="flex items-center gap-2 text-xs text-[#555555]">
                <Badge variant="outline" className={`
                  ${scanStatus === 'idle' ? 'border-slate-300 text-slate-500' : ''}
                  ${scanStatus === 'scanning' ? 'border-blue-200 text-blue-600 bg-blue-50' : ''}
                  ${scanStatus === 'completed' ? 'border-green-200 text-green-600 bg-green-50' : ''}
                `}>
                  {scanStatus === 'idle' && 'Ready to Scan'}
                  {scanStatus === 'scanning' && 'Scanning Sources...'}
                  {scanStatus === 'completed' && 'Scan Complete'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#333333]">{scannedCount}</span>
            <p className="text-[10px] text-[#555555] uppercase tracking-wider">Jobs Found</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 relative flex flex-col">
        {/* Main Action Area */}
        <div className="flex-1 relative">
            {scanStatus === 'idle' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 z-10 p-6 text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                              size="lg"
                              onClick={onRunScan}
                              className="w-full max-w-[200px] h-14 bg-[#2D7A4A] hover:bg-[#23633b] text-white shadow-lg hover:shadow-xl transition-all rounded-xl text-lg font-semibold group"
                          >
                              <Play className="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" />
                              Run Scan
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fetch latest jobs from external sources</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <p className="mt-4 text-sm text-[#555555]">Click to start searching specifically for roles matching your profile.</p>
                </div>
            ) : null}

            {scanStatus === 'scanning' ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20">
                  <Loader2 className="w-12 h-12 text-[#2D7A4A] animate-spin mb-4" />
                  <h3 className="text-lg font-bold text-[#2D7A4A]">Scanning Job Boards...</h3>
                  <p className="text-sm text-[#555555]">Aggregating data from multiple sources</p>
               </div>
            ) : null}

            <ScrollArea className="h-full w-full p-4">
              <AnimatePresence mode="popLayout">
                {scannedJobs.length === 0 && scanStatus !== 'scanning' && scanStatus !== 'idle' ? (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-400 space-y-2">
                     <ScanLine className="w-8 h-8 opacity-20" />
                     <p className="text-sm">No jobs found. Try running scan again.</p>
                  </div>
                ) : (
                  scannedJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="mb-3 p-3 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 transition-colors shadow-sm group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-[#333333] text-sm truncate pr-2 group-hover:text-[#2D7A4A] transition-colors">{job.title}</h4>
                        <Badge variant="secondary" className="text-[10px] h-5 bg-slate-100 text-slate-600">{job.source}</Badge>
                      </div>
                      <p className="text-xs text-[#555555] font-medium mb-2">{job.company}</p>
                      
                      <div className="flex items-center gap-3 text-[11px] text-[#777777]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> {job.type}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </ScrollArea>
        </div>

        {/* Footer Actions if needed */}
        {scanStatus === 'completed' && (
           <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRunScan}
                className="text-[#2D7A4A] border-[#2D7A4A] hover:bg-[#E8F5E9]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Rescan
              </Button>
           </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobScannerPanel;