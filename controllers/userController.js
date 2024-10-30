// controllers/UserController.js
const UserManager = require('../services/usermanager');
const userManager = new UserManager();

class UserController {
    // GET: Alle brukere
    async getUsers(req, res) {
        try {
            const users = await userManager.getAllUsers();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching users' });
        }
    }

    // GET: Hent spesifikk bruker etter brukernavn
    async getUserByUsername(req, res) {
        try {
            const user = await userManager.getUserByUsername(req.params.username);
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
            const newUser = await userManager.createUser(req.body);
            res.status(201).json({ message: 'User created', user: newUser });
        } catch (err) {
            if (err.message === 'User already exists') {
                res.status(409).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Error creating user' });
            }
        }
    }

    // PUT: Oppdater bruker
    async updateUser(req, res) {
        try {
            const updatedUser = await userManager.updateUser(req.params.username, req.body);
            if (updatedUser) {
                res.status(200).json({ message: 'User updated', user: updatedUser });
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
            const deletedUser = await userManager.deleteUser(req.params.username);
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
            await userManager.deleteAllUsers();
            res.status(200).json({ message: 'All users deleted' });
        } catch (err) {
            res.status(500).json({ message: 'Error deleting all users' });
        }
    }
}

module.exports = new UserController();
