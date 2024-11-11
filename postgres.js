// postgres.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'feed-app-user',          
  host: 'localhost',
  database: 'feed_app_sql',       
  password: 'feedapp123',   
  port: 5432,
});

// Test tilkoblingen
pool.connect((err) => {
  if (err) {
    console.error('Connection error to PostgreSQL:', err.stack);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

module.exports = pool;
