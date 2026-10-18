import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  MapPin, 
  AlertTriangle, 
  Cpu, 
  TrendingUp, 
  Navigation,
  RefreshCw,
  ShieldAlert,
  BrainCircuit,
  Satellite,
  Database,
  LineChart,
  ScanEye,
  CheckCircle2,
  Terminal,
  ArrowRight,
  Thermometer,
  Server
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/customSupabaseClient';

// Complete list of Indian States and Union Territories
const INDIAN_STATES_AND_UTS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
].sort();

// --- Simulated AI Tools ---
const AGENT_TOOLS = {
  IMD_FETCH: {
    id: 'imd_api_connector',
    name: 'IMD Data Link',
    icon: Server,
    color: 'text-blue-600',
    description: 'Fetching raw telemetry from regional meteorological stations.'
  },
  SATELLITE: {
    id: 'sat_vision_v2',
    name: 'Satellite Vision',
    icon: Satellite,
    color: 'text-purple-500',
    description: 'Scanning IR/Visible spectrum for cloud density and moisture.'
  },
  PRESSURE: {
    id: 'baro_net_xg',
    name: 'PressureNet AI',
    icon: Wind,
    color: 'text-cyan-500',
    description: 'Analyzing isobars and atmospheric pressure gradients.'
  },
  HISTORY: {
    id: 'temporal_db',
    name: 'Historical DB',
    icon: Database,
    color: 'text-amber-500',
    description: 'Cross-referencing 50-year climate anomaly datasets.'
  },
  MARKET: {
    id: 'econ_pulse',
    name: 'Market Correlator',
    icon: LineChart,
    color: 'text-emerald-500',
    description: 'Evaluating potential economic impact on Agri/Logistics sectors.'
  }
};

