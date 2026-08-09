/* ================================================================
   SUPABASE CONFIGURATION
   ----------------------------------------------------------------
   Neeche di gayi 2 values apne Supabase project se copy karke
   yahan paste karein. Yeh Supabase Dashboard > Project Settings >
   API section mein milti hain.
   ================================================================ */

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL_HERE";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_PUBLIC_KEY_HERE";

// Supabase client banaya ja raha hai (isay change karne ki zaroorat nahi)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
