const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const cors = require("cors");

router.use(cors({ origin: "http://localhost:5173" }));

// Ruter uten autentisering
router.post("/login", AuthController.login);  // Bruk login-metoden fra AuthController
router.post("/register", AuthController.register);  // Bruk register-metoden fra AuthController

module.exports = router;
