-- Create the user
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_roles WHERE rolname = 'feed-app-user'
   ) THEN
      CREATE ROLE "feed-app-user" WITH LOGIN PASSWORD 'feedapp123';
   END IF;
END $$;

-- Create the database
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'feed_app_sql'
   ) THEN
      CREATE DATABASE feed_app_sql;
   END IF;
END $$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE feed_app_sql TO "feed-app-user";
