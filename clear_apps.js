import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvvalbuxdgulauupuwuk.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dmFsYnV4ZGd1bGF1dXB1d3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTc4MjYsImV4cCI6MjA5Mzk5MzgyNn0.DcRoRsKsiSB1x9LqT9XKromPGpbt29qODCKGn7MykQU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearApplications() {
  console.log('Starting to clear applications...');

  const { data: appData, error: appError } = await supabase
    .from('applications')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (appError) {
    console.error('Error clearing applications:', appError);
  } else {
    console.log('Applications cleared successfully!');
  }

  const { data: jobData, error: jobError } = await supabase
    .from('jobs')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (jobError) {
    console.error('Error clearing jobs:', jobError);
  } else {
    console.log('Jobs cleared successfully!');
  }
}

clearApplications();
