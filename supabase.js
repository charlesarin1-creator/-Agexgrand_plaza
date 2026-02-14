// supabase.js
// Connects your frontend to Supabase (safe: uses publishable key)

const SUPABASE_URL = "https://hfgtijzqrlkivsgwgnbp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3RpanpxcmxraXZzZ3dnbmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDcyMDIsImV4cCI6MjA4NjU4MzIwMn0.2HlBUjJXTJwBqGw0UNIBdg42qBuRhZCCThlYcbvtyjQ";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
