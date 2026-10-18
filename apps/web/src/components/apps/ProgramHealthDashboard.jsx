import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Filter, 
  LayoutGrid, 
  List, 
  MoreHorizontal, 
  PieChart, 
  Plus, 
  Search, 
  Settings, 
  Share2, 
  TrendingUp, 
  Users 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

// Mock Data
const PROJECTS = [
  {
    id: 'PRJ-001',
    name: 'Cloud Migration Phase 2',
    manager: 'Sarah Chen',
    status: 'On Track',
    statusColor: 'bg-emerald-500',
    progress: 78,
    dueDate: 'Oct 15, 2024',
    budget: '$1.2M',
    budgetUsed: 65,
    risks: 2,
    team: ['SC', 'JD', 'AL', '+4']
  },
  {
    id: 'PRJ-002',
    name: 'Mobile App Redesign',
    manager: 'Mike Ross',
    status: 'At Risk',
    statusColor: 'bg-amber-500',
    progress: 45,
    dueDate: 'Nov 01, 2024',
    budget: '$450K',
    budgetUsed: 52,
    risks: 5,
    team: ['MR', 'DK', '+2']
  },
  {
    id: 'PRJ-003',
    name: 'Data Warehouse Integration',
    manager: 'Alex Lee',
    status: 'Critical',
    statusColor: 'bg-red-500',
    progress: 30,
    dueDate: 'Sep 30, 2024',
    budget: '$800K',
    budgetUsed: 85,
    risks: 8,
    team: ['AL', 'SJ', 'RK', '+5']
  },
  {
    id: 'PRJ-004',
    name: 'AI Customer Support Bot',
    manager: 'Emily Wong',
    status: 'On Track',
    statusColor: 'bg-emerald-500',
    progress: 15,
    dueDate: 'Dec 20, 2024',
    budget: '$300K',
    budgetUsed: 10,
    risks: 0,
    team: ['EW', 'TB']
  }
];

