const { Client } = require("pg");

const client = new Client({
  user: "feed-app-user",
  host: "localhost",
  database: "feed_app_sql",
  password: "feedapp123",
  port: 5432,
});

async function initializeDatabase() {
  try {
    // Connect to PostgreSQL
    await client.connect();
    console.log(
      "Connected to PostgreSQL with single client for polls and votes."
    );

    // Ensure `polls` table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS polls (
        id TEXT PRIMARY KEY,
        question TEXT NOT NULL,
        published_at TIMESTAMP NOT NULL,
        valid_until TIMESTAMP NOT NULL
      );
    `);

    // Ensure `vote_options` table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS vote_options (
        id TEXT PRIMARY KEY,
        poll_id TEXT NOT NULL,
        caption TEXT NOT NULL,
        vote_count INT DEFAULT 0,
        FOREIGN KEY (poll_id) REFERENCES polls (id) ON DELETE CASCADE
      );
    `);

    console.log("Tables ensured in PostgreSQL.");
  } catch (error) {
    console.error("Error initializing PostgreSQL database:", error);
    throw error;
  }
}

module.exports = {
  query: (text, params) => client.query(text, params), // Expose a query method for pgClient compatibility
  initializeDatabase, // Export the initialization function
};
