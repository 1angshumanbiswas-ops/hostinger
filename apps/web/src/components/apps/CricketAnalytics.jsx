import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  Activity, 
  Target, 
  Brain,
  ChevronRight,
  BarChart3,
  Award,
  Zap,
  MapPin,
  ListOrdered,
  TrendingDown,
  Minus,
  Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock Data for Players - Top 10 Squad Selection
const PLAYERS = [
  {
    id: 'p1',
    name: 'Shubman Gill',
    role: 'Opener',
    team: 'India',
    avatar: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&q=80&w=200&h=200',
    stats: {
      matches: 44,
      runs: 2271,
      average: 61.37,
      strikeRate: 102.84,
      centuries: 6
    },
    recentForm: [85, 12, 104, 34, 58, 76, 23, 89, 12, 45],
    aiAnalysis: {
      strength: 'Exceptional timing against pace',
      weakness: 'Vulnerable to moving ball early on',
      prediction: 'High probability of scoring 50+ in next match (78%)',
      matchup: 'Strong vs Left-arm Spin'
    }
  },
  {
    id: 'p2',
    name: 'Heinrich Klaasen',
    role: 'Wicketkeeper Batter',
    team: 'South Africa',
    avatar: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=200&h=200',
    stats: {
      matches: 54,
      runs: 1723,
      average: 40.06,
      strikeRate: 133.45,
      centuries: 4
    },
    recentForm: [174, 109, 45, 6, 82, 33, 98, 14, 120, 56],
    aiAnalysis: {
      strength: 'Devastating against spin',
      weakness: 'Short ball trap',
      prediction: 'Key impact player for death overs',
      matchup: 'Dominant vs Leg Spin'
    }
  },
  {
    id: 'p3',
    name: 'Travis Head',
    role: 'Opener',
    team: 'Australia',
    avatar: 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?auto=format&fit=crop&q=80&w=200&h=200',
    stats: {
      matches: 64,
      runs: 2393,
      average: 41.25,
      strikeRate: 112.33,
      centuries: 5
    },
    recentForm: [137, 62, 19, 109, 4, 88, 167, 12, 23, 45],
    aiAnalysis: {
      strength: 'Aggressive powerplay utilization',
      weakness: 'Spin on turning tracks',
      prediction: 'Ideal for chasing high totals',
      matchup: 'Weak vs Off Spin'
    }
  },
  {
    id: 'p4',
    name: 'Daryl Mitchell',
    role: 'Middle Order',
    team: 'New Zealand',
    avatar: 'https://images.unsplash.com/photo-1591118100954-46fb59c19385?auto=format&fit=crop&q=80&w=200&h=200',
    stats: {
      matches: 39,
      runs: 1577,
      average: 52.56,
      strikeRate: 98.20,
      centuries: 6
    },
    recentForm: [134, 29, 63, 17, 130, 45, 89, 12, 54, 76],
    aiAnalysis: {
      strength: 'Excellent rotation of strike',
      weakness: 'Early innings pace',
      prediction: 'Stabilizer for middle overs',
      matchup: 'Neutral vs All Types'
    }
  },
  {
    id: 'p5',
    name: 'Virat Kohli',
    role: 'Top Order',
    team: 'India',
    avatar: 'https://images.unsplash.com/photo-1554576307-353bb54b295d?auto=format&fit=crop&q=80&w=200&h=200',
    stats: {
      matches: 292,
      runs: 13848,
      average: 58.67,
      strikeRate: 93.62,
      centuries: 50
    },
    recentForm: [117, 54, 88, 101, 95, 76, 9, 85, 113, 4],
    aiAnalysis: {
      strength: 'Chase master & pacing innings',
      weakness: '4th-stump line balls',
      prediction: 'Anchor role with late acceleration',
      matchup: 'Dominant vs Pace'
    }
  },
  {
    id: 'p6',
    name: 'Rohit Sharma',
    role: 'Opener',
    team: 'India',
    avatar: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&q=80&w=200&h=200',
    stats: {
      matches: 262,
      runs: 10709,
      average: 49.12,
      strikeRate: 91.58,
      centuries: 31
    },
    recentForm: [47, 131, 87, 4, 40, 61, 8, 0, 12, 118],
    aiAnalysis: {
      strength: 'Pull shot & powerplay maximizing',
      weakness: 'Left-arm swing early on',
      prediction: 'Explosive start expected',
      matchup: 'Strong vs Short Pitch'
    }
  },
  {
    id: 'p7',
    name: 'Jos Buttler',
    role: 'Wicketkeeper Batter',
    team: 'England',
    avatar: 'https://images.unsplash.com/photo-1629255823521-1b6b553e1927?auto=format&fit=crop&q=80&w=200&h=200',
    stats: {
      matches: 181,
      runs: 5022,
      average: 40.50,
      strikeRate: 118.67,
      centuries: 11
    },
    recentForm: [6, 43, 20, 10, 8, 1, 58, 30, 89, 45],
    aiAnalysis: {
      strength: '360-degree shot making',
      weakness: 'Spin in middle overs',
      prediction: 'Potential game changer if set',
      matchup: 'Weak vs Leg Spin'
    }
  },
  {
    id: 'p8',
    name: 'David Warner',
    role: 'Opener',
    team: 'Australia',
    avatar: 'https://images.unsplash.com/photo-1628779238951-bd5c9584283f?auto=format&fit=crop&q=80&w=200&h=200',
    stats: {
      matches: 161,
      runs: 6932,
      average: 45.30,
      strikeRate: 97.26,
      centuries: 22
    },
    recentForm: [163, 104, 81, 15, 20, 11, 56, 18, 53, 29],
    aiAnalysis: {
      strength: 'Aggressive running & power',
      weakness: 'Right-arm round the wicket',
      prediction: 'Steady start with acceleration',
      matchup: 'Neutral vs Pace'
    }
  },
  {
    id: 'p9',
    name: 'Babar Azam',
    role: 'Top Order',
    team: 'Pakistan',
    avatar: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80&w=200&h=200',
    stats: {
      matches: 117,
      runs: 5729,
      average: 56.72,
      strikeRate: 88.75,
      centuries: 19
    },
    recentForm: [74, 50, 18, 9, 66, 80, 151, 60, 19, 5],
    aiAnalysis: {
      strength: 'Consistent cover drives',
      weakness: 'High pace bouncers',
      prediction: 'Sheet anchor role',
      matchup: 'Strong vs Spin'
    }
  },
  {
    id: 'p10',
    name: 'Nicholas Pooran',
    role: 'Wicketkeeper Batter',
    team: 'West Indies',
    avatar: 'https://images.unsplash.com/photo-1508802613176-2840a6112ba9?auto=format&fit=crop&q=80&w=200&h=200',
    stats: {
      matches: 61,
      runs: 1983,
      average: 38.88,
      strikeRate: 104.36,
      centuries: 3
    },
    recentForm: [45, 11, 23, 104, 3, 67, 12, 88, 39, 7],
    aiAnalysis: {
      strength: 'Explosive lofted shots',
      weakness: 'Inconsistency',
      prediction: 'High risk, high reward',
      matchup: 'Strong vs Off Spin'
    }
  }
];