// Interactive Chart Component
const HealthTrendChart = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const data = [
    { month: 'May', score: 85, status: 'Healthy', color: '#10b981' },
    { month: 'Jun', score: 88, status: 'Healthy', color: '#10b981' },
    { month: 'Jul', score: 72, status: 'At Risk', color: '#f59e0b' },
    { month: 'Aug', score: 65, status: 'Critical', color: '#ef4444' },
    { month: 'Sep', score: 78, status: 'Recovering', color: '#f59e0b' },
    { month: 'Oct', score: 92, status: 'Healthy', color: '#10b981' },
  ];

  // Chart dimensions
  const height = 200;
  const width = 600;
  const padding = 40;
  
  // Scales
  const xScale = (index) => padding + (index * (width - 2 * padding)) / (data.length - 1);
  const yScale = (score) => height - padding - ((score / 100) * (height - 2 * padding));

  // Generate path
  const pathData = data.reduce((path, point, index) => {
    const x = xScale(index);
    const y = yScale(point.score);
    return index === 0 ? `M ${x},${y}` : `${path} L ${x},${y}`;
  }, '');

  return (
    <div className="w-full h-[250px] relative flex flex-col items-center justify-center">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((tick) => (
          <line
            key={tick}
            x1={padding}
            y1={yScale(tick)}
            x2={width - padding}
            y2={yScale(tick)}
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Y-axis labels */}
        {[0, 50, 100].map((tick) => (
          <text
            key={tick}
            x={padding - 10}
            y={yScale(tick)}
            className="text-[10px] fill-slate-400"
            textAnchor="end"
            alignmentBaseline="middle"
          >
            {tick}%
          </text>
        ))}

        {/* Gradient Area */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
          fill="url(#chartGradient)"
        />

        {/* Line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Data Points */}
        {data.map((point, index) => (
          <g 
            key={index} 
            onMouseEnter={() => setHoveredPoint({ ...point, x: xScale(index), y: yScale(point.score) })}
            onMouseLeave={() => setHoveredPoint(null)}
            className="cursor-pointer group"
          >
            <circle
              cx={xScale(index)}
              cy={yScale(point.score)}
              r="6"
              fill="white"
              stroke={point.color}
              strokeWidth="3"
              className="transition-all duration-200 group-hover:r-8"
            />
            {/* X-axis labels */}
            <text
              x={xScale(index)}
              y={height - padding + 20}
              className={`text-[10px] font-medium transition-colors ${hoveredPoint?.month === point.month ? 'fill-slate-900 font-bold' : 'fill-slate-500'}`}
              textAnchor="middle"
            >
              {point.month}
            </text>
          </g>
        ))}
      </svg>

      {/* Interactive Tooltip */}
      <AnimatePresence>
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bg-slate-900 text-white p-3 rounded-lg shadow-xl pointer-events-none z-10 min-w-[120px]"
            style={{ 
              left: `${(hoveredPoint.x / width) * 100}%`, 
              top: `${(hoveredPoint.y / height) * 100}%`,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-300">{hoveredPoint.month} Status</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{hoveredPoint.score}%</span>
                <span 
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: hoveredPoint.color, color: 'white' }}
                >
                  {hoveredPoint.status}
                </span>
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProgramHealthDashboard = () => {
  const { toast } = useToast();
  const [view, setView] = useState('list');

  const showFeatureToast = (feature) => {
    toast({
      title: "Coming Soon",
      description: `The ${feature} feature is currently under development.`,
    });
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Program Health</h1>
          <p className="text-slate-500">Real-time portfolio insights and risk tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white" onClick={() => showFeatureToast('Export Report')}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => showFeatureToast('New Project Wizard')}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Overall Health</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">88%</h3>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +4% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Risks</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">12</h3>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-amber-600 font-medium">
              3 critical requiring attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Budget Usage</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">64%</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <PieChart className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-slate-500">
              <Progress value={64} className="h-1.5 w-24 mr-2" />
              On track
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Team Capacity</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">92%</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-purple-600 font-medium">
              High utilization warning
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section - REPLACED PLACEHOLDER */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Health Trend Analysis</CardTitle>
              <CardDescription>6-month project health trajectory</CardDescription>
            </CardHeader>
            <CardContent>
              <HealthTrendChart />
            </CardContent>
          </Card>

          {/* Projects List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Active Projects</CardTitle>
                <CardDescription>Portfolio status breakdown</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search projects..." 
                    className="pl-9 h-9 w-40 md:w-64 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => setView(view === 'list' ? 'grid' : 'list')}>
                  {view === 'list' ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PROJECTS.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-lg hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className={`w-2 h-12 rounded-full ${project.statusColor}`} />
                      <div>
                        <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{project.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {project.manager}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due {project.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                      </div>
                      
                      <div className="text-right">
                        <Badge variant="secondary" className={`${
                          project.status === 'On Track' ? 'bg-emerald-100 text-emerald-700' :
                          project.status === 'At Risk' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {project.status}
                        </Badge>
                      </div>
                      
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Technical Debt', count: 8, color: 'bg-red-500' },
                  { label: 'Resource Shortage', count: 5, color: 'bg-amber-500' },
                  { label: 'Scope Creep', count: 3, color: 'bg-blue-500' },
                  { label: 'External Vendor', count: 2, color: 'bg-purple-500' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-slate-600">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: 'Sarah Chen', action: 'updated status', target: 'Cloud Mig.', time: '2h ago' },
                  { user: 'Mike Ross', action: 'flagged risk', target: 'Mobile App', time: '4h ago' },
                  { user: 'Alex Lee', action: 'completed milestone', target: 'Data Whse', time: '1d ago' }
                ].map((activity, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="text-sm">
                      <p className="text-slate-900">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-slate-500">{activity.target} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <h4 className="font-semibold text-indigo-900 flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4" /> AI Recommendation
            </h4>
            <p className="text-xs text-indigo-700 leading-relaxed mb-3">
              Based on velocity trends, Project Alpha is likely to miss the Q3 deadline. Consider reallocating 2 backend resources from Project Beta.
            </p>
            <Button size="sm" variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-100 bg-white">
              View Detailed Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramHealthDashboard;