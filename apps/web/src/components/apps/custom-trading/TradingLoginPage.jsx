import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Shield } from 'lucide-react';

const TradingLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simple simulated auth for the trading portal
    setTimeout(() => {
      localStorage.setItem('trading_auth_token', 'true');
      toast({ title: "Login Successful", description: "Welcome to the trading dashboard." });
      navigate('/trading-dashboard');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-none shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Trading Portal</CardTitle>
          <p className="text-slate-500 text-sm mt-2">Secure access to market execution</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={loading || !email || !password} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 mt-6">
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingLoginPage;