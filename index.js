const express = require("express");
const mongoose = require("mongoose");
const pollRouter = require("./routes/pollRouter");
const voteRouter = require("./routes/voteRouter");
const userRouter = require("./routes/userRouter");
const cors = require("cors");
const authenticateJWT = require("./middleware/authenticateJWT");  // Importer autentisering middleware
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Koble til databasen
mongoose
  .connect("mongodb://localhost:27017/feedAppDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Bruk autentisering på ruter som skal beskyttes
app.use("/polls", authenticateJWT, pollRouter);  // Beskytter poll-ruter med autentisering
app.use("/votes", voteRouter);  // Beskytter vote-ruter med autentisering
app.use("/users", userRouter);  // Beskytter user-ruter med autentisering

// Start serveren
app.listen(port, () => {
  console.log(`Serveren kjører på http://localhost:${port}`);
});
