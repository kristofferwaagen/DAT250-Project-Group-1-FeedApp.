// models/poll.js
const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: Date,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  voteOptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VoteOption",
    },
  ],
});

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
