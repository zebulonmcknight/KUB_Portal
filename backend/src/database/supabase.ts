import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); 

// URL and secret key shoulde be pulled from .env file
const supabaseURL = process.env.SUPABASE_URL!; 
const supabaseKey = process.env.SUPABASE_SECRET_KEY!; 

// Supabase client, by exporting this connection other files (and thus all of 
// api endpoints) may use supabase.Method calls to query the database. 
export const supabase = createClient(supabaseURL, supabaseKey); 