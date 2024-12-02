const Poll = require("../models/poll");
const amqp = require("amqplib");
const VoteOption = require("../models/voteOption");
const { synchronizeDatabase } = require("../setup/setup");

class PollManager {
  constructor() {
    this.queue = "votes_queue";
    this.pollQueue = "poll_queue";
    this.connection = null;
    this.channel = null;
    this.init();
  }

  // Initialize RabbitMQ connection
  async init() {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        console.log("Connecting to RabbitMQ...");
        this.connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://rabbitmq");
        this.channel = await this.connection.createChannel();

        await this.channel.assertQueue(this.queue, { durable: true });
        await this.channel.assertQueue(this.pollQueue, { durable: true });
        console.log("Connected to RabbitMQ.");
        break;
      } catch (error) {
        retries++;
        console.error(`Error connecting to RabbitMQ (attempt ${retries}):`, error);
        if (retries < maxRetries) {
          console.log("Retrying in 5 seconds...");
          await new Promise((resolve) => setTimeout(resolve, 5000));
        } else {
          console.error("Max retries reached for RabbitMQ connection. Exiting...");
          process.exit(1);
        }
      }
    }
  }

  // Publish message to RabbitMQ queue
  async publishToQueue(queue, message) {
    try {
      if (!this.channel) {
        console.error("RabbitMQ channel is not initialized.");
        return;
      }
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
      console.log(`Message sent to RabbitMQ queue (${queue}):`, message);
    } catch (error) {
      console.error("Error publishing message:", error);
    }
  }

  // Fetch all polls from the database
  async getPolls() {
    return Poll.find().populate("voteOptions");
  }

  // Fetch a specific poll by ID
  async getPollById(pollId) {
    return Poll.findById(pollId);
  }

  // Create a new poll in the database
  async createPoll(question, publishedAt, validUntil, voteOptions) {
    const newPoll = new Poll({
      question,
      publishedAt,
      validUntil,
      voteOptions,
    });
    const savedPoll = await newPoll.save();

    const pollData = {
      action: "create",
      pollId: savedPoll._id,
      question: savedPoll.question,
      publishedAt: savedPoll.publishedAt,
      validUntil: savedPoll.validUntil,
      voteOptions: savedPoll.voteOptions,
    };

    await this.publishToQueue(this.pollQueue, pollData);
    await synchronizeDatabase();

    return savedPoll;
  }

  // Update a poll by ID
  async updatePoll(pollId, question, publishedAt, validUntil, voteOptions) {
    const poll = await Poll.findById(pollId);
    if (poll) {
      poll.question = question;
      poll.publishedAt = publishedAt;
      poll.validUntil = validUntil;
      poll.voteOptions = voteOptions;

      const updatedPoll = await poll.save();

      const pollData = {
        action: "update",
        pollId: updatedPoll._id,
        question: updatedPoll.question,
        publishedAt: updatedPoll.publishedAt,
        validUntil: updatedPoll.validUntil,
        voteOptions: updatedPoll.voteOptions,
      };

      await this.publishToQueue(this.pollQueue, pollData);
      await synchronizeDatabase();

      return updatedPoll;
    }
    return null;
  }

  // Increment vote count for a specific vote option
  async incrementVoteCount(voteOption) {
    const updatedVoteOption = await VoteOption.findByIdAndUpdate(
        voteOption._id,
        { $inc: { voteCount: 1 } },
        { new: true }
    );
    return updatedVoteOption;
  }

  // Delete a poll by ID
  async deletePoll(pollId) {
    const deletedPoll = await Poll.findByIdAndDelete(pollId);

    if (deletedPoll) {
      const pollData = {
        action: "delete",
        pollId: deletedPoll._id,
        question: deletedPoll.question,
      };

      await this.publishToQueue(this.pollQueue, pollData);
      await synchronizeDatabase();
    }
    return deletedPoll;
  }

  // Delete all polls
  async deleteAllPolls() {
    const result = await Poll.deleteMany();

    await this.publishToQueue(this.pollQueue, { action: "deleteAll" });
    await synchronizeDatabase();

    return result;
  }
}

module.exports = PollManager;
