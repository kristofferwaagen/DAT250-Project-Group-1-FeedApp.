//Mongoose virker direkte på MongoDB uten å måtte bruke SQL, lignende funksjoner her som i JPA
// services/pollmanager.js
const Poll = require('../models/poll');

class PollManager {
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
