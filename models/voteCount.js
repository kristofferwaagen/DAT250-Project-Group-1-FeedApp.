const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const voteCountSchema = new Schema({
  count: {
    type: Number,
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model("VoteCount", voteCountSchema);
