const { Client, Pool } = require("pg");
const Poll = require("../models/poll");

const client = new Client({
  user: "feed-app-user",
  host: "localhost",
  database: "feed_app_sql",
  password: "feedapp123",
  port: 5433,
});

async function setupDatabase() {
  try {
    const adminClient = new Client({
      user: "feed-app-user",
      host: "localhost",
      database: "postgres",
      password: "feedapp123",
      port: 5433,
    });
    await adminClient.connect();
    console.log("Connected to PostgreSQL with 'feed-app-user'");

    const dbCheck = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = 'feed_app_sql';"
    );
    if (dbCheck.rowCount === 0) {
      console.log("Database 'feed_app_sql' does not exist. Creating...");
      await adminClient.query("CREATE DATABASE feed_app_sql;");
      console.log("Database 'feed_app_sql' created successfully.");
    } else {
      console.log("Database 'feed_app_sql' already exists.");
    }
    await adminClient.end();

    await client.connect();
    console.log(
      "Connected to PostgreSQL 'feed_app_sql' for table initialization."
    );

    await client.query(`
      CREATE TABLE IF NOT EXISTS polls (
        id TEXT PRIMARY KEY,
        question TEXT NOT NULL,
        published_at TIMESTAMP NOT NULL,
        valid_until TIMESTAMP NOT NULL
      );
    `);
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
    console.error("Error during database setup:", error);
    throw error;
  }
}

async function synchronizeDatabase() {
  try {
    console.log("Synchronizing PostgreSQL with MongoDB");

    const polls = await Poll.find().populate("voteOptions");
    const mongoPollIds = polls.map((poll) => poll._id.toString());

    const postgresPolls = await client.query("SELECT id FROM polls");
    const postgresPollIds = postgresPolls.rows.map((row) => row.id);

    const pollsToDelete = postgresPollIds.filter(
      (id) => !mongoPollIds.includes(id)
    );
    for (const pollId of pollsToDelete) {
      await client.query("DELETE FROM polls WHERE id = $1", [pollId]);
      console.log(`Deleted poll from PostgreSQL: ${pollId}`);
    }

    for (const poll of polls) {
      const pollId = poll._id.toString();
      const pollExists = await client.query(
        "SELECT 1 FROM polls WHERE id = $1",
        [pollId]
      );

      if (pollExists.rowCount === 0) {
        await client.query(
          "INSERT INTO polls (id, question, published_at, valid_until) VALUES ($1, $2, $3, $4)",
          [pollId, poll.question, poll.publishedAt, poll.validUntil]
        );

        for (const voteOption of poll.voteOptions) {
          await client.query(
            "INSERT INTO vote_options (id, poll_id, caption, vote_count) VALUES ($1, $2, $3, $4)",
            [
              voteOption._id.toString(),
              pollId,
              voteOption.caption,
              voteOption.voteCount || 0,
            ]
          );
        }
        console.log(`Poll synchronized to PostgreSQL: ${poll.question}`);
      }
    }

    console.log("Synchronization from MongoDB to PostgreSQL complete.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
    throw error;
  }
}

module.exports = {
  setupDatabase,
  synchronizeDatabase,
  query: (text, params) => client.query(text, params),
};
