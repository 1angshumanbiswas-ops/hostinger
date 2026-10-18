import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useTradeManagement = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTrades = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      // Fetch trades and their SL/TP levels
      let query = supabase
        .from('custom_trades')
        .select('*, trade_levels(id, stop_loss_price, take_profit_price)');
        
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Mock real-time price and calculate P&L
      const processedTrades = (data || []).map(trade => {
        // Mock current price based on entry (just for simulation)
        const mockVolatility = (Math.random() - 0.5) * 0.005 * trade.entry_price;
        const currentPrice = trade.status === 'OPEN' 
          ? Number(trade.entry_price) + mockVolatility 
          : Number(trade.current_price || trade.entry_price);

        const isBuy = trade.type === 'BUY';
        const priceDiff = currentPrice - Number(trade.entry_price);
        const pnl = isBuy ? priceDiff * Number(trade.size) * 100000 : -priceDiff * Number(trade.size) * 100000;

        const levels = trade.trade_levels?.[0] || {};

        return {
          ...trade,
          current_price: currentPrice,
          pnl,
          stop_loss: levels.stop_loss_price,
          take_profit: levels.take_profit_price,
          level_id: levels.id
        };
      });

      setTrades(processedTrades);
    } catch (err) {
      console.error("Error fetching trades:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll for simulated price updates and auto-close
  useEffect(() => {
    fetchTrades();
    const interval = setInterval(() => {
      setTrades(prevTrades => {
        let needsRefetch = false;
        const updated = prevTrades.map(t => {
          if (t.status !== 'OPEN') return t;
          
          const mockVolatility = (Math.random() - 0.5) * 0.002 * t.entry_price;
          const newPrice = t.current_price + mockVolatility;
          const isBuy = t.type === 'BUY';
          const priceDiff = newPrice - Number(t.entry_price);
          const pnl = isBuy ? priceDiff * Number(t.size) * 100000 : -priceDiff * Number(t.size) * 100000;

          // Check SL / TP hits
          if (t.stop_loss) {
            if ((isBuy && newPrice <= t.stop_loss) || (!isBuy && newPrice >= t.stop_loss)) {
              needsRefetch = true;
              closeTrade(t.id, newPrice, 'Closed by Stop Loss');
            }
          }
          if (t.take_profit) {
            if ((isBuy && newPrice >= t.take_profit) || (!isBuy && newPrice <= t.take_profit)) {
              needsRefetch = true;
              closeTrade(t.id, newPrice, 'Closed by Take Profit');
            }
          }

          return { ...t, current_price: newPrice, pnl };
        });
        
        if (needsRefetch) {
           setTimeout(fetchTrades, 1000);
        }
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchTrades]);

  const closeTrade = async (id, exitPrice = null, reason = 'Manually closed') => {
    try {
      const tradeToClose = trades.find(t => t.id === id);
      const finalPrice = exitPrice || tradeToClose.current_price;
      
      await supabase.from('custom_trades').update({ 
        status: 'CLOSED',
        current_price: finalPrice
      }).eq('id', id);
      
      toast({ title: "Trade Closed", description: reason });
      fetchTrades();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const updateTradeLevels = async (tradeId, levelId, sl, tp) => {
    try {
      if (levelId) {
        await supabase.from('trade_levels').update({
          stop_loss_price: sl || null,
          take_profit_price: tp || null,
          updated_at: new Date().toISOString()
        }).eq('id', levelId);
      } else {
        await supabase.from('trade_levels').insert([{
          trade_id: tradeId,
          stop_loss_price: sl || null,
          take_profit_price: tp || null
        }]);
      }
      toast({ title: "Success", description: "Trade levels updated" });
      fetchTrades();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return { trades, loading, closeTrade, updateTradeLevels, refresh: fetchTrades };
};