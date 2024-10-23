// controllers/UserController.js
const User = require('../models/user');

class UserController {
    // GET: Alle brukere
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching users' });
        }
    }

    // GET: Hent spesifikk bruker etter brukernavn
    async getUserByUsername(req, res) {
        try {
            const user = await User.findOne({ username: req.params.username });
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Error fetching user' });
        }
    }

    // POST: Opprett bruker
    async createUser(req, res) {
        try {
            const existingUser = await User.findOne({ username: req.body.username });
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists' });
            }
            // Ellers lage en ny bruker
            const newUser = new User(req.body);
            await newUser.save();
            res.status(201).json({ message: 'User created' });
        } catch (err) {
            res.status(500).json({ message: 'Error creating user' });
        }
    }

    // PUT: Oppdater bruker
    async updateUser(req, res) {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { username: req.params.username },
                req.body,
                { new: true }
            );
            if (updatedUser) {
                res.status(200).json({ message: 'User updated' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Error updating user' });
        }
    }

    // DELETE: Slett bruker
    async deleteUser(req, res) {
        try {
            const deletedUser = await User.findOneAndDelete({ username: req.params.username });
            if (deletedUser) {
                res.status(200).json({ message: 'User deleted' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Error deleting user' });
        }
    }

    // DELETE: Slett alle brukere
    async deleteAllUsers(req, res) {
        try {
            await User.deleteMany();
            res.status(200).json({ message: 'All users deleted' });
        } catch (err) {
            res.status(500).json({ message: 'Error deleting all users' });
        }
    }
}

module.exports = new UserController();
