const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://gkleavmfcdnlfecbvhll.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbGVhdm1mY2RubGZlY2J2aGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDU5MzUsImV4cCI6MjA3OTk4MTkzNX0.-dfMr07ktQFW_u0v-OkSOVbcxdTa7c0pkAObuwLJjZ8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Main endpoint - returns JSON with all whitelisted usernames
app.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('whitelist')
      .select('username')
      .order('username', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Format JSON response neatly
    const usernames = data.map(item => item.username);
    const response = {
      status: 'success',
      total: usernames.length,
      usernames: usernames,
      timestamp: new Date().toISOString()
    };

    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

// Export for Netlify
module.exports = app;

