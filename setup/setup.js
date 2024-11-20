const { Client } = require("pg");

async function setupDatabase() {
  const superuserClient = new Client({
    user: "postgres", // Superuser account
    host: "localhost",
    database: "postgres", // Default database for initial connection
    password: "your_postgres_password", // Update with the superuser password
    port: 5432,
  });

  try {
    // Connect as superuser
    await superuserClient.connect();
    console.log("Connected to PostgreSQL as superuser");

    // Create 'feed-app-user' if it doesn't exist
    const userCheck = await superuserClient.query(
      "SELECT 1 FROM pg_roles WHERE rolname = 'feed-app-user';"
    );

    if (userCheck.rowCount === 0) {
      console.log("User 'feed-app-user' does not exist. Creating...");
      await superuserClient.query(
        "CREATE ROLE \"feed-app-user\" WITH LOGIN PASSWORD 'feedapp123';"
      );
      console.log("User 'feed-app-user' created successfully.");
    } else {
      console.log("User 'feed-app-user' already exists.");
    }

    // Create 'feed_app_sql' database if it doesn't exist
    const dbCheck = await superuserClient.query(
      "SELECT 1 FROM pg_database WHERE datname = 'feed_app_sql';"
    );

    if (dbCheck.rowCount === 0) {
      console.log("Database 'feed_app_sql' does not exist. Creating...");
      await superuserClient.query(
        'CREATE DATABASE feed_app_sql OWNER "feed-app-user";'
      );
      console.log("Database 'feed_app_sql' created successfully.");
    } else {
      console.log("Database 'feed_app_sql' already exists.");
    }

    // Grant privileges
    await superuserClient.query(
      'GRANT ALL PRIVILEGES ON DATABASE feed_app_sql TO "feed-app-user";'
    );
    console.log("Privileges granted to 'feed-app-user'.");

    console.log("Database setup complete.");
  } catch (error) {
    if (error.code === "28P01") {
      console.error(
        "Authentication failed for superuser. Please ensure the 'postgres' user exists and the password is correct."
      );
    } else if (error.code === "42501") {
      console.error(
        "Permission denied. The 'postgres' user does not have the necessary privileges."
      );
    } else {
      console.error("Error during database setup:", error);
    }
    process.exit(1); // Exit on failure
  } finally {
    await superuserClient.end();
  }
}

setupDatabase();
