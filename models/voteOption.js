const mongoose = require('mongoose');

const voteOptionSchema = new Schema({
    caption: {
        type: String,
        required: true
    },
    presentationOrder: {
        type: Number, 
        required: true
    }
});

module.exports = mongoose.model('VoteOption', voteOptionSchema)