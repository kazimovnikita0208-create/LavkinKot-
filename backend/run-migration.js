const { supabase } = require('./src/config/supabase');

async function migrate() {
  try {
    console.log('Starting migration...');
    
    // Update existing test user to have free deliveries
    const { data, error } = await supabase
      .from('profiles')
      .update({ free_deliveries_remaining: 1 })
      .eq('telegram_id', 123456789)
      .select();
    
    if (error) {
      console.log('Update error:', error.message);
      console.log('Note: The column might not exist yet. Please run this SQL in Supabase:');
      console.log('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS free_deliveries_remaining INT DEFAULT 1;');
    } else {
      console.log('Updated users:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('User data:', JSON.stringify(data[0], null, 2));
      }
    }
    
    process.exit(0);
  } catch (e) {
    console.error('Migration error:', e.message);
    process.exit(1);
  }
}

migrate();
