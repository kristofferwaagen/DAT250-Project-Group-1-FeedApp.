//Mongoose virker direkte på MongoDB uten å måtte bruke SQL, lignende funksjoner her som i JPA
// services/pollmanager.js
const Poll = require('../models/poll');
const amqp = require('amqplib');

class PollManager {
    constructor() {
        this.queue = 'votes_queue';
        this.connection = null;
        this.channel = null;
        this.init();

    }
    //Setter opp rabbitmq conenction og kanal
    async init(){
        try{
            this.connection = await amqp.connect('amqp://localhost';)
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(this.queue, {durable: true});

        } catch (error){
            console.error('Error connecting to Rabbitmq:', error);
        }
    }
    //Sender message til queuen
    async publishToQueue(message){
        try{
            if(!this.channel){
                console.error('Rabbitmq channel is not initialized');
                return;
            }
            this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), {persistent: true});
            console.log('Message sent to rabbitmq:', message);

        }catch (error){
            console.error('Error publishing message:', error);
        }
    }


    // Hent alle polls fra databasen
    async getPolls() {
        return await Poll.find();
    }

    // Hent en spesifikk poll ved ID
    async getPollById(pollId) {
        return await Poll.findById(pollId);
    }

    // Opprett ny poll i databasen
    async createPoll(question, publishedAt, validUntil, voteOptions) {
        const newPoll = new Poll({
            question,
            publishedAt,
            validUntil,
            voteOptions,
        });
        return await newPoll.save();
    }

    // Oppdater en poll i databasen ved ID
    async updatePoll(pollId, question, publishedAt, validUntil, voteOptions) {
        const poll = await Poll.findById(pollId);
        if (poll) {
            poll.question = question;
            poll.publishedAt = publishedAt;
            poll.validUntil = validUntil;
            poll.voteOptions = voteOptions;

            return await poll.save();
        }
        return null; // Returner null hvis poll ikke ble funnet
    }

    // Slett en poll fra databasen ved ID
    async deletePoll(pollId) {
        return await Poll.findByIdAndDelete(pollId);
    }

    // Slett alle polls fra databasen
    async deleteAllPolls() {
        return await Poll.deleteMany();
    }
}

// Eksporter klassen slik at den kan brukes andre steder
module.exports = PollManager; 
