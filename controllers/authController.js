const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); //user modellen

class AuthController {
    //POST: Bruker innlogging
    async login(req,res){
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ username });
            if(!user) return res.status(404).json({ message: 'User not found' });

            const isMatch = await bcrypt.compare(password, user.password);
            if(!match) return res.status(400).json({ message: 'Invalid credentials' });

            // Opprett JWT-token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                'your_jwt_secret',
                { expiresIn: '1h'}
            );

            res.status(200).json({ token });
        }catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }

    // POST: Registrering av bruker
    async register(req, res) {
        const {  username, password, role } = req.body;
        try{
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                password: hashedPassword,
                role: role || 'user' // Standardrolle hvis ikke spesifisert
            });

            await newUser.save();
            res.status(201).json({ message: 'User registered' });
        }catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new AuthController();