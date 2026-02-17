// backend/src/database/testConnection.ts
import { supabase } from './supabase';

// Simple check to ensure that supabase client is up and running, we can hit
// this endpoint to return the contents of the dev_users table, it will either
// return connection successful or connection failed to help with debugging. 
async function testConnection() {
  const { data, error } = await supabase
    .from('dev_users')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connection successful!', data);
  }
}

testConnection();