import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, Calendar, ArrowUp, ArrowDown, User, Moon, Footprints, AlertTriangle, Droplets } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Fallback data in case DB is empty
const FALLBACK_STATS = [
  { id: 1, metric_name: 'Heart Rate', value: '72 bpm', change_percentage: -2, icon: Heart, color: 'text-red-500' },
  { id: 2, metric_name: 'Blood Pressure', value: '120/80', change_percentage: 0, icon: Activity, color: 'text-blue-500' },
  { id: 3, metric_name: 'Sleep Duration', value: '7h 20m', change_percentage: 5, icon: Moon, color: 'text-indigo-500' },
  { id: 4, metric_name: 'Daily Steps', value: '8,432', change_percentage: 12, icon: Footprints, color: 'text-emerald-500' },
];

const FALLBACK_ALERTS = [
  { id: 1, message: 'Elevated resting heart rate detected yesterday.', severity: 'medium', time: '2 hours ago' },
  { id: 2, message: 'Hydration goal (2.5L) not met for 2 consecutive days.', severity: 'low', time: '5 hours ago' },
];

const FALLBACK_APPOINTMENTS = [
  { id: 1, doctor_name: 'Dr. Sarah Smith', specialty: 'Cardiologist', appointment_date: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'Confirmed' },
  { id: 2, doctor_name: 'Dr. James Wilson', specialty: 'General Practice', appointment_date: new Date(Date.now() + 86400000 * 14).toISOString(), status: 'Pending' },
];

const HealthMonitor = () => {
  const [stats, setStats] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: statsData } = await supabase.from('app_health_stats').select('*');
        // Using fallback tables if real ones don't exist yet to ensure a great UI
        
        if (statsData && statsData.length > 0) {
          setStats(statsData);
        } else {
          setStats(FALLBACK_STATS);
        }
        
        setAppointments(FALLBACK_APPOINTMENTS);
        setAlerts(FALLBACK_ALERTS);
      } catch (error) {
        console.error('Error fetching health data:', error);
        setStats(FALLBACK_STATS);
        setAppointments(FALLBACK_APPOINTMENTS);
        setAlerts(FALLBACK_ALERTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500" />
            Health & Wellness Monitor
          </h2>
          <p className="text-slate-500 mt-1">Track your vitals, activities, and medical appointments.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Activity className="w-4 h-4 mr-2" /> Log Vitals
        </Button>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))
        ) : (
          stats.map((stat, i) => {
            const Icon = stat.icon || (stat.metric_name?.includes('Heart') ? Heart : Activity);
            const colorClass = stat.color || 'text-emerald-500';
            
            return (
              <motion.div
                key={stat.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.metric_name}</span>
                  <div className={`p-2 rounded-lg bg-slate-50 group-hover:scale-110 transition-transform ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</h3>
                <div className={`flex items-center text-sm font-medium ${
                  (stat.change_percentage || 0) >= 0 ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {(stat.change_percentage || 0) >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {Math.abs(stat.change_percentage || 0)}% from last week
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Data Visualization (Simulated) */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Activity Tracking (Weekly)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-end justify-between gap-2">
              {/* Simulated Bar Chart */}
              {[40, 70, 45, 90, 65, 80, 55].map((height, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-2 group">
                  <div className="w-full bg-slate-100 rounded-t-md h-full relative flex items-end overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`w-full rounded-t-md ${height > 70 ? 'bg-emerald-400' : 'bg-blue-400'} group-hover:brightness-110 transition-all`}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-400 uppercase">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Health Profile & Alerts */}
        <div className="space-y-8">
          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" /> Health Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                  JD
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">John Doe</h4>
                  <p className="text-sm text-slate-500">ID: #8492-MED</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-slate-500 mb-1">Age / Sex</p>
                  <p className="font-bold text-slate-900">32 / Male</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-slate-500 mb-1">Blood Type</p>
                  <p className="font-bold text-red-600 flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> O+
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-slate-500 mb-1">Height</p>
                  <p className="font-bold text-slate-900">182 cm</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-slate-500 mb-1">Weight</p>
                  <p className="font-bold text-slate-900">78 kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-amber-50 border-b border-amber-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Health Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex gap-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${alert.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      <div>
                        <p className="text-sm font-medium text-slate-800 leading-snug">{alert.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Appointments List */}
      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" /> Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No upcoming appointments scheduled.</div>
            ) : (
              appointments.map((apt) => (
                <div key={apt.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{apt.doctor_name}</p>
                      <p className="text-sm text-purple-600 font-medium">{apt.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 sm:justify-end">
                    <div className="flex flex-col sm:items-end">
                      <div className="flex items-center text-sm font-semibold text-slate-700 mb-1">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {new Date(apt.appointment_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                      </div>
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${
                        apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">Reschedule</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthMonitor;