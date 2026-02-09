// backend/src/database/test-connection.ts
import { supabase } from './supabase';

async function testConnection() {
  const { data, error } = await supabase
    .from('users_dev')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connection successful!', data);
  }
}

testConnection();