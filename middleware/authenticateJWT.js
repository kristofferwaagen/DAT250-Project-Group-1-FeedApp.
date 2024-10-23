const jwt = require('express-jwt');

// Middleware for å beskytte ruter
const authenticateJWT = jwt({
    secret: 'your_jwt_secret', // Hemmeligheten brukt til å lage JWT
    algorithms: ['HS256'], // Algoritmen brukt
    requestProperty: 'user', // Setter den dekodede tokenen til req.user
});

module.exports = authenticateJWT;