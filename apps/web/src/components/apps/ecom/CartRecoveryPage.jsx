import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateRecoveryToken, markCartRecovered } from '@/utils/CartAbandonmentDetectionService';
import { ShoppingBag, CheckCircle2, AlertTriangle, ArrowRight, Loader2, Minus, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CartRecoveryPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [items, setItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      const res = await validateRecoveryToken(token);
      if (res.valid) {
        setCartData(res.cart);
        setItems(res.cart.items || []);
      } else {
        setErrorMsg(res.reason);
      }
      setLoading(false);
    };
    if (token) fetchCart();
  }, [token]);

  const updateQuantity = (index, delta) => {
    const newItems = [...items];
    const newQty = (newItems[index].quantity || 1) + delta;
    if (newQty > 0) {
      newItems[index].quantity = newQty;
      setItems(newItems);
    }
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(async () => {
      const success = await markCartRecovered(cartData.id);
      setIsProcessing(false);
      if (success) {
        setIsSuccess(true);
      } else {
        toast({ title: 'Error', description: 'Failed to process recovery.', variant: 'destructive' });
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full border-red-200">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Link Invalid or Expired</h2>
            <p className="text-slate-500">{errorMsg}</p>
            <Button className="mt-4 w-full" onClick={() => navigate('/')}>Return to Store</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full border-green-200">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Order Complete!</h2>
            <p className="text-slate-500">Thank you for recovering your cart. Your order is now being processed.</p>
            <Button className="mt-4 w-full" onClick={() => navigate('/')}>Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back, {cartData?.customer_name?.split(' ')[0] || 'Friend'}!</h1>
          <p className="mt-2 text-slate-500">We saved your cart so you can easily pick up right where you left off.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Cart Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="divide-y border-t border-b">
              {items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{item.name || item.title || 'Product'}</h4>
                    <p className="text-sm text-slate-500">${Number(item.price).toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-md">
                      <button onClick={() => updateQuantity(idx, -1)} className="p-2 hover:bg-slate-50 text-slate-500"><Minus className="w-4 h-4"/></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(idx, 1)} className="p-2 hover:bg-slate-50 text-slate-500"><Plus className="w-4 h-4"/></button>
                    </div>
                    <div className="w-20 text-right font-semibold">
                      ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">${calculateTotal()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-slate-900 text-xl">${calculateTotal()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Confirm Your Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Input defaultValue={cartData?.customer_name} placeholder="Full Name" />
                <Input defaultValue={cartData?.customer_email} placeholder="Email Address" type="email" />
              </div>
            </div>

          </CardContent>
          <CardFooter>
            <Button className="w-full h-12 text-lg" size="lg" onClick={handleCheckout} disabled={isProcessing || items.length === 0}>
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2"/> : null}
              {isProcessing ? 'Processing...' : 'Complete Your Purchase'} 
              {!isProcessing && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}