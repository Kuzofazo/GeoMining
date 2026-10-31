import { createClient } from '@supabase/supabase-js';

// Reverting to direct connection for maximum compatibility
const supabaseUrl = 'https://yvvalbuxdgulauupuwuk.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dmFsYnV4ZGd1bGF1dXB1d3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTc4MjYsImV4cCI6MjA5Mzk5MzgyNn0.DcRoRsKsiSB1x9LqT9XKromPGpbt29qODCKGn7MykQU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
