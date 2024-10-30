const amqp = require('amqplib');
const mongoose = require('mongoose');
const Vote = require('../models/vote');
const User = require('../models/user');
const VoteOption = require('../models/voteOption');

mongoose.connect('mongodb://localhost:27017/pollApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function workVotes() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'votes_queue';

        await channel.assertQueue(queue, { durable: true });
        console.log('Waiting for messages in %s', queue);


        channel.consume(queue, async (msg) => {
            try {
                const voteData = JSON.parse(msg.content.toString());
                console.log('Received vote:', voteData);


                const user = await User.findOne({ username: voteData.username });
                if (!user) {
                    console.error('User not found:', voteData.username);
                    return channel.nack(msg); // Reject the message but don’t requeue
                }

                const voteOption = await VoteOption.findById(voteData.voteOption);
                if (!voteOption) {
                    console.error('Vote option not found:', voteData.voteOption);
                    return channel.nack(msg); // Reject the message but don’t requeue
                }


                const newVote = new Vote({
                    publishedAt: voteData.publishedAt,
                    voteOption: voteOption._id, // Reference to voteOption
                    user: user._id, // Reference to user
                });


                await newVote.save();
                console.log('Vote saved to database', newVote);


                channel.ack(msg);
            } catch (error) {
                console.error('Error processing or saving vote:', error);
                channel.nack(msg); // Reject the message if there's an error
            }
        });
    } catch (error) {
        console.error('Error consuming votes:', error);
    }
}


workVotes();
