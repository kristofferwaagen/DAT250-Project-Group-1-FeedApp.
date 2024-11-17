const PollManager = require("../services/pollManager");

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
  async incrementVoteCount(req, res) {
    const { voteOptionId } = req.params;

    try {
      const updatedOption = await this.pollManager.incrementVoteCount(
        voteOptionId
      );
      res.status(200).json(updatedOption);
    } catch (error) {
      res.status(500).send("Error updating vote count");
    }
  }

  // DELETE: Delete all polls
  async deleteAllPolls(req, res) {
    try {
      await this.pollManager.deleteAllPolls();
      res.status(200).send("Database cleared");
    } catch (error) {
      res.status(500).send("Error clearing database");
    }
  }
}

module.exports = new PollController();
