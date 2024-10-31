// controllers/VoteController.js
const VoteManager = require('../services/votemanager');
const voteManager = new VoteManager();

class VoteController {
    // GET: Hent alle votes for en spesifikk bruker
    async getUserVotes(req, res) {
        const username = req.params.username;
        try {
            const votes = await voteManager.getUserVotes(username);
            if (!votes) {
                return res.status(404).json({ message: 'User or votes not found' });
            }
            res.status(200).json(votes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET: Hent en spesifikk vote etter ID
    async getVoteById(req, res) {
        try {
            const vote = await voteManager.getVoteById(req.params.voteId);
            if (!vote) {
                return res.status(404).json({ message: 'Vote not found' });
            }
            res.status(200).json(vote);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // POST: Opprett en ny vote for en bruker
    async createVote(req, res) {
        const { userId, voteOptionId } = req.body; 
        try {
            const vote = await voteManager.createVote(userId, voteOptionId);
            res.status(201).json(vote);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // PUT: Oppdater en spesifikk vote etter ID
    async updateVote(req, res) {
        const { voteId } = req.params;
        const { publishedAt, voteOptionId } = req.body; // Også her bruker vi voteOptionId
        try {
            const updatedVote = await voteManager.updateVote(voteId, publishedAt, voteOptionId);
            if (!updatedVote) {
                return res.status(404).json({ message: 'Vote not found' });
            }
            res.status(200).json(updatedVote);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // DELETE: Slett alle votes for en bruker
    async deleteAllVotes(req, res) {
        const userId = req.params.userId;
        try {
            await voteManager.deleteAllVotesForUser(userId);
            res.status(200).json({ message: 'All votes deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // DELETE: Slett en spesifikk vote etter ID
    async deleteVote(req, res) {
        const { voteId } = req.params;
        try {
            const deletedVote = await voteManager.deleteVote(voteId);
            if (!deletedVote) {
                return res.status(404).json({ message: 'Vote not found' });
            }
            res.status(200).json({ message: 'Vote deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new VoteController();
