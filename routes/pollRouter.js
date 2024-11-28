const express = require("express");
const router = express.Router();
const PollController = require("../controllers/pollController");
const cors = require("cors");

// CORS-støtte for http://localhost:5173
router.use(cors({ origin: "http://localhost:5173" })); // Frontend kjører her?

// Definer ruter og koble dem til kontrolleren
router.get("/", (req, res) => PollController.getPolls(req, res)); // Alle kan lese polls (åpent)
router.get("/:pollId", (req, res) => PollController.getPollById(req, res)); // Alle kan lese polls (åpent)

// Beskytt ruter som krever autentisering (kun autentiserte brukere kan opprette, oppdatere eller slette polls)
router.post("/", (req, res) => PollController.createPoll(req, res)); // Kun autentiserte brukere kan opprette polls
router.put("/:pollId", (req, res) => PollController.updatePoll(req, res)); // Kun autentiserte brukere kan oppdatere polls
router.post("/:voteOptionId", (req, res) => PollController.updateVoteCount(req, res)); // Kun autentiserte brukere kan stemme
router.delete("/:pollId", (req, res) => PollController.deletePoll(req, res)); // Kun autentiserte brukere kan slette polls
router.delete("/", (req, res) => PollController.deleteAllPolls(req, res)); // Kun autentiserte brukere kan slette alle polls

module.exports = router;
