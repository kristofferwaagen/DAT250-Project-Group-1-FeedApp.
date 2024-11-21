const express = require("express");
const mongoose = require("mongoose");
const pollRouter = require("./routes/pollRouter");
const voteRouter = require("./routes/voteRouter");
const userRouter = require("./routes/userRouter");
const cors = require("cors");
const setupDatabase = require("./setup/setup"); // Ensures database exists, tables are created, and MongoDB syncs to PostgreSQL

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/feedAppDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    return setupDatabase(); // Ensure PostgreSQL setup and synchronization
  })
  .then(() => {
    console.log("PostgreSQL database setup complete.");
    startServer();
  })
  .catch((error) => {
    console.error("Error during setup:", error);
    process.exit(1); // Exit if setup fails
  });

function startServer() {
  app.use(cors());
  app.use(express.json());

  app.use("/polls", pollRouter);
  app.use("/votes", voteRouter);
  app.use("/users", userRouter);

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
