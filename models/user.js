const mongoose = require('mongoose');
const {Schema } = mongoose;

//const VoteSchema = require('./vote');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    votes: [{
        type: mongoose.Schema.Types.ObjectId, //referanse til vote-skjemaet
        ref: 'vote',
        default: [], //default som tom array
    }]
});

module.exports = mongoose.model('User', userSchema);