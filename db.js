const mongoose = require('mongoose');

async function connectToDatabase(){
    try {
        await mongoose.connect('mongodb://localhost:27017/feedAppDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    }catch (error) {
        console.error('Error connectingto MongoDB:', error);
    }
}

module.exports = connectToDatabase;