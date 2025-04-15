import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ppvbuwkqthjwksakdyvh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwdmJ1d2txdGhqd2tzYWtkeXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzA5NTQsImV4cCI6MjA1OTgwNjk1NH0.sFVqXKLCfAJf0meElAOFU1r3DOaeTPOdomQCXeJf5iM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
