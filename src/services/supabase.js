import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase URL ve Anon Key (Proje ayarlarından aldıklarımız)
const supabaseUrl = 'https://mbqjklupfoqbcfxusigs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icWprbHVwZm9xYmNmeHVzaWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NjAwODUsImV4cCI6MjA5NDEzNjA4NX0.Cui6UeIXESWXTfZex040sHg59SIa5vy6p3GaLdy7RPg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
