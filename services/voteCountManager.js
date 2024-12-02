const { Client } = require('pq');

class voteManager{
    constructor() {
        this.pgClient = new Client({
            user: 'your_user',
            host: 'postgres',
            database: 'your_database',
            password: 'your_password',
            port: 5432,
        });

        this.init();
    }

    //Koble til PostgreSQL
    async init() {
        try{
            await this.pgClient.connect();
        }catch (error){
            console.error('Error connecting to PostgresSQL:', error);
        }
    }

    //Lukk PostgreSQL-forbindelsen
    async close() {
        await this.pgClient.end();
    }

    // Oppdater stemmetelling for en spesifikk vote option i PostgreSQL
    async updateVoteCount(optionId) {
        try {
            await this.pgClient.query(
                `UPDATE vote_options SET vote_count = vote_count + 1 WHERE id = $1`,
                [optionId]
            );
            console.log(`Vote count updated for option with id ${optionId}`);
        } catch (error) {
            console.error('Error updating vote count in PostgreSQL:', error);
        }
    }
}

module.exports = VoteCountManager;