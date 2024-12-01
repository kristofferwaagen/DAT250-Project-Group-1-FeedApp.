const express = require("express");
const mongoose = require("mongoose");
const pollRouter = require("./routes/pollRouter");
const voteRouter = require("./routes/voteRouter");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const cors = require("cors");
const authenticateJWT = require("./middleware/authenticateJWT"); // Importer autentisering middleware
const app = express();
const port = process.env.PORT || 3000;
const pollWorker = require("./workers/pollWorker");
const voteWorker = require("./workers/voteWorker");
const dotenv = require("dotenv").config();
const { setupDatabase } = require("./setup/setup");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", authRouter);

// Koble til databasen
mongoose
  .connect("mongodb://127.0.0.1:27017/feedAppDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    //Start workers
    pollWorker();
    voteWorker();
    return setupDatabase();
  })
  .then(() => {
    console.log("PostgreSQL database setup complete.");
  })
  .catch((error) => {
    console.error("Error during setup:", error);
    process.exit(1);
  });

// Bruk autentisering på ruter som skal beskyttes
app.use("/polls", authenticateJWT, pollRouter); // Beskytter poll-ruter med autentisering
app.use("/votes", voteRouter); // Beskytter vote-ruter med autentisering
app.use("/users", userRouter); // Beskytter user-ruter med autentisering

// Start serveren
app.listen(port, () => {
  console.log(`Serveren kjører på http://localhost:${port}`);
});
