import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getCleanupSchedule, saveCleanupSchedule, calculateNextCleanupTime, getCountdownToNextCleanup } from '@/utils/scheduleManager';
import { supabase } from '@/lib/customSupabaseClient';

// UPDATE: Hook now accepts an optional 'account' object to scope the schedule to a specific account
export const useAutoCleanupSchedule = (currentAccount = null) => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [nextCleanupTime, setNextCleanupTime] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to fetch schedule with account_id
  const fetchScheduleWithAccount = async (userId, accountId) => {
      // We need to implement a modified getCleanupSchedule in scheduleManager or here
      // Since scheduleManager.js was simple, we can query Supabase directly here for flexibility
      try {
        const { data, error } = await supabase
            .from('cleanup_schedules')
            .select('*')
            .eq('user_id', userId)
            .eq('account_id', accountId) // CRITICAL: Filter by account
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
      } catch (err) {
        console.error("Error fetching schedule:", err);
        return null;
      }
  };

  const fetchSchedule = useCallback(async () => {
    if (!user || !currentAccount) {
        setSchedule(null);
        setLoading(false);
        return;
    }

    try {
      setLoading(true);
      // Use the new helper that respects account_id
      const data = await fetchScheduleWithAccount(user.id, currentAccount.id);
      
      if (data) {
        setSchedule(data);
        if (data.enabled) {
          const next = calculateNextCleanupTime(data.day_of_week, data.hour, data.minute);
          setNextCleanupTime(next);
          setCountdown(getCountdownToNextCleanup(next));
        } else {
            setNextCleanupTime(null);
            setCountdown('Disabled');
        }
      } else {
         // Default empty state but distinct
         setSchedule({
             user_id: user.id,
             account_id: currentAccount.id,
             day_of_week: 1, // Monday
             hour: 9,
             minute: 0,
             enabled: false
         });
         setCountdown('Disabled');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, currentAccount]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // Update countdown interval
  useEffect(() => {
    if (!schedule?.enabled || !nextCleanupTime) return;

    const interval = setInterval(() => {
      setCountdown(getCountdownToNextCleanup(nextCleanupTime));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [schedule, nextCleanupTime]);

  const updateSchedule = async (day, hour, minute, enabled) => {
    if (!user || !currentAccount) return;
    try {
      setLoading(true);
      
      // Upsert with account_id
      const { data: updated, error } = await supabase
        .from('cleanup_schedules')
        .upsert({
            user_id: user.id,
            account_id: currentAccount.id, // CRITICAL
            day_of_week: day,
            hour: hour,
            minute: minute,
            enabled: enabled,
            updated_at: new Date().toISOString()
        }, { onConflict: 'account_id' }) // Changed constraint from user_id to account_id (assumes unique constraint on DB, or composite unique index)
        .select()
        .single();

      if (error) throw error;

      setSchedule(updated);
      
      if (enabled) {
        const next = calculateNextCleanupTime(day, hour, minute);
        setNextCleanupTime(next);
        setCountdown(getCountdownToNextCleanup(next));
      } else {
        setNextCleanupTime(null);
        setCountdown('Disabled');
      }
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    schedule,
    nextCleanupTime,
    countdown,
    loading,
    error,
    updateSchedule
  };
};