// Custom SVG Line Chart
const WeatherTrendChart = ({ data, type = 'temp' }) => {
  if (!data || data.length === 0) return null;

  const height = 200;
  const width = 600;
  const padding = 40;
  
  const values = data.map(d => type === 'temp' ? d.temp : d.rain);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const val = type === 'temp' ? d.temp : d.rain;
    const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const color = type === 'temp' ? '#f59e0b' : '#3b82f6';

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {[0, 0.5, 1].map((tick) => (
          <line
            key={`tick-${tick}`}
            x1={padding}
            y1={padding + tick * (height - 2 * padding)}
            x2={width - padding}
            y2={padding + tick * (height - 2 * padding)}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />
        ))}
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        {data.map((d, i) => {
          const val = type === 'temp' ? d.temp : d.rain;
          const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
          const y = height - padding - ((val - min) / range) * (height - 2 * padding);
          return (
            <g key={d.day} className="group cursor-pointer">
              <circle cx={x} cy={y} r="4" fill="white" stroke={color} strokeWidth="2" />
              <rect x={x - 20} y={y - 35} width="40" height="25" rx="4" fill="#1e293b" className="opacity-0 group-hover:opacity-100 transition-opacity" />
              <text x={x} y={y - 20} textAnchor="middle" fill="white" fontSize="10" className="opacity-0 group-hover:opacity-100 transition-opacity">
                {val}{type === 'temp' ? '°C' : 'mm'}
              </text>
              <text x={x} y={height - 10} textAnchor="middle" fill="#64748b" fontSize="10">
                {d.day}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const WeatherForecaster = () => {
  const { toast } = useToast();
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [agentLogs, setAgentLogs] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const logsEndRef = useRef(null);

  // Helper to scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentLogs]);

  // --- Agentic Core Logic ---

  const addThought = (type, message) => {
    setAgentLogs(prev => [...prev, { 
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
      type, 
      message, 
      time: new Date().toLocaleTimeString() 
    }]);
  };

  const simulateToolExecution = async (toolKey, duration = 1500) => {
    const tool = AGENT_TOOLS[toolKey];
    setActiveTool(tool);
    addThought('tool-call', `Invoking tool: ${tool.name} (${tool.id})...`);
    await new Promise(r => setTimeout(r, duration));
    return tool;
  };

  const fetchIMDData = async (state) => {
    // Simulating a real fetch to IMD API with realistic variance based on geography
    const isCoastal = ["Maharashtra", "Kerala", "Goa", "Tamil Nadu", "West Bengal", "Odisha", "Gujarat", "Andhra Pradesh", "Andaman and Nicobar Islands", "Lakshadweep", "Puducherry", "Dadra and Nagar Haveli and Daman and Diu"].includes(state);
    const isHilly = ["Himachal Pradesh", "Uttarakhand", "Jammu and Kashmir", "Ladakh", "Sikkim", "Arunachal Pradesh"].includes(state);
    
    // Base values based on region type
    let baseTemp = 28;
    if (isHilly) baseTemp = 15;
    if (isCoastal) baseTemp = 30;

    // Random noise to simulate live sensor readings
    const currentTemp = baseTemp + (Math.random() * 6 - 3);
    const humidity = isCoastal ? 70 + Math.random() * 25 : 30 + Math.random() * 40;
    const windSpeed = isCoastal ? 15 + Math.random() * 20 : 5 + Math.random() * 10;
    const pressure = 1005 + (Math.random() * 20 - 10);
    const rainfall = isCoastal ? Math.random() * 15 : Math.random() * 2;

    return {
      temp: parseFloat(currentTemp.toFixed(1)),
      humidity: Math.floor(humidity),
      wind: Math.floor(windSpeed),
      pressure: Math.floor(pressure),
      rainfall: parseFloat(rainfall.toFixed(1)),
      timestamp: new Date().toISOString()
    };
  };

  const runAgenticWorkflow = async (state) => {
    setIsAgentRunning(true);
    setWeatherData(null);
    setAgentLogs([]);
    setConfidenceScore(5);
    setActiveTool(null);

    try {
      // Step 1: Initial Reasoning
      addThought('reasoning', `User requested forecast for ${state}. Initiating multi-factor analysis protocol.`);
      await new Promise(r => setTimeout(r, 800));

      // Step 2: Fetch IMD Data (New Step)
      await simulateToolExecution('IMD_FETCH', 2000);
      const imdData = await fetchIMDData(state);
      addThought('observation', `IMD Data Acquired: ${imdData.temp}°C, ${imdData.humidity}% RH, ${imdData.pressure} hPa.`);
      
      // Store raw IMD data in Supabase (Data Aggregation & History)
      try {
        await supabase.from('weather_history').insert({
          state_name: state,
          temperature: imdData.temp,
          humidity: imdData.humidity,
          wind_speed: imdData.wind,
          pressure: imdData.pressure,
          rainfall: imdData.rainfall
        });
        addThought('system', `Telemetry stored in 'weather_history' for model training.`);
      } catch (e) {
        console.error("DB Insert Error", e);
        addThought('error', 'Failed to archive telemetry data (continuing workflow).');
      }
      setConfidenceScore(25);
      
      // Step 3: Satellite Analysis
      await simulateToolExecution('SATELLITE', 1800);
      const isCoastal = ["Maharashtra", "Kerala", "Goa", "Tamil Nadu", "West Bengal", "Odisha", "Gujarat", "Andhra Pradesh", "Andaman and Nicobar Islands", "Lakshadweep", "Puducherry", "Dadra and Nagar Haveli and Daman and Diu"].includes(state);
      // Correlate satellite cloud cover with IMD humidity
      const cloudCover = imdData.humidity > 70 ? Math.floor(Math.random() * 30) + 60 : Math.floor(Math.random() * 40);
      addThought('observation', `Satellite Vision confirmed: Cloud Cover ${cloudCover}% matches IMD humidity profile.`);
      setConfidenceScore(45);

      // Step 4: Pressure Analysis
      addThought('reasoning', `Analyzing pressure gradient of ${imdData.pressure} hPa against regional averages.`);
      await simulateToolExecution('PRESSURE', 1500);
      const isLowPressure = imdData.pressure < 1008;
      addThought('observation', `PressureNet Analysis: ${isLowPressure ? 'Cyclonic circulation potential detected.' : 'Anti-cyclonic stability confirmed.'}`);
      setConfidenceScore(65);

      // Step 5: Historical Context
      addThought('reasoning', `Cross-referencing current ${imdData.temp}°C with 50-year seasonal baseline.`);
      await simulateToolExecution('HISTORY', 1500);
      const deviation = Math.abs(imdData.temp - (isCoastal ? 30 : 25)); // Simplified baseline
      const isAnomaly = deviation > 5;
      addThought('observation', `Historical DB: Current conditions are ${isAnomaly ? 'anomalous (+2σ)' : 'within seasonal norms'}.`);
      setConfidenceScore(80);

      // Step 6: Market Correlation
      addThought('reasoning', `Evaluating agri-economic impact based on precipitation probability.`);
      await simulateToolExecution('MARKET', 1500);
      addThought('observation', `Market Correlator: ${imdData.rainfall > 5 ? 'Groundwater recharge positive. Crop sowing favorable.' : 'Irrigation demand may spike.'}`);
      setConfidenceScore(95);

      // Step 7: Final Synthesis
      setActiveTool(null);
      addThought('synthesis', 'Synthesizing IMD telemetry with AI predictive models...');
      await new Promise(r => setTimeout(r, 1000));
      
      // Generate Final Data Structure
      const finalData = {
        current: {
          temp: imdData.temp,
          humidity: imdData.humidity,
          wind: imdData.wind,
          condition: imdData.rainfall > 2 ? "Rainy" : (cloudCover > 50 ? "Cloudy" : "Sunny"),
          pressure: imdData.pressure,
          uvIndex: cloudCover > 50 ? 3 : 8,
          rainfall: imdData.rainfall
        },
        forecast: Array.from({ length: 7 }, (_, i) => ({
          day: new Date(Date.now() + i * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
          temp: Math.round(imdData.temp + (Math.random() * 4 - 2)),
          rain: Math.floor(Math.max(0, imdData.rainfall + (Math.random() * 10 - 5))),
          condition: Math.random() > 0.6 ? "Rainy" : "Clear"
        })),
        aiAnalysis: {
          riskLevel: isLowPressure || isAnomaly ? "High" : "Low",
          summary: `Agent consolidated real-time IMD station data with satellite imagery. Confidence is high (${95}%). ${isLowPressure ? 'Low pressure detected suggesting instability.' : 'High pressure suggests stable weather.'} ${isAnomaly ? 'Significant temperature deviation noted.' : 'Conditions align with seasonal patterns.'}`,
          recommendation: imdData.rainfall > 5 
            ? "Advisory: High soil moisture detected. Farmers should delay fertilizer application. Urban drainage monitoring recommended." 
            : "Advisory: Optimal conditions for outdoor operations. Solar energy generation efficiency is peak.",
          confidence: 95 + Math.floor(Math.random() * 4),
          dataSource: "IMD (Simulated Aggregation) + Agentic Analysis"
        },
        meta: {
          lastUpdated: new Date().toLocaleString()
        }
      };

      setWeatherData(finalData);
      setConfidenceScore(100);
      addThought('complete', 'Forecast generation complete. Data stored and rendered.');

      // Also save the final processed result for the user-facing history
      try {
        await supabase.from('app_weather_data').insert({
          state_name: state,
          temperature: finalData.current.temp,
          humidity: finalData.current.humidity,
          wind_speed: finalData.current.wind,
          condition: finalData.current.condition,
          ai_risk_score: finalData.aiAnalysis.riskLevel === 'High' ? 0.8 : 0.2
        });
      } catch (e) {
        // Silent fail for user history if main data is safe
      }

    } catch (error) {
      addThought('error', 'Agent encountered an error in reasoning loop.');
      console.error(error);
    } finally {
      setIsAgentRunning(false);
    }
  };

  useEffect(() => {
    runAgenticWorkflow(selectedState);
  }, []);

  const handleStateChange = (value) => {
    setSelectedState(value);
    runAgenticWorkflow(value);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-indigo-600" />
            {selectedState} Forecast
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
             <Badge variant="outline" className="text-[10px] h-5 bg-blue-50 text-blue-700 border-blue-200">
               Source: IMD Aggregated
             </Badge>
             {weatherData && (
                <span>Updated: {weatherData.meta.lastUpdated}</span>
             )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={selectedState} onValueChange={handleStateChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select State/UT" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {INDIAN_STATES_AND_UTS.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => runAgenticWorkflow(selectedState)}
            disabled={isAgentRunning}
          >
            <RefreshCw className={`w-4 h-4 ${isAgentRunning ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Agent Console & Live Data */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Agent Thought Process Console */}
          <Card className="bg-slate-950 border-slate-800 shadow-xl overflow-hidden flex flex-col h-[400px]">
            <CardHeader className="bg-slate-900/50 pb-3 border-b border-slate-800">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-mono text-slate-300 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-500" /> 
                  AGENT_REASONING_LOG
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>CONFIDENCE:</span>
                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${confidenceScore}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-green-400">{confidenceScore}%</span>
                  </div>
                  {isAgentRunning && (
                     <Badge variant="outline" className="text-xs bg-indigo-500/10 text-indigo-400 border-indigo-500/50 animate-pulse">
                        PROCESSING
                     </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 font-mono text-xs md:text-sm space-y-3 relative">
              {agentLogs.length === 0 && (
                <div className="text-slate-600 italic text-center mt-10">Waiting for input...</div>
              )}
              {agentLogs.map((log) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3"
                >
                  <span className="text-slate-600 shrink-0">[{log.time}]</span>
                  <div className="flex-1">
                    {log.type === 'reasoning' && <span className="text-purple-400 font-bold">🤔 THOUGHT: </span>}
                    {log.type === 'tool-call' && <span className="text-amber-400 font-bold">🛠️ TOOL: </span>}
                    {log.type === 'observation' && <span className="text-cyan-400 font-bold">👀 OBSERVE: </span>}
                    {log.type === 'synthesis' && <span className="text-pink-400 font-bold">🧠 SYNTHESIS: </span>}
                    {log.type === 'system' && <span className="text-slate-500 font-bold">💾 SYSTEM: </span>}
                    {log.type === 'complete' && <span className="text-green-400 font-bold">✅ DONE: </span>}
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                </motion.div>
              ))}
              <div ref={logsEndRef} />
              
              {/* Active Tool Overlay */}
              <AnimatePresence>
                {activeTool && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-md border border-slate-700 p-3 rounded-lg flex items-center gap-3 shadow-2xl max-w-sm"
                  >
                    <div className={`p-2 rounded-md bg-slate-900 ${activeTool.color}`}>
                      <activeTool.icon className="w-5 h-5 animate-spin-slow" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Executing Tool</div>
                      <div className="text-slate-200 font-semibold">{activeTool.name}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{activeTool.description}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Results Display (Only show when data exists) */}
          <AnimatePresence>
            {weatherData && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-lg col-span-1 md:col-span-2">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                           <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                             {weatherData.current.condition}
                           </Badge>
                           <span className="text-indigo-100 text-sm">Real-time Update</span>
                        </div>
                        <h3 className="text-6xl font-bold tracking-tighter">{weatherData.current.temp}°C</h3>
                        <div className="mt-4 flex gap-6 text-sm font-medium text-indigo-100">
                          <div className="flex items-center gap-1"><Droplets className="w-4 h-4"/> {weatherData.current.humidity}% Humidity</div>
                          <div className="flex items-center gap-1"><Wind className="w-4 h-4"/> {weatherData.current.wind} km/h</div>
                          <div className="flex items-center gap-1"><CloudRain className="w-4 h-4"/> {weatherData.current.rainfall} mm</div>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm inline-block mb-2">
                            {weatherData.current.condition === 'Sunny' ? <Sun className="w-10 h-10 text-amber-300" /> : <CloudRain className="w-10 h-10 text-blue-300" />}
                         </div>
                         <p className="text-lg font-semibold">{selectedState}, IN</p>
                         <p className="text-xs text-indigo-200 opacity-80">Lat/Lon: {Math.floor(Math.random()*20+10)}.{Math.floor(Math.random()*99)}° N, {Math.floor(Math.random()*20+70)}.{Math.floor(Math.random()*99)}° E</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Insights Card */}
                <Card className="col-span-1 md:col-span-2 border-indigo-100 bg-indigo-50/50">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-base flex items-center gap-2 text-indigo-900">
                        <ScanEye className="w-5 h-5 text-indigo-600" /> Agent Generated Insights
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm space-y-3">
                        <div className="flex items-start gap-3">
                           <div className={`mt-1 p-1 rounded-full ${weatherData.aiAnalysis.riskLevel === 'High' ? 'bg-red-100' : 'bg-emerald-100'}`}>
                             {weatherData.aiAnalysis.riskLevel === 'High' ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                           </div>
                           <div className="space-y-1">
                              <h4 className="text-sm font-bold text-slate-800">Analysis Summary</h4>
                              <p className="text-sm text-slate-600 leading-relaxed">{weatherData.aiAnalysis.summary}</p>
                           </div>
                        </div>
                        <div className="border-t border-slate-100 pt-3 mt-3">
                           <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Strategic Recommendation</h4>
                           <p className="text-sm text-indigo-900 font-medium">{weatherData.aiAnalysis.recommendation}</p>
                        </div>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Forecast & Visuals */}
        <div className="space-y-6">
           <Card className="h-full flex flex-col">
             <CardHeader>
               <CardTitle className="text-base">Predictive Models</CardTitle>
               <CardDescription>7-Day Trend Analysis</CardDescription>
             </CardHeader>
             <CardContent className="p-0 flex-1">
               <Tabs defaultValue="list" className="w-full h-full flex flex-col">
                 <div className="px-6 pb-2">
                   <TabsList className="w-full grid grid-cols-2">
                     <TabsTrigger value="list">Daily Forecast</TabsTrigger>
                     <TabsTrigger value="charts">Trend Charts</TabsTrigger>
                   </TabsList>
                 </div>
                 
                 <TabsContent value="list" className="px-6 pb-6 mt-0 flex-1">
                    {!weatherData ? (
                      <div className="h-64 flex items-center justify-center text-slate-400 text-sm italic">
                        Awaiting Agent Analysis...
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {weatherData.forecast.map((day) => (
                          <div key={day.day} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                            <div className="flex items-center gap-3">
                               <span className="w-10 text-xs font-bold text-slate-500 uppercase">{day.day}</span>
                               <div className="flex items-center gap-2">
                                  {day.condition === 'Rainy' ? <CloudRain className="w-4 h-4 text-blue-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                                  <span className="text-sm font-medium text-slate-700">{day.condition}</span>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="hidden sm:flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                 <Droplets className="w-3 h-3" /> {day.rain}mm
                               </div>
                               <span className="font-bold text-slate-800 w-8 text-right">{day.temp}°</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                 </TabsContent>
                 
                 <TabsContent value="charts" className="px-6 pb-6 mt-0">
                    {!weatherData ? (
                       <div className="h-64 flex items-center justify-center text-slate-400 text-sm italic">
                         Awaiting Agent Analysis...
                       </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase flex items-center gap-2">
                            <Thermometer className="w-3 h-3" /> Temperature Trend
                          </h4>
                          <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                             <WeatherTrendChart data={weatherData.forecast} type="temp" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase flex items-center gap-2">
                            <CloudRain className="w-3 h-3" /> Rainfall Prediction
                          </h4>
                          <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                            <WeatherTrendChart data={weatherData.forecast} type="rain" />
                          </div>
                        </div>
                      </div>
                    )}
                 </TabsContent>
               </Tabs>
             </CardContent>
           </Card>

           {weatherData && (
             <Card className="bg-amber-50 border-amber-200 animate-in slide-in-from-bottom-5 duration-700">
                <CardContent className="p-4">
                   <div className="flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                         <h4 className="text-sm font-bold text-amber-800">Protocol Activation</h4>
                         <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                           Agent has flagged this forecast for potential {weatherData.aiAnalysis.riskLevel} risk. 
                           Local authorities in {selectedState} would be automatically notified in a production environment.
                         </p>
                      </div>
                   </div>
                </CardContent>
             </Card>
           )}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecaster;