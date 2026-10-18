import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://alzgsgrolczhcmhquzxv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsemdzZ3JvbGN6aGNtaHF1enh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NTg5NTAsImV4cCI6MjA4MDMzNDk1MH0.jse2wDKhWB23o0tpNR-tcz0BgZLntMYKWGFOedC7uNc';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
