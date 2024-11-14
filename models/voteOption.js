const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const voteOptionSchema = new Schema({
  caption: {
    type: String,
    required: true,
  },
  presentationOrder: {
    type: Number,
    required: true,
  },
  voteCount: {
    type: Number,
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model("VoteOption", voteOptionSchema);
