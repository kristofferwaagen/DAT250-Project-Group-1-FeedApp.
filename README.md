# DAT250-Project-Group-1-FeedApp

## Prerequisites

Before running the application, ensure the following software is installed:

- **Node.js** (version 16 or higher)
- **PostgreSQL** (version 14 or higher)
- **RabbitMQ** (latest version)

## How to run PostgreSQL and RabbitMQ

### For Windows

- Start the PostgreSQL service from the Windows Services Manager
- Start the RabbitMQ service from the Windows Services Manager

### For MacOS

- `brew services start postgresql`
- `brew services start rabbitmq`

### For Linux

- `sudo systemctl start postgresql`
- `sudo systemctl enable rabbitmq-server`
  - `sudo systemctl start rabbitmq-server`

## How to create the database

`cd <PROJECT NAME>`

`cd setup`

`npm run setup-db`

You can check if the database, users and roles were made correctly by logging in to the user and listing the database:

`psql -U feed-app-user -d feed_app_sql`

`\dt`

The output should look something like this:

![database image](./setup/database.png)

## How to run backend

Change directory to git repo:

`cd <PROJECT NAME>`

Ensure PostgreSQL and RabbitMQ are running:

- PostgreSQL should be configured with:
  - Host: `localhost`
  - Port: `5432`
  - User: `feed-app-user`
  - Password: `feedapp123`
  - Database: `feed_app_sql`
- RabbitMQ should be accessible at:
  - Host: `localhost`

NB! If you are not using custom configurations, it should work out of the box so no need to specify Postgre configs.

Start server on port 3000:

`npm start`

## How to run frontend

Change directory to pollApp:

`cd pollApp`

Install dependencies:

`npm install`

Start frontend on port 5173:

`npm run dev`

## How it works

### Backend

The backend server runs on `http://localhost:3000` and provides the following functionalities:

- Creating polls
- Fetching polls and their vote options
- Updating vote counts
- Clearing the database

### Frontend

The frontend runs on `http://localhost:5173` and enables users to:

- Create polls with multiple vote options
- Vote on poll options
- View all polls and their respective vote counts
- Clear the database from the interface

### Database

The database is created with the required user and privileges when running `setup-db`. When the backend starts the tables in the database will be generated automatically.

## RabbitMQ Configuration

Make sure RabbitMQ is installed and running on localhost. There is no additional setup required unless you are using a remote RabbitMQ instance.

## Troubleshooting

### Backend issues

- Make sure that PostgreSQL and RabbitMQ are running.
- Verify that your local PostgreSQL credentials match the ones used in the project

### Frontend issues

- Make sure that the required dependencies are installed. See `How to run frontend`

### Port issues

- Make sure that the ports `3000` for the backend, `5432` for PostgreSQL and `5672` for RabbitMQ are not blocked by the firewall.
