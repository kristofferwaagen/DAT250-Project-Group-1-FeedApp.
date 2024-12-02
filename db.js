const mongoose = require('mongoose');

async function connectToDatabase(){
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    }catch (error) {
        console.error('Error connectingto MongoDB:', error);
    }
}

module.exports = connectToDatabase;