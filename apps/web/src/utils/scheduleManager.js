import { supabase } from '@/lib/customSupabaseClient';
import { addDays, nextDay, setHours, setMinutes, setSeconds, format, differenceInSeconds, startOfWeek } from 'date-fns';

/**
 * Saves or updates the user's cleanup schedule.
 */
export async function saveCleanupSchedule(userId, dayOfWeek, hour, minute, enabled) {
  try {
    const { data, error } = await supabase
      .from('cleanup_schedules')
      .upsert({
        user_id: userId,
        day_of_week: dayOfWeek,
        hour: hour,
        minute: minute,
        enabled: enabled,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving schedule:', error);
    throw error;
  }
}

/**
 * Fetches the user's cleanup schedule.
 */
export async function getCleanupSchedule(userId) {
  try {
    const { data, error } = await supabase
      .from('cleanup_schedules')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore "no rows found" error
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return null;
  }
}

/**
 * Calculates the next occurrence of the cleanup based on day and time.
 * @param {number} dayOfWeek - 0 (Sunday) to 6 (Saturday)
 * @param {number} hour - 0 to 23
 * @param {number} minute - 0 to 59
 */
export function calculateNextCleanupTime(dayOfWeek, hour, minute) {
  const now = new Date();
  const currentDay = now.getDay();
  
  // Set the time for the target day
  let nextDate = new Date();
  nextDate.setHours(hour, minute, 0, 0);

  if (currentDay === dayOfWeek) {
    // If today is the scheduled day
    if (nextDate <= now) {
      // If time has passed, move to next week
      nextDate = addDays(nextDate, 7);
    }
  } else {
    // Calculate days until next occurrence
    // nextDay function from date-fns returns the next occurrence of the day
    // But nextDay(now, 0) returns next Sunday. If today is Sunday (0), it returns next Sunday.
    // If dayOfWeek is in future this week:
    const daysToAdd = (dayOfWeek + 7 - currentDay) % 7;
    nextDate = addDays(now, daysToAdd);
    nextDate.setHours(hour, minute, 0, 0);
    
    // Safety check if calculation put it in the past (shouldn't happen with modulo logic but good to be safe)
    if (nextDate <= now) {
         nextDate = addDays(nextDate, 7);
    }
  }

  return nextDate;
}

/**
 * Returns a formatted countdown string.
 */
export function getCountdownToNextCleanup(nextCleanupTime) {
  if (!nextCleanupTime) return "Not scheduled";

  const now = new Date();
  const diffInSeconds = differenceInSeconds(nextCleanupTime, now);

  if (diffInSeconds <= 0) return "Running soon...";

  const days = Math.floor(diffInSeconds / (3600 * 24));
  const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  if (parts.length === 0) return "< 1m";

  return parts.join(' ');
}