// Complete Rankings Data for different formats
const RANKINGS_DATA = {
  t20i: [
    { rank: 1, name: "Travis Head", team: "Australia", rating: 881, trend: 'stable' },
    { rank: 2, name: "Suryakumar Yadav", team: "India", rating: 861, trend: 'stable' },
    { rank: 3, name: "Phil Salt", team: "England", rating: 802, trend: 'up' },
    { rank: 4, name: "Babar Azam", team: "Pakistan", rating: 761, trend: 'down' },
    { rank: 5, name: "Mohammad Rizwan", team: "Pakistan", rating: 755, trend: 'down' },
    { rank: 6, name: "Yashasvi Jaiswal", team: "India", rating: 714, trend: 'up' },
    { rank: 7, name: "Jos Buttler", team: "England", rating: 701, trend: 'up' },
    { rank: 8, name: "Rilee Rossouw", team: "South Africa", rating: 689, trend: 'down' },
    { rank: 9, name: "Reeza Hendricks", team: "South Africa", rating: 660, trend: 'stable' },
    { rank: 10, name: "Ruturaj Gaikwad", team: "India", rating: 657, trend: 'stable' },
  ],
  odi: [
    { rank: 1, name: "Babar Azam", team: "Pakistan", rating: 824, trend: 'stable' },
    { rank: 2, name: "Shubman Gill", team: "India", rating: 801, trend: 'stable' },
    { rank: 3, name: "Virat Kohli", team: "India", rating: 768, trend: 'stable' },
    { rank: 4, name: "Rohit Sharma", team: "India", rating: 746, trend: 'up' },
    { rank: 5, name: "Daryl Mitchell", team: "New Zealand", rating: 728, trend: 'up' },
    { rank: 6, name: "David Warner", team: "Australia", rating: 723, trend: 'down' },
    { rank: 7, name: "Harry Tector", team: "Ireland", rating: 721, trend: 'stable' },
    { rank: 8, name: "Dawid Malan", team: "England", rating: 707, trend: 'down' },
    { rank: 9, name: "Rassie van der Dussen", team: "South Africa", rating: 701, trend: 'down' },
    { rank: 10, name: "Heinrich Klaasen", team: "South Africa", rating: 697, trend: 'up' },
  ],
  test: [
    { rank: 1, name: "Kane Williamson", team: "New Zealand", rating: 883, trend: 'stable' },
    { rank: 2, name: "Joe Root", team: "England", rating: 866, trend: 'up' },
    { rank: 3, name: "Steve Smith", team: "Australia", rating: 810, trend: 'down' },
    { rank: 4, name: "Daryl Mitchell", team: "New Zealand", rating: 764, trend: 'up' },
    { rank: 5, name: "Babar Azam", team: "Pakistan", rating: 760, trend: 'down' },
    { rank: 6, name: "Usman Khawaja", team: "Australia", rating: 757, trend: 'down' },
    { rank: 7, name: "Dimuth Karunaratne", team: "Sri Lanka", rating: 750, trend: 'stable' },
    { rank: 8, name: "Virat Kohli", team: "India", rating: 737, trend: 'up' },
    { rank: 9, name: "Marnus Labuschagne", team: "Australia", rating: 731, trend: 'down' },
    { rank: 10, name: "Yashasvi Jaiswal", team: "India", rating: 727, trend: 'up' },
  ]
};

