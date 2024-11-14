const mongoose = require("mongoose");
const { Schema } = mongoose;

const voteSchema = new Schema(
  {
    publishedAt: {
      type: Date,
      required: true,
    },
    voteOptionId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    /*poll: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Poll', 
        required: true 
    }
    */
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vote", voteSchema);
