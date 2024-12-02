const amqp = require("amqplib");
const mongoose = require("mongoose");
const Vote = require("../models/vote");
const User = require("../models/user");
const VoteOption = require("../models/voteOption");

async function workVotes() {
    const maxRetries = 5; // Retry up to 5 times
    let retries = 0;

    while (retries < maxRetries) {
        try {
            console.log("Connecting to RabbitMQ for votes...");
            const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://rabbitmq");
            const channel = await connection.createChannel();
            const queue = "votes_queue";

            await channel.assertQueue(queue, { durable: true });
            console.log("Waiting for messages in %s", queue);

            channel.consume(queue, async (msg) => {
                try {
                    const voteData = JSON.parse(msg.content.toString());
                    console.log("Received vote:", voteData);

                    const user = await User.findOne({ username: voteData.username });
                    if (!user) {
                        console.error("User not found:", voteData.username);
                        return channel.nack(msg);
                    }

                    const voteOption = await VoteOption.findById(voteData.voteOption);
                    if (!voteOption) {
                        console.error("Vote option not found:", voteData.voteOption);
                        return channel.nack(msg);
                    }

                    const newVote = new Vote({
                        publishedAt: voteData.publishedAt,
                        voteOption: voteOption._id,
                        user: user._id,
                    });

                    await newVote.save();
                    console.log("Vote saved to database:", newVote);

                    channel.ack(msg);
                } catch (error) {
                    console.error("Error processing vote message:", error);
                    channel.nack(msg);
                }
            });

            break; // Exit retry loop if successful
        } catch (error) {
            retries++;
            console.error(`Error consuming votes (attempt ${retries}):`, error);
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

module.exports = workVotes;