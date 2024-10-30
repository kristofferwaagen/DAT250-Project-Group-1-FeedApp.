const mongoose = require('mongoose');
const { Schema } = mongoose;

const voteSchema = new Schema({
    publishedAt: {
        type: Date,
        required: true
    },
    voteOption: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'voteOption', 
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
    /*poll: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Poll', 
        required: true 
    }
    */
}, {timestamps: true});

module.exports = mongoose.model('Vote', voteSchema)
