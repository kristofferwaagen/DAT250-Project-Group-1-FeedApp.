// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Importer User-modellen

class AuthController {
    // POST: Bruker innlogging
    async login(req, res) {
        const { username, email } = req.body;  // Vi bruker både username og email

        try {
            // Finn bruker basert på username eller email
            const user = await User.findOne({
                $or: [
                    { username },  // Sjekk etter username
                    { email }      // Eller etter email
                ]
            });

            if (!user) return res.status(404).json({ message: 'User not found' });

            // Opprett JWT-token
            const token = jwt.sign(
                { id: user._id, username: user.username, email: user.email }, // Legg til informasjonen fra bruker i tokenet
                'your_jwt_secret', // Husk å bytte ut med en mer sikker hemmelighet i produksjon
                { expiresIn: '1h' } // Tokenet utløper etter 1 time
            );

            // Send tilbake tokenet til klienten
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    // POST: Registrering av bruker
    async register(req, res) {
        const { username, email } = req.body; // Bruker både username og email

        try {
            // Sjekk om brukernavnet eller e-posten allerede er i bruk
            const existingUser = await User.findOne({
                $or: [
                    { username },  // Sjekk etter eksisterende username
                    { email }      // Sjekk etter eksisterende email
                ]
            });
            if (existingUser) {
                return res.status(400).json({ message: 'Username or email is already taken' });
            }

            // Opprett en ny bruker uten passord
            const newUser = new User({
                username,
                email,
            });

            await newUser.save(); // Lagre den nye brukeren i databasen

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
}

module.exports = new AuthController();
