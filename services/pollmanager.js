//Mongoose virker direkte på MongoDB uten å måtte bruke SQL, lignende funksjoner her som i JPA
// services/pollmanager.js
const Poll = require("../models/poll");
const amqp = require("amqplib");
const VoteOption = require("../models/voteOption");

class PollManager {
  constructor() {
    this.queue = "votes_queue";
    this.pollQueue = "poll_queue";
    this.connection = null;
    this.channel = null;
    this.init();
  }
  //Setter opp rabbitmq conenction og kanal
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
  //Sender message til queuen
  async publishToQueue(queue, message) {
    try {
      if (!this.channel) {
        console.error("Rabbitmq channel is not initialized");
        return;
      }
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
      console.log("Message sent to rabbitmq queue (${queue}):", message);
    } catch (error) {
      console.error("Error publishing message:", error);
    }
  }

  // Hent alle polls fra databasen
  async getPolls() {
    return Poll.find().populate("voteOptions");
  }

  // Hent en spesifikk poll ved ID
  async getPollById(pollId) {
    return Poll.findById(pollId);
  }

  // Opprett ny poll i databasen
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

    return savedPoll;
  }

  // Oppdater en poll i databasen ved ID
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
      return updatedPoll;
    }
    return null;
  }

  async incrementVoteCount(voteOption) {
    const currentCount = voteOption.voteCount;
    const updatedCount = currentCount + 1;
    const updatedVoteOption = await VoteOption.updateOne({
      voteCount: updatedCount,
    });
    return updatedVoteOption;
  }

  // Slett en poll fra databasen ved ID
  async deletePoll(pollId) {
    const deletedPoll = await Poll.findByIdAndDelete(pollId);

    if (deletedPoll) {
      const pollData = {
        action: "delete",
        pollId: deltedPoll._id,
        question: deletedPoll.question,
      };
      await this.publishToQueue(this.pollQueue, pollData);
    }
    return deletedPoll;
  }

  // Slett alle polls fra databasen
  async deleteAllPolls() {
    const result = await Poll.deleteMany();

    await this.publishToQueue(this.pollQueue, { action: "deleteAll" });
    return result;
  }
}

// Eksporter klassen slik at den kan brukes andre steder
module.exports = PollManager;
