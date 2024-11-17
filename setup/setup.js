const { Client } = require("pg");

async function setupDatabase() {
  const userClient = new Client({
    user: "feed-app-user",
    host: "localhost",
    database: "postgres", // This is a fallback to ensure we can connect even if the main database doesn't exist yet
    password: "feedapp123",
    port: 5432,
  });

  try {
    // Connect as 'feed-app-user'
    await userClient.connect();
    console.log("Connected to PostgreSQL with 'feed-app-user'");

    // Try creating the database if it doesn't exist
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

    console.log("Database setup complete.");
    await userClient.end();
  } catch (error) {
    if (error.code === "28P01") {
      console.error(
        "Authentication failed for 'feed-app-user'. Please ensure the user exists and the password is correct."
      );
    } else if (error.code === "42501") {
      console.error(
        "Permission denied. The 'feed-app-user' does not have the necessary privileges to create a database."
      );
    } else {
      console.error("Error during database setup:", error);
    }
    process.exit(1); // Exit on failure
  }
}

setupDatabase();
