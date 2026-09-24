import { createClient } from "@supabase/supabase-js";

// Ensure environment variables are loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

if (supabaseUrl === "https://placeholder.supabase.co") {
  console.warn(
    "Missing Supabase environment variables! Please check your .env.local file."
  );
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);
