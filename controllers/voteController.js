// controllers/VoteController.js
const PollManager = require('../services/pollmanager');

class VoteController {
    constructor() {
        this.pollManager = new PollManager();
    }

    // GET: Hent alle brukernes votes
    async getUserVotes(req, res) {
        const username = req.params.username;
        const users = this.pollManager.getUsers();

        if (users.has(username)) {
            const user = users.get(username);
            const votes = user.votes;
            return res.status(200).json(votes);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    }

    // GET: Hent spesifikk vote etter ID
    async getVoteById(req, res) {
        const { username, voteId } = req.params;
        const users = this.pollManager.getUsers();

        if (users.has(username)) {
            const user = users.get(username);
            const votes = user.votes;

            if (voteId >= 0 && voteId < votes.length) {
                const vote = votes[voteId];
                return res.status(200).json(vote);
            }
            return res.status(404).json({ message: 'Vote not found' });
        }
        return res.status(404).json({ message: 'User not found' });
    }

    // POST: Opprett vote for bruker
    async createVote(req, res) {
        const username = req.params.username;
        const { publishedAt, voteOption } = req.body;
        const users = this.pollManager.getUsers();

        let user = users.get(username) || { username, votes: [] };

        const newVote = { publishedAt, voteOption };
        user.votes.push(newVote);
        users.set(username, user);

        return res.status(201).json(newVote);
    }

    // PUT: Oppdater en spesifikk vote etter ID
    async updateVote(req, res) {
        const username = req.params.username;
        const { voteId } = req.params; // Mangel på voteId her
        const { publishedAt, voteOption } = req.body;
        const users = this.pollManager.getUsers();

        if (users.has(username)) {
            const user = users.get(username);
            const votes = user.votes;

            if (voteId >= 0 && voteId < votes.length) {
                const updatedVote = { publishedAt, voteOption };
                votes[voteId] = updatedVote;
                return res.status(200).json(updatedVote);
            }
            return res.status(404).json({ message: 'Vote not found' });
        }
        return res.status(404).json({ message: 'User not found' });
    }

    // DELETE: Slett alle votes for en bruker
    async deleteAllVotes(req, res) {
        const username = req.params.username;
        const users = this.pollManager.getUsers();

        if (users.has(username)) {
            const user = users.get(username);
            user.votes = [];
            return res.status(200).json({ message: 'All votes deleted' });
        }
        return res.status(404).json({ message: 'User not found' });
    }

    // DELETE: Slett spesifikk vote etter ID
    async deleteVote(req, res) {
        const { username, voteId } = req.params;
        const users = this.pollManager.getUsers();

        if (users.has(username)) {
            const user = users.get(username);
            const votes = user.votes;

            if (voteId >= 0 && voteId < votes.length) {
                votes.splice(voteId, 1); // Sletter voten
                return res.status(200).json({ message: 'Vote deleted' });
            }
            return res.status(404).json({ message: 'Vote not found' });
        }
        return res.status(404).json({ message: 'User not found' });
    }
}

module.exports = new VoteController();
