const amqp = require('amqplib');
const Poll = require('../models/poll');

async function consumePolls(){
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'polls_queue';

        await channel.assertQueue(queue, {durable: true});
        console.log('Waiting for poll events in %s', queue);

        channel.consume(queue, async (msg) => {
            const pollEvent = JSON.parse(msg.content.toString());
            console.log('Received poll event:', pollEvent);


            switch (pollEvent.action) {
                case 'create':
                    console.log('Poll created;', pollEvent);
                    break;
                case 'update':
                    console.log('Poll updated:', pollEvent);
                    break;
                case 'delete':
                    console.log('Poll deleted:', pollEvent);
                    break;
                case 'deleteAll':
                    console.log('All polls deleted:', pollEvent);
                    break;
                default:
                    console.log('Unknown poll event action:', pollEvent.action);
                    break;

            }
            channel.ack(msg);
         });
    } catch(error){
        console.error('Error consuming poll events:', error);
    }
}

consumePolls();