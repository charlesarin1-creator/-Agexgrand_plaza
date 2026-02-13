// supabase.js
// Connects your frontend to Supabase (safe: uses publishable key)

const SUPABASE_URL = "https://hfgtijzqrlkivsgwgnbp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_IGXxIQRWulcE5N0CKqTxyQ_X5FFj194";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
