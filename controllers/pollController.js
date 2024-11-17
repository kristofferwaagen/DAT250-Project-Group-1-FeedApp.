const PollManager = require("../services/pollmanager");

class PollController {
  constructor() {
    this.pollManager = new PollManager();
  }

  // GET: Fetch all polls from PostgreSQL
  async getPolls(req, res) {
    try {
      const polls = await this.pollManager.getPolls();
      res.status(200).json(polls);
    } catch (error) {
      res.status(500).send("Error fetching polls");
    }
  }

  // GET: Fetch a specific poll by ID (PostgreSQL for polls)
  async getPollById(req, res) {
    const pollId = req.params.pollId;
    try {
      const poll = await this.pollManager.getPollById(pollId);
      if (poll) {
        return res.status(200).json(poll);
      }
      res.status(404).send("Poll not found");
    } catch (error) {
      res.status(500).send("Error fetching poll");
    }
  }

  // POST: Create a new poll in PostgreSQL
  async createPoll(req, res) {
    const { question, publishedAt, validUntil, voteOptions } = req.body;

    if (!question || !publishedAt || !validUntil || !voteOptions) {
      return res.status(400).send("Missing required fields");
    }

    try {
      const newPoll = await this.pollManager.createPoll(
        question,
        publishedAt,
        validUntil,
        voteOptions
      );
      res.status(201).json(newPoll);
    } catch (error) {
      res.status(500).send("Error creating poll");
    }
  }

  // POST: Update vote count for a specific vote option in PostgreSQL
  async updateVoteCount(req, res) {
    const { voteOptionId } = req.params;

    try {
      await this.pollManager.incrementVoteCount(voteOptionId);
      res.status(200).send("Vote count updated");
    } catch (error) {
      res.status(500).send("Error updating vote count");
    }
  }

  // DELETE: Delete a poll (kept using MongoDB for compatibility)
  async deletePoll(req, res) {
    try {
      await this.pollManager.deletePoll(req.params.pollId);
      res.status(200).send("Poll deleted");
    } catch (error) {
      res.status(500).send("Error deleting poll");
    }
  }

  // DELETE: Delete all polls (kept using MongoDB for compatibility)
  async deleteAllPolls(req, res) {
    try {
      await this.pollManager.deleteAllPolls();
      res.status(200).send("All polls deleted");
    } catch (error) {
      res.status(500).send("Error deleting all polls");
    }
  }
}

module.exports = new PollController();
