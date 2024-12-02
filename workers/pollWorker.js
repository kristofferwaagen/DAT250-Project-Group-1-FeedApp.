const amqp = require("amqplib");

const Poll = require("../models/poll");

async function consumePolls() {
    const maxRetries = 5; // Retry up to 5 times
    let retries = 0;

    while (retries < maxRetries) {
        try {
            console.log("Connecting to RabbitMQ for polls...");
            const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://rabbitmq");
            const channel = await connection.createChannel();
            const queue = "polls_queue";

            await channel.assertQueue(queue, { durable: true });
            console.log("Waiting for poll events in %s", queue);

            channel.consume(queue, async (msg) => {
                const pollEvent = JSON.parse(msg.content.toString());
                console.log("Received poll event:", pollEvent);

                switch (pollEvent.action) {
                    case "create":
                        console.log("Poll created:", pollEvent);
                        break;
                    case "update":
                        console.log("Poll updated:", pollEvent);
                        break;
                    case "delete":
                        console.log("Poll deleted:", pollEvent);
                        break;
                    case "deleteAll":
                        console.log("All polls deleted:", pollEvent);
                        break;
                    default:
                        console.log("Unknown poll event action:", pollEvent.action);
                        break;
                }
                channel.ack(msg);
            });

            break; // Exit retry loop if successful
        } catch (error) {
            retries++;
            console.error(`Error consuming poll events (attempt ${retries}):`, error);
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

module.exports = consumePolls;