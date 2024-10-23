// routers/userRouter.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const cors = require('cors');

const authController = require('../controllers/authController');

// CORS-støtte for http://localhost:5173
router.use(cors({ origin: 'http://localhost:5173' })); // Frontend kjører her?

// Definer ruter og koble dem til UserController
router.get('/', (req, res) => UserController.getUsers(req, res));
router.get('/:username', (req, res) => UserController.getUserByUsername(req, res));
router.post('/', (req, res) => UserController.createUser(req, res));
router.put('/:username', (req, res) => UserController.updateUser(req, res));
router.delete('/:username', (req, res) => UserController.deleteUser(req, res));
router.delete('/', (req, res) => UserController.deleteAllUsers(req, res));

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