const StatCard = ({ label, value, icon: Icon, trend }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
                <Icon className="w-4 h-4 text-emerald-600" />
            </div>
            {trend && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {trend}
                </span>
            )}
        </div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</div>
    </div>
);

const AnalysisBox = ({ title, content, type }) => {
    const styles = {
        success: "bg-emerald-50 border-emerald-100 text-emerald-900",
        warning: "bg-amber-50 border-amber-100 text-amber-900",
        neutral: "bg-blue-50 border-blue-100 text-blue-900",
        purple: "bg-purple-50 border-purple-100 text-purple-900"
    };

    return (
        <div className={`p-4 rounded-lg border ${styles[type]} text-sm h-full`}>
            <span className="block font-bold mb-2 text-xs uppercase opacity-70 flex items-center gap-2">
                {type === 'success' && <Award className="w-4 h-4" />}
                {type === 'warning' && <Target className="w-4 h-4" />}
                {type === 'neutral' && <Brain className="w-4 h-4" />}
                {type === 'purple' && <Zap className="w-4 h-4" />}
                {title}
            </span>
            <p className="leading-relaxed font-medium">{content}</p>
        </div>
    );
};

const CricketAnalytics = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(PLAYERS[0]);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' or 'rankings'
  const [selectedRankingFormat, setSelectedRankingFormat] = useState('t20i');
  const [currentRankings, setCurrentRankings] = useState(RANKINGS_DATA.t20i);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);

  // Effect to simulate data fetching when format changes
  useEffect(() => {
    if (activeTab === 'rankings') {
      setIsLoadingRankings(true);
      // Simulate network delay for "fetching" experience
      const timer = setTimeout(() => {
        setCurrentRankings(RANKINGS_DATA[selectedRankingFormat]);
        setIsLoadingRankings(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [selectedRankingFormat, activeTab]);

  const getFormatLabel = (format) => {
    switch(format) {
      case 't20i': return 'T20I';
      case 'odi': return 'ODI';
      case 'test': return 'Test';
      default: return 'T20I';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-600 rounded-xl p-8 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity size={180} />
        </div>
        <div className="relative z-10">
          <Badge className="mb-4 bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-100 border-none">
             Live Analysis Engine
          </Badge>
          <h2 className="text-3xl font-bold mb-2">Player Performance Analytics</h2>
          <p className="text-emerald-100 max-w-xl text-lg">
            AI-driven insights for match selection, strategy optimization, and predictive performance modeling.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Player List Sidebar */}
        <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[600px] flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-600" />
                        Squad Selection (Top 10)
                    </h3>
                </div>
                <div className="p-2 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
                    {PLAYERS.map((player) => (
                        <motion.button
                            key={player.id}
                            whileHover={{ x: 4 }}
                            onClick={() => setSelectedPlayer(player)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all border ${
                                selectedPlayer.id === player.id 
                                ? 'bg-emerald-50 border-emerald-200 shadow-sm ring-1 ring-emerald-200' 
                                : 'hover:bg-slate-50 border-transparent hover:border-slate-100'
                            }`}
                        >
                            <img 
                                src={player.avatar} 
                                alt={player.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                            />
                            <div className="text-left flex-1 min-w-0">
                                <p className={`font-semibold truncate ${selectedPlayer.id === player.id ? 'text-emerald-900' : 'text-slate-900'}`}>
                                    {player.name}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{player.team} • {player.role}</p>
                            </div>
                            {selectedPlayer.id === player.id && (
                                <ChevronRight className="w-5 h-5 text-emerald-600 shrink-0" />
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>
            
            <div className="bg-blue-600 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
                 <div className="absolute top-0 right-0 opacity-10">
                    <Brain className="w-24 h-24 rotate-12" />
                 </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-5 h-5 text-blue-200" />
                        <h4 className="font-bold">AI Coach Insight</h4>
                    </div>
                    <p className="text-sm text-blue-50 leading-relaxed">
                        Based on current pitch conditions at Wankhede, <strong>{selectedPlayer.name}</strong> has a 15% higher batting average than the squad median. Recommended for the starting XI.
                    </p>
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* View Toggle Tabs */}
            <div className="bg-slate-100 p-1 rounded-lg inline-flex">
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'analysis' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Performance Analysis
              </button>
              <button 
                onClick={() => setActiveTab('rankings')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'rankings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Global Rankings
              </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'analysis' ? (
                  <motion.div
                      key="analysis"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                  >
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <StatCard 
                              label="Matches" 
                              value={selectedPlayer.stats.matches} 
                              icon={Trophy}
                              trend="+2"
                          />
                          <StatCard 
                              label="Batting Avg" 
                              value={selectedPlayer.stats.average} 
                              icon={Activity}
                              trend="+1.5%"
                          />
                          <StatCard 
                              label="Strike Rate" 
                              value={selectedPlayer.stats.strikeRate} 
                              icon={Zap}
                              trend="High"
                          />
                          <StatCard 
                              label="Centuries" 
                              value={selectedPlayer.stats.centuries} 
                              icon={Award}
                          />
                      </div>

                      {/* Performance Chart & AI Analysis */}
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                              <div>
                                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                                      Recent Form Analysis
                                  </h3>
                                  <p className="text-sm text-slate-500 mt-1">Last 10 Innings Performance</p>
                              </div>
                              <Badge variant="outline" className="w-fit text-emerald-700 bg-emerald-50 border-emerald-200 px-3 py-1">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                                  Currently In Form
                              </Badge>
                          </div>

                          {/* Improved CSS Bar Chart with 10 bars and Visible Labels */}
                          <div className="flex items-end justify-between h-64 gap-1 sm:gap-2 mb-8 px-2 border-b border-slate-100 pb-2 overflow-x-auto">
                              {selectedPlayer.recentForm.map((score, i) => (
                                  <div key={`score-${i}`} className="flex flex-col items-center justify-end h-full w-full gap-1 group min-w-[30px]">
                                      {/* Score Text - Always visible */}
                                      <motion.span 
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.5 + (i * 0.05) }}
                                          className="text-[10px] sm:text-xs font-bold text-slate-700"
                                      >
                                          {score}
                                      </motion.span>

                                      {/* Bar Container - Fixed relative height track */}
                                      <div className="w-full max-w-[30px] sm:max-w-[40px] bg-slate-50 rounded-t-lg h-[150px] relative flex items-end justify-center overflow-hidden"> 
                                          <motion.div 
                                              initial={{ height: 0 }}
                                              // Scaling based on max score of 200 for T20/ODI mix
                                              animate={{ height: `${Math.min((score / 200) * 100, 100)}%` }}
                                              transition={{ duration: 0.8, delay: i * 0.05, type: "spring", bounce: 0.2 }}
                                              className={`w-full ${
                                                  score >= 100 ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' : 
                                                  score >= 50 ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 
                                                  'bg-slate-300'
                                              } rounded-t-sm shadow-sm opacity-90 group-hover:opacity-100 transition-opacity`}
                                          />
                                      </div>
                                      
                                      <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 uppercase">Inning {i + 1}</span>
                                  </div>
                              ))}
                          </div>

                          <div className="space-y-4">
                              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-slate-400" />
                                  Strategic Overview
                              </h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                  <AnalysisBox 
                                      title="Key Strength" 
                                      content={selectedPlayer.aiAnalysis.strength}
                                      type="success"
                                  />
                                  <AnalysisBox 
                                      title="Area of Concern" 
                                      content={selectedPlayer.aiAnalysis.weakness}
                                      type="warning"
                                  />
                                  <AnalysisBox 
                                      title="Predictive Outcome" 
                                      content={selectedPlayer.aiAnalysis.prediction}
                                      type="neutral"
                                  />
                                  <AnalysisBox 
                                      title="Tactical Matchup" 
                                      content={selectedPlayer.aiAnalysis.matchup}
                                      type="purple"
                                  />
                              </div>
                          </div>
                      </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="rankings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]"
                  >
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <Globe className="w-6 h-6 text-blue-600" />
                          ICC Batting Rankings
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Real-time global player standings updated by AI</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                         <Badge variant="secondary" className="whitespace-nowrap">Latest Update</Badge>
                         <div className="w-48">
                            <Select 
                              value={selectedRankingFormat} 
                              onValueChange={setSelectedRankingFormat}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="t20i">T20I Rankings</SelectItem>
                                <SelectItem value="odi">ODI Rankings</SelectItem>
                                <SelectItem value="test">Test Rankings</SelectItem>
                              </SelectContent>
                            </Select>
                         </div>
                      </div>
                    </div>

                    <div className="relative">
                        {isLoadingRankings && (
                           <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm font-medium text-emerald-700">Fetching live data...</span>
                              </div>
                           </div>
                        )}
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                              <tr>
                                <th className="px-6 py-4 text-left">Rank</th>
                                <th className="px-6 py-4 text-left">Player</th>
                                <th className="px-6 py-4 text-left">Team</th>
                                <th className="px-6 py-4 text-right">Rating</th>
                                <th className="px-6 py-4 text-center">Trend</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {currentRankings.map((player) => (
                                <tr key={`${selectedRankingFormat}-${player.rank}`} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${player.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                      {player.rank}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                                    {player.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                    {player.team}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-slate-800">
                                    {player.rating}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap flex justify-center">
                                    {player.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                                    {player.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                                    {player.trend === 'stable' && <Minus className="w-4 h-4 text-slate-400" />}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CricketAnalytics;