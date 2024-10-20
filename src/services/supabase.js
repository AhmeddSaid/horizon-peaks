import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://gnqzvnxhjtsgfgeoqrgs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducXp2bnhoanRzZ2ZnZW9xcmdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkxMzA0MTksImV4cCI6MjAxNDcwNjQxOX0.XRZAjm4ocMFLGVdb9REHsAckK1ypJO5SAERFUiXCB2M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
