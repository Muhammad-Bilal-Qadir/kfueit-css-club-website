/* ================================================================
   SUPABASE CONFIGURATION
   ----------------------------------------------------------------
   Neeche di gayi 2 values apne Supabase project se copy karke
   yahan paste karein. Yeh Supabase Dashboard > Project Settings >
   API section mein milti hain.
   ================================================================ */

const SUPABASE_URL = "https://bmccxlzglxnshxwkflvx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtY2N4bHpnbHhuc2h4d2tmbHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTAzODgsImV4cCI6MjEwMTMyNjM4OH0.Ra7ADR5qcsii4MHHqb5L4etbw1s0xOnyxaLojH8c_Eo";

// Supabase client initialization
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
