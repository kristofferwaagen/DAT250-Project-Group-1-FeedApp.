const mongoose = require('mongoose');
const { Schema } = mongoose;

const voteSchema = new Schema({
    publishedAt: {
        type: Date,
        required: true
    },
    voteOption: {
        type: mongoose.Schema.Types.ObjectId, // Bruk ObjectId hvis det er en referanse til VoteOption
        ref: 'voteOption', 
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Vote', voteSchema)
