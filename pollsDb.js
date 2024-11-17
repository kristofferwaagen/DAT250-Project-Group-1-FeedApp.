const { Pool } = require("pg");

const pool = new Pool({
  user: "feed-app-user", // Match the user from postgres.js
  host: "localhost", // Match the user from postgres.js
  database: "feed_app_sql", // Match the database from postgres.js
  password: "feedapp123", // Match the password from postgres.js
  port: 5432, // Match the port from postgres.js
});

async function initializePollsDatabase() {
  try {
    // Test the connection
    await pool.query("SELECT NOW()");
    console.log("Connected to PostgreSQL for polls");

    // Ensure `polls` table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS polls (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        published_at TIMESTAMP NOT NULL,
        valid_until TIMESTAMP NOT NULL
      );
    `);

    // Ensure `vote_options` table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vote_options (
        id SERIAL PRIMARY KEY,
        poll_id INT NOT NULL,
        caption TEXT NOT NULL,
        vote_count INT DEFAULT 0,
        FOREIGN KEY (poll_id) REFERENCES polls (id) ON DELETE CASCADE
      );
    `);

    console.log("Poll and vote tables ensured in PostgreSQL");
  } catch (error) {
    console.error("Error setting up PostgreSQL for polls:", error);
    throw error;
  }
}

// Initialize the database setup
initializePollsDatabase();

module.exports = pool; // Export the `Pool` instance
