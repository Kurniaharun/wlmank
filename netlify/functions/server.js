const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://gkleavmfcdnlfecbvhll.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbGVhdm1mY2RubGZlY2J2aGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDU5MzUsImV4cCI6MjA3OTk4MTkzNX0.-dfMr07ktQFW_u0v-OkSOVbcxdTa7c0pkAObuwLJjZ8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Netlify Function handler
exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Handle GET request
  if (event.httpMethod === 'GET') {
    try {
      const path = event.path.replace('/.netlify/functions/server', '') || '/';
      
      // Health check endpoint
      if (path === '/health') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ status: 'ok' })
        };
      }

      // Main endpoint - returns JSON with all whitelisted usernames
      const { data, error } = await supabase
        .from('whitelist')
        .select('username')
        .order('username', { ascending: true });

      if (error) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: error.message })
        };
      }

      // Format JSON response neatly
      const usernames = data.map(item => item.username);
      const response = {
        status: 'success',
        total: usernames.length,
        usernames: usernames,
        timestamp: new Date().toISOString()
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response, null, 2)
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message })
      };
    }
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};

