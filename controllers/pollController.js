// controllers/PollController.js
const PollManager = require('../services/pollmanager');
const VoteOption = require('../models/voteOption');

class PollController {
    constructor() {
        this.pollManager = new PollManager();
    }

    // GET: Hent alle polls
    async getPolls(req, res) {
        try {
            const polls = await this.pollManager.getPolls();
            res.status(200).json(polls);
        } catch (error) {
            res.status(500).send('Error fetching polls');
        }
    }

    // GET: Hent en spesifikk poll etter ID
    async getPollById(req, res) {
        try {
            const poll = await this.pollManager.getPollsById(req.params.pollId);
            if (poll) {
                return res.status(200).json(poll);
            }
            res.status(404).send('Poll not found');
        } catch (error) {
            res.status(500).send('Error fetching poll');
        }
    }

    // POST: Opprett ny poll
    async createPoll(req, res) {
        const { question, publishedAt, validUntil, voteOptions } = req.body;

        if (!question || !publishedAt || !validUntil) {
            return res.status(400).send('Missing required fields');
        }

        try {
            console.log("Creating poll with data:", req.body);

            const voteOptionsDocs = await Promise.all(
                voteOptions.map(async (option, index) => {
                    const newOption = new VoteOption({
                        caption: option.caption,
                        presentationOrder: index
                    });
                    return await newOption.save();
                })
            );

            const newPoll = await this.pollManager.createPoll(
                question,
                publishedAt,
                validUntil,
                voteOptionsDocs.map(option => option._id)
            );

            res.status(201).json(newPoll);
        } catch (error) {
            res.status(500).send('Error creating poll');
        }
    }

    // PUT: Oppdater en poll etter ID
    async updatePoll(req, res) {
        const { question, publishedAt, validUntil, voteOptions } = req.body;

        try {
            const updatePoll = await this.pollManager.updatePoll(req.params.pollId, question, publishedAt, validUntil, voteOptions);
            if (updatePoll) {
                return res.status(200).json(updatePoll);
            }
            res.status(404).send('Poll not found');
        } catch (error) {
            res.status(500).send('Error updating poll');
        }
    }

    // DELETE: Slett en poll etter ID
    async deletePoll(req, res) {
        try {
            await this.pollManager.deletePoll(req.params.pollId);
            res.status(200).send('Poll deleted');
        } catch (error) {
            res.status(500).send('Error deleting poll');
        }
    }

    // DELETE: Slett alle polls
    async deleteAllPolls(req, res) {
        try {
            await this.pollManager.deleteAllPolls();
            res.status(200).send('All polls deleted');
        } catch (error) {
            res.status(500).send('Error deleting all polls');
        }
    }
}

module.exports = new PollController();
