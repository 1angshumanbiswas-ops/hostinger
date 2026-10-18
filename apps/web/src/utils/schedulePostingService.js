import { addDays, setHours, setMinutes, format, isSameDay, startOfHour } from 'date-fns';
import { supabase } from '@/lib/customSupabaseClient';

const COLORS = ['Blue', 'Green', 'Orange', 'Purple', 'Gradient'];
const TEMPLATES = ['Corporate', 'Lifestyle', 'Gradient', 'Minimalist'];

export const generateSchedule = async (startDate = new Date()) => {
  const schedule = [];
  const platforms = ['linkedin', 'instagram', 'facebook', 'whatsapp'];
  
  // 30 days schedule
  for (let i = 0; i < 30; i++) {
    const currentDate = addDays(startDate, i);
    const dayOfWeek = currentDate.getDay(); // 0 = Sun, 1 = Mon, etc.

    for (const platform of platforms) {
      let times = [];

      // Platform specific frequencies
      if (platform === 'whatsapp') {
        // WhatsApp: 1x every 2 weeks (Monday 10 AM)
        // Simplified logic: Every Monday 10 AM for demo purposes, or check if it's the specific bi-weekly Monday
        if (dayOfWeek === 1) { 
           times = ['10:00'];
        }
      } else {
        // FB, IG, LI: 3x daily (8 AM, 12 PM, 6 PM)
        times = ['08:00', '12:00', '18:00'];
      }

      for (const time of times) {
        const [hour, minute] = time.split(':').map(Number);
        const scheduledTime = setMinutes(setHours(currentDate, hour), minute);

        const { color, template } = getNextColorTemplate(schedule, platform);

        schedule.push({
          platform,
          scheduled_time: scheduledTime.toISOString(),
          color,
          template,
          status: 'scheduled',
          content: `Auto-generated content for ${platform} on ${format(scheduledTime, 'PPP')}`
        });
      }
    }
  }
  
  return schedule;
};

export const getNextColorTemplate = (currentSchedule, platform) => {
  // Get last post for this platform to avoid consecutive duplicates
  const platformPosts = currentSchedule.filter(p => p.platform === platform);
  const lastPost = platformPosts[platformPosts.length - 1];

  let colorIndex = Math.floor(Math.random() * COLORS.length);
  let templateIndex = Math.floor(Math.random() * TEMPLATES.length);

  // Simple rotation logic to avoid immediate duplicate
  if (lastPost) {
    while (COLORS[colorIndex] === lastPost.color) {
        colorIndex = (colorIndex + 1) % COLORS.length;
    }
    while (TEMPLATES[templateIndex] === lastPost.template) {
        templateIndex = (templateIndex + 1) % TEMPLATES.length;
    }
  }

  return {
    color: COLORS[colorIndex],
    template: TEMPLATES[templateIndex]
  };
};

export const checkAndPostScheduled = async () => {
  // Find posts scheduled for the current hour (or past due and not posted)
  const now = new Date();
  
  const { data: postsToPublish, error } = await supabase
    .from('scheduled_posts')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_time', now.toISOString());

  if (error) {
    console.error("Error fetching scheduled posts:", error);
    return [];
  }

  const publishedPosts = [];

  for (const post of postsToPublish) {
    // 1. Add to history
    const { error: historyError } = await supabase
      .from('posting_history')
      .insert({
        platform: post.platform,
        color: post.color,
        template: post.template,
        status: 'success',
        content: post.content,
        posted_at: new Date().toISOString(),
        engagement_metrics: { likes: 0, shares: 0, comments: 0 } // Init empty metrics
      });

    if (!historyError) {
      // 2. Update status in scheduled_posts (or delete, depending on preference. Updating status is better for logs)
      const { error: updateError } = await supabase
        .from('scheduled_posts')
        .update({ status: 'posted', posted_at: new Date().toISOString() })
        .eq('id', post.id);
        
      if (!updateError) {
        publishedPosts.push(post);
      }
    }
  }

  return publishedPosts;
};

export const storePostingHistory = async (postData) => {
    const { data, error } = await supabase
    .from('posting_history')
    .insert({
        ...postData,
        posted_at: new Date().toISOString()
    });
    return { data, error };
};