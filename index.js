// index.js

const express = require('express');
const mongoose = require('mongoose'); 
const pollRouter = require('./routes/PollRouter');
const voteRouter = require('./routes/voteRouter');
const userRouter = require('./routes/userRouter');
const cors = require('cors');
const postgresPool = require('./postgres');
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

app.use("/polls", pollRouter);
app.use("/votes", voteRouter);
app.use("/users", userRouter);

// Start serveren
app.listen(port, () => {
  console.log(`Serveren kjører på http://localhost:${port}`);
});
