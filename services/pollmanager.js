const Poll = require("../models/poll");
const amqp = require("amqplib");
const VoteOption = require("../models/voteOption");
const pgClient = require("../setup/postgresClient"); // PostgreSQL client

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
      console.error("Error connecting to Rabbitmq:", error);
    }
  }

  async publishToQueue(queue, message) {
    try {
      if (!this.channel) {
        console.error("Rabbitmq channel is not initialized");
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

  async getPolls() {
    const polls = await Poll.find().populate("voteOptions");
    return polls;
  }

  async getPollById(pollId) {
    return Poll.findById(pollId);
  }

  async createPoll(question, publishedAt, validUntil, voteOptions) {
    const newPoll = new Poll({
      question,
      publishedAt,
      validUntil,
      voteOptions,
    });
    const savedPoll = await newPoll.save();

    try {
      const pollResult = await pgClient.query(
        "INSERT INTO polls (id, question, published_at, valid_until) VALUES ($1, $2, $3, $4) RETURNING id",
        [savedPoll._id.toString(), question, publishedAt, validUntil]
      );
      const pollId = pollResult.rows[0].id;

      for (const option of voteOptions) {
        await pgClient.query(
          "INSERT INTO vote_options (poll_id, caption, vote_count) VALUES ($1, $2, $3)",
          [pollId, option.caption, 0]
        );
      }
    } catch (error) {
      console.error("Error creating poll in PostgreSQL:", error);
    }

    const pollData = {
      action: "create",
      pollId: savedPoll._id,
      question: savedPoll.question,
      publishedAt: savedPoll.publishedAt,
      validUntil: savedPoll.validUntil,
      voteOptions: savedPoll.voteOptions,
    };
    await this.publishToQueue(this.pollQueue, pollData);
    return savedPoll;
  }

  async updatePoll(pollId, question, publishedAt, validUntil, voteOptions) {
    const poll = await Poll.findById(pollId);
    if (poll) {
      poll.question = question;
      poll.publishedAt = publishedAt;
      poll.validUntil = validUntil;
      poll.voteOptions = voteOptions;
      const updatedPoll = await poll.save();

      try {
        await pgClient.query(
          "UPDATE polls SET question = $1, published_at = $2, valid_until = $3 WHERE id = $4",
          [question, publishedAt, validUntil, pollId.toString()]
        );
        await pgClient.query("DELETE FROM vote_options WHERE poll_id = $1", [
          pollId.toString(),
        ]);
        for (const option of voteOptions) {
          await pgClient.query(
            "INSERT INTO vote_options (poll_id, caption, vote_count) VALUES ($1, $2, $3)",
            [pollId.toString(), option.caption, option.voteCount || 0]
          );
        }
      } catch (error) {
        console.error("Error updating poll in PostgreSQL:", error);
      }

      return updatedPoll;
    }
    return null;
  }

  async incrementVoteCount(voteOption) {
    const currentCount = voteOption.voteCount;
    const updatedCount = currentCount + 1;
    const updatedVoteOption = await VoteOption.findByIdAndUpdate(
      voteOption._id,
      { voteCount: updatedCount }
    );

    try {
      await pgClient.query(
        "UPDATE vote_options SET vote_count = vote_count + 1 WHERE id = $1",
        [voteOption._id.toString()]
      );
    } catch (error) {
      console.error("Error incrementing vote count in PostgreSQL:", error);
    }

    return updatedVoteOption;
  }

  async deletePoll(pollId) {
    const deletedPoll = await Poll.findByIdAndDelete(pollId);

    if (deletedPoll) {
      try {
        await pgClient.query("DELETE FROM polls WHERE id = $1", [
          pollId.toString(),
        ]);
      } catch (error) {
        console.error("Error deleting poll in PostgreSQL:", error);
      }
    }
    return deletedPoll;
  }

  async deleteAllPolls() {
    const result = await Poll.deleteMany();
    try {
      await pgClient.query(
        "TRUNCATE TABLE vote_options, polls RESTART IDENTITY CASCADE"
      );
    } catch (error) {
      console.error("Error deleting all polls in PostgreSQL:", error);
    }
    return result;
  }
}

module.exports = PollManager;
