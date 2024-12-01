// services/VoteManager.js
const Vote = require("../models/vote");
const User = require("../models/user");

class VoteManager {
  // Hent alle votes for en spesifikk bruker
  async getUserVotes(username) {
    const user = await User.findOne({ username }).populate("votes");
    return user ? user.votes : null;
  }

  // Hent en spesifikk vote etter ID
  async getVoteById(voteId) {
    return await Vote.findById(voteId)
      .populate({
        path: "voteOption",
        populate: {
          path: "poll", // Få tilgang til tilhørende Poll via VoteOption
          model: "Poll",
        },
      })
      .populate("user"); // Henter også brukerdata
  }

  // Opprett en ny vote for en spesifikk bruker og VoteOption
  async createVote(username, voteOptionId) {
    console.log("Creating vote for user:", username, "with option ID:", voteOptionId);
    const newVote = new Vote({
      username: username,
      voteOptionId: voteOptionId,
      publishedAt: Date.now(),
    });
    console.log(newVote);
    return await newVote.save();
  }

  // Oppdater en spesifikk vote
  async updateVote(voteId, publishedAt, voteOptionId) {
    return await Vote.findByIdAndUpdate(
      voteId,
      { publishedAt, voteOption: voteOptionId },
      { new: true }
    );
  }

  // Slett alle votes for en spesifikk bruker
  async deleteAllVotesForUser(userId) {
    return await Vote.deleteMany({ user: userId });
  }

  // Slett en spesifikk vote etter ID
  async deleteVote(voteId) {
    return await Vote.findByIdAndDelete(voteId);
  }
}

module.exports = VoteManager;
