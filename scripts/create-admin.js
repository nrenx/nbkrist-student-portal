// Script to create an admin user
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get Supabase URL and key from environment variables or prompt for them
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Function to prompt for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdmin() {
  try {
    console.log('Create Admin User Script');
    console.log('------------------------');

    // Get Supabase credentials if not provided
    let url = supabaseUrl;
    let key = supabaseKey;

    if (!url) {
      url = await prompt('Enter your Supabase URL: ');
    }

    if (!key) {
      key = await prompt('Enter your Supabase anon key: ');
    }

    // Create Supabase client
    const supabase = createClient(url, key);

    // Get admin details
    const email = await prompt('Enter admin email: ');
    const password = await prompt('Enter admin password: ');

    // Insert the admin user with plain text password
    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        { email: email.toLowerCase(), password: password }
      ])
      .select();

    if (error) {
      console.error('Error creating admin user:', error.message);
    } else {
      console.log('Admin user created successfully!');
      console.log('Admin ID:', data[0].id);
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  } finally {
    rl.close();
  }
}

// Run the script
createAdmin();
