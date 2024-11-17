const pgClient = require("../pollsDb");
const amqp = require("amqplib");

class PollManager {
  constructor() {
    this.queue = "votes_queue";
    this.pollQueue = "poll_queue";
    this.connection = null;
    this.channel = null;
    this.init();
  }

  async init() {
    try {
      this.connection = await amqp.connect("amqp://localhost");
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue(this.queue, { durable: true });
      await this.channel.assertQueue(this.pollQueue, { durable: true });
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
    }
  }

  async publishToQueue(queue, message) {
    try {
      if (!this.channel) {
        console.error("RabbitMQ channel is not initialized");
        return;
      }
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
      console.log(`Message sent to RabbitMQ queue (${queue}):`, message);
    } catch (error) {
      console.error("Error publishing message:", error);
    }
  }

  // Fetch all polls from PostgreSQL
  async getPolls() {
    try {
      const pollsResult = await pgClient.query("SELECT * FROM polls");
      const polls = pollsResult.rows;

      for (const poll of polls) {
        const optionsResult = await pgClient.query(
          "SELECT * FROM vote_options WHERE poll_id = $1 ORDER BY id",
          [poll.id]
        );
        poll.voteOptions = optionsResult.rows;
      }

      return polls;
    } catch (error) {
      console.error("Error fetching polls from PostgreSQL:", error);
      throw error;
    }
  }

  // Create a new poll in PostgreSQL
  async createPoll(question, publishedAt, validUntil, voteOptions) {
    try {
      const pollResult = await pgClient.query(
        "INSERT INTO polls (question, published_at, valid_until) VALUES ($1, $2, $3) RETURNING *",
        [question, publishedAt, validUntil]
      );
      const pollId = pollResult.rows[0].id;

      for (const option of voteOptions) {
        await pgClient.query(
          "INSERT INTO vote_options (poll_id, caption, vote_count) VALUES ($1, $2, $3)",
          [pollId, option.caption, 0]
        );
      }

      const pollData = {
        action: "create",
        pollId,
        question,
        publishedAt,
        validUntil,
        voteOptions,
      };
      await this.publishToQueue(this.pollQueue, pollData);

      return pollResult.rows[0];
    } catch (error) {
      console.error("Error creating poll in PostgreSQL:", error);
      throw error;
    }
  }

  // Increment vote count for a specific vote option in PostgreSQL
  async incrementVoteCount(optionId) {
    try {
      const result = await pgClient.query(
        "UPDATE vote_options SET vote_count = vote_count + 1 WHERE id = $1 RETURNING vote_count",
        [optionId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error updating vote count in PostgreSQL:", error);
      throw error;
    }
  }

  async deleteAllPolls() {
    try {
      // Clear all polls and reset IDs stored
      await pgClient.query(
        "TRUNCATE TABLE vote_options, polls RESTART IDENTITY CASCADE"
      );
      console.log("Database cleared");
    } catch (error) {
      console.error("Error clearing database:", error);
      throw error;
    }
  }
}

module.exports = PollManager;
