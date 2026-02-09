import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); 

const supabaseURL = process.env.SUPABASE_URL!; 
const supabaseKey = process.env.SUPABASE_SECRET_KEY!; 

export const supabase = createClient(supabaseURL, supabaseKey); 