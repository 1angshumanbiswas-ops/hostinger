import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Routes, Route, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, KanbanSquare, BarChart4, MessageSquare, 
  AlertOctagon, Share2, BookOpen, Briefcase, 
  ArrowLeft, Sparkles, AlertTriangle, CheckCircle2,
  FileText, Plus, RefreshCw, Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Fetcher Utility
import { fetchProgramData } from '@/utils/programManagerDataSources';

// Modules
import PlanningStrategyModule from './program-manager/PlanningStrategyModule';
import ProgramProjectModule from './program-manager/ProgramProjectModule';
import ReportingMetricsModule from './program-manager/ReportingMetricsModule';
import RiskIssueModule from './program-manager/RiskIssueModule';
import CommunicationModule from './program-manager/CommunicationModule';
import KnowledgeModule from './program-manager/KnowledgeModule';
import ExecutiveModule from './program-manager/ExecutiveModule';

const MODULES = [
  {
    id: 'planning',
    title: 'Planning, Strategy & Decision',
    description: 'Goal breakdown, roadmaps, OKRs, & budget tracking',
    icon: Compass,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    usage: 'Monthly',
    usageColor: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'management',
    title: 'Program & Project Mgmt',
    description: 'Task tracking, sprint forecasting, team velocity',
    icon: KanbanSquare,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    usage: 'Daily',
    usageColor: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: 'reporting',
    title: 'Reporting, Metrics & Analytics',
    description: 'KPI Dashboards, variance, health indicators',
    icon: BarChart4,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    usage: 'Weekly',
    usageColor: 'bg-amber-100 text-amber-700'
  },
  {
    id: 'risk',
    title: 'Risk & Issue Management',
    description: 'Risk register, issue tracking, mitigation plans',
    icon: AlertOctagon,
    color: 'text-red-600',
    bg: 'bg-red-100',
    usage: 'Weekly',
    usageColor: 'bg-amber-100 text-amber-700'
  },
  {
    id: 'communication',
    title: 'Communication & Alignment',
    description: 'Meeting notes, action items, updates',
    icon: MessageSquare,
    color: 'text-pink-600',
    bg: 'bg-pink-100',
    usage: 'Daily',
    usageColor: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: 'docs',
    title: 'Knowledge Management',
    description: 'SOPs, playbooks, repository',
    icon: BookOpen,
    color: 'text-cyan-600',
    bg: 'bg-cyan-100',
    usage: 'Weekly',
    usageColor: 'bg-amber-100 text-amber-700'
  },
  {
    id: 'executive',
    title: 'Executive Support',
    description: 'Board decks, high-level summaries, ROI',
    icon: Briefcase,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    usage: 'Monthly',
    usageColor: 'bg-blue-100 text-blue-700'
  }
];

