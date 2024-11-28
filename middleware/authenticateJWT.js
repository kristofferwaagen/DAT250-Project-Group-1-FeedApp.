const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    // Hent token fra headers
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Token received:', token);  // Debugging: Sjekk om token blir hentet

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Verifiser tokenet
        console.log('Decoded token:', decoded);  // Debugging: Sjekk om dekodingen er vellykket
        req.user = decoded;  // Legg dekodet data på request-objektet
        next();  // Fortsett til neste middleware eller rute
    } catch (error) {
        console.log('Token verification failed:', error);  // Debugging: Logging feilmelding
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateJWT;
