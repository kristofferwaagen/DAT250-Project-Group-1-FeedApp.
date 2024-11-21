const { Client, Pool } = require("pg");
const Poll = require("../models/poll"); // Import MongoDB Poll model

async function setupDatabase() {
  const userClient = new Client({
    user: "feed-app-user", // Matches the user from docker-compose.yml
    host: "localhost", // PostgreSQL container exposed on localhost
    database: "postgres", // Default database for initial connection
    password: "feedapp123", // Matches the password from docker-compose.yml
    port: 5432, // Matches the port from docker-compose.yml
  });

  const pool = new Pool({
    user: "feed-app-user",
    host: "localhost",
    database: "feed_app_sql", // Ensure this database exists before connecting
    password: "feedapp123",
    port: 5432,
  });

  try {
    // Step 1: Ensure database exists
    await userClient.connect();
    console.log("Connected to PostgreSQL with 'feed-app-user'");

    const dbCheck = await userClient.query(
      "SELECT 1 FROM pg_database WHERE datname = 'feed_app_sql';"
    );

    if (dbCheck.rowCount === 0) {
      console.log("Database 'feed_app_sql' does not exist. Creating...");
      await userClient.query("CREATE DATABASE feed_app_sql;");
      console.log("Database 'feed_app_sql' created successfully.");
    } else {
      console.log("Database 'feed_app_sql' already exists.");
    }

    await userClient.end();

    // Step 2: Ensure tables exist in 'feed_app_sql'
    await pool.query("SELECT NOW()"); // Test connection
    console.log(
      "Connected to PostgreSQL 'feed_app_sql' for table initialization."
    );

    await pool.query(`
      CREATE TABLE IF NOT EXISTS polls (
        id TEXT PRIMARY KEY,
        question TEXT NOT NULL,
        published_at TIMESTAMP NOT NULL,
        valid_until TIMESTAMP NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vote_options (
        id TEXT PRIMARY KEY,
        poll_id TEXT NOT NULL,
        caption TEXT NOT NULL,
        vote_count INT DEFAULT 0,
        FOREIGN KEY (poll_id) REFERENCES polls (id) ON DELETE CASCADE
      );
    `);

    console.log("Tables ensured in PostgreSQL.");
    console.log("Synchronizing PostgreSQL with MongoDB");

    // Step 3: Synchronize data from MongoDB to PostgreSQL
    const polls = await Poll.find().populate("voteOptions");
    for (const poll of polls) {
      // Insert poll into PostgreSQL if not already present
      const pollExists = await pool.query("SELECT 1 FROM polls WHERE id = $1", [
        poll._id.toString(),
      ]);

      if (pollExists.rowCount === 0) {
        await pool.query(
          "INSERT INTO polls (id, question, published_at, valid_until) VALUES ($1, $2, $3, $4)",
          [
            poll._id.toString(),
            poll.question,
            poll.publishedAt,
            poll.validUntil,
          ]
        );
        console.log(`Poll added to PostgreSQL: ${poll.question}`);
      }

      // Insert vote options into PostgreSQL
      for (const voteOption of poll.voteOptions) {
        const voteOptionExists = await pool.query(
          "SELECT 1 FROM vote_options WHERE id = $1",
          [voteOption._id.toString()]
        );

        if (voteOptionExists.rowCount === 0) {
          await pool.query(
            "INSERT INTO vote_options (id, poll_id, caption, vote_count) VALUES ($1, $2, $3, $4)",
            [
              voteOption._id.toString(),
              poll._id.toString(),
              voteOption.caption,
              voteOption.voteCount || 0,
            ]
          );
          console.log(`Vote option added to PostgreSQL: ${voteOption.caption}`);
        }
      }
    }

    console.log("Synchronization from MongoDB to PostgreSQL complete.");
  } catch (error) {
    console.error("Error during database setup:", error);
    process.exit(1); // Exit on failure
  }
}

module.exports = setupDatabase;
