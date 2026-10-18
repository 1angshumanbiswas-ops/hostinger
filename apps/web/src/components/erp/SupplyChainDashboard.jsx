import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, Package, AlertTriangle, MapPin, CloudSun, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

import { fetchAllWeather } from '@/utils/WeatherAPI';
import { useRefresh } from '@/contexts/RefreshContext';

const SupplyChainDashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { registerCallback, unregisterCallback } = useRefresh();

  const loadWeather = useCallback(async () => {
    setLoading(true);
    return fetchAllWeather().then(res => {
      setWeatherData(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadWeather();
    registerCallback('supply_chain', loadWeather);
    return () => unregisterCallback('supply_chain');
  }, [loadWeather, registerCallback, unregisterCallback]);

  const INVENTORY = [
      { id: 'SKU-1001', name: 'Raw Material A', stock: 450, min: 200, status: 'Good' },
      { id: 'SKU-1002', name: 'Component X', stock: 45, min: 100, status: 'Low' },
      { id: 'SKU-1003', name: 'Packaging Box', stock: 1200, min: 500, status: 'Good' },
      { id: 'SKU-1004', name: 'Raw Material B', stock: 12, min: 50, status: 'Critical' },
  ];

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Supply Chain</h1>
            <p className="text-slate-500">Logistics, inventory control, and supplier management</p>
        </div>

        {/* --- WEATHER RISK --- */}
        <Card className="shadow-lg border-blue-100 bg-gradient-to-r from-blue-50 to-white">
          <CardHeader>
            <div className="flex justify-between items-center">
               <CardTitle className="flex items-center gap-2">
                 <CloudSun className="w-5 h-5 text-blue-600" />
                 Logistics Weather Risk Assessment
               </CardTitle>
               <Button variant="ghost" size="sm" onClick={() => loadWeather()} disabled={loading}>
                 <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
               </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Array(5).fill(0).map((_, i) => <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-lg" />)}
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  {weatherData.map((city) => (
                    <div 
                      key={city.city} 
                      className={`p-4 rounded-xl border ${
                        city.risk === 'High' ? 'bg-red-50 border-red-200' :
                        city.risk === 'Moderate' ? 'bg-amber-50 border-amber-200' :
                        'bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      <p className="font-bold text-slate-800">{city.city}</p>
                      <div className="flex items-end gap-2 mt-1">
                         <span className="text-2xl font-bold">{city.temp}°</span>
                         <span className="text-xs mb-1 text-slate-500">{city.condition}</span>
                      </div>
                      <Badge className={`mt-2 ${
                         city.risk === 'High' ? 'bg-red-200 text-red-800 hover:bg-red-300' :
                         city.risk === 'Moderate' ? 'bg-amber-200 text-amber-800 hover:bg-amber-300' :
                         'bg-emerald-200 text-emerald-800 hover:bg-emerald-300'
                      }`}>
                         {city.risk} Risk
                      </Badge>
                    </div>
                  ))}
               </div>
            )}
          </CardContent>
        </Card>
        {/* --- END SECTION --- */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-600 text-white border-none shadow-lg shadow-blue-600/20">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Active Shipments</p>
                            <h3 className="text-2xl font-bold">24</h3>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-sm text-blue-100 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                            21 On Time
                        </p>
                        <p className="text-sm text-blue-100 flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                            3 Delayed
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Low Stock Alerts</p>
                            <h3 className="text-2xl font-bold">5</h3>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">View critical items &rarr;</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Inventory Value</p>
                            <h3 className="text-2xl font-bold">$1.2M</h3>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                         <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                             <span>Capacity Usage</span>
                             <span>84%</span>
                         </div>
                         <Progress value={84} className="h-2" />
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {INVENTORY.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900">{item.name}</p>
                                    <p className="text-xs text-slate-500">{item.id}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-2 mb-1">
                                        <span className="font-bold">{item.stock}</span>
                                        <span className="text-xs text-slate-400">/ {item.min} min</span>
                                    </div>
                                    <Badge variant={item.status === 'Good' ? 'default' : 'destructive'} className={item.status === 'Good' ? 'bg-emerald-100 text-emerald-700' : ''}>
                                        {item.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Live Shipments Map</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-slate-100 rounded-lg h-[300px] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10" 
                             style={{backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                        </div>
                        <p className="text-slate-400 font-medium flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Interactive Map Placeholder
                        </p>
                        
                        {/* Fake Map Markers */}
                        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse"></div>
                        <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse delay-75"></div>
                        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50 animate-pulse delay-150"></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default SupplyChainDashboard;