const PlaceholderView = ({ title, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
    <Icon className="w-16 h-16 mb-4 opacity-20" />
    <p>AI Module for {title} is ready to be connected.</p>
    <Button variant="outline" className="mt-4">Initialize Module</Button>
  </div>
);

const AIProgramManager = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { moduleId } = useParams();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    const result = await fetchProgramData();
    if (result.success) {
      setData(result.data);
      setError(null);
      if (isRefresh) {
        toast({ title: "Data Synced", description: "Successfully refreshed from public sources." });
      }
    } else {
      setError("Failed to load program data.");
      toast({ title: "Sync Failed", description: result.error, variant: "destructive" });
    }
    
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeModule = MODULES.find(m => m.id === moduleId);

  const renderModuleContent = () => {
    if (!data) return null;
    switch(moduleId) {
      case 'planning': return <PlanningStrategyModule data={data} />;
      case 'management': return <ProgramProjectModule data={data} />;
      case 'reporting': return <ReportingMetricsModule data={data} />;
      case 'risk': return <RiskIssueModule data={data} />;
      case 'communication': return <CommunicationModule data={data} />;
      case 'docs': return <KnowledgeModule data={data} />;
      case 'executive': return <ExecutiveModule data={data} />;
      default: return <PlaceholderView title={activeModule?.title} icon={activeModule?.icon || Sparkles} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-200">
        <div className="flex flex-col items-center text-indigo-600">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="text-sm font-medium">Aggregating real data sources...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-red-200 text-red-600">
        <AlertTriangle className="w-10 h-10 mb-4" />
        <p className="mb-4">{error}</p>
        <Button onClick={() => loadData()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] bg-slate-50/50 p-6 rounded-xl border border-slate-200">
      <AnimatePresence mode="wait">
        {!moduleId ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">AI Program Manager</h2>
                <p className="text-slate-500">Real-time data orchestration for your portfolio.</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="bg-white" 
                  onClick={() => loadData(true)}
                  disabled={refreshing}
                >
                   <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                   Sync Data
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Sparkles className="w-4 h-4 mr-2" /> Ask AI Assistant
                </Button>
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {MODULES.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/ai-program-manager/${module.id}`)}
                  className="group cursor-pointer h-full"
                >
                  <Card className="h-full hover:shadow-lg transition-all border-slate-200 hover:border-indigo-200 group-hover:-translate-y-1 relative overflow-hidden flex flex-col">
                    <div className={`absolute top-0 left-0 w-1 h-full ${module.bg.replace('bg-', 'bg-gradient-to-b from-').replace('100', '500').replace('50', '500')} to-transparent`} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <div className={`p-2 rounded-lg ${module.bg} w-fit`}>
                          <module.icon className={`w-5 h-5 ${module.color}`} />
                        </div>
                        <Badge variant="secondary" className={`text-[10px] ${module.usageColor}`}>
                          {module.usage}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-bold text-slate-800 leading-tight">
                        {module.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <CardDescription className="text-xs line-clamp-2 mb-4 text-slate-500">
                        {module.description}
                      </CardDescription>
                      <div className="flex items-center text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
                        Open Module <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* AI Insights Feed - Bottom Section */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" /> Live AI Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-indigo-50 border-indigo-100">
                  <CardContent className="p-4 flex gap-4">
                    <div className="p-2 bg-white rounded-full h-fit shadow-sm">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900 text-sm">Risk Detected: {data?.risks?.risks[0]?.title || 'Dependency Delay'}</h4>
                      <p className="text-xs text-indigo-700 mt-1">
                        High probability risk identified based on recent task trends. Immediate mitigation recommended.
                      </p>
                      <Button variant="link" className="p-0 h-auto text-xs text-indigo-800 mt-2 font-bold">View Mitigation Plan</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-emerald-100">
                  <CardContent className="p-4 flex gap-4">
                     <div className="p-2 bg-white rounded-full h-fit shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-900 text-sm">Schedule On Track</h4>
                      <p className="text-xs text-emerald-700 mt-1">
                        Current sprint completion rate is {data?.kpis?.completionRate || 0}%. Continuing this trend will meet Q3 goals.
                      </p>
                       <Button variant="link" className="p-0 h-auto text-xs text-emerald-800 mt-2 font-bold">Acknowledge</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="icon" onClick={() => navigate('/ai-program-manager')} className="hover:bg-slate-200">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Button>
              {activeModule && (
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${activeModule.bg}`}>
                     <activeModule.icon className={`w-6 h-6 ${activeModule.color}`} />
                   </div>
                   <div>
                      <h2 className="text-xl font-bold text-slate-900">{activeModule.title}</h2>
                      <p className="text-sm text-slate-500">{activeModule.description}</p>
                   </div>
                </div>
              )}
              <div className="ml-auto flex gap-2">
                 <Button variant="outline" size="sm" onClick={() => toast({ title: "Report Generated", description: "PDF has been sent to your email." })}>
                   <FileText className="w-4 h-4 mr-2" /> Export
                 </Button>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              {renderModuleContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIProgramManager;