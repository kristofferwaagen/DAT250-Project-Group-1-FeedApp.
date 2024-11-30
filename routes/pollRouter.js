const express = require("express");
const router = express.Router();
const PollController = require("../controllers/pollController");
const cors = require("cors");
const authenticateJWT = require("../middleware/authenticateJWT");

// CORS-støtte for http://localhost:5173
router.use(cors({ origin: "http://localhost:5173" })); // Frontend kjører her?

router.get("/", (req, res) => PollController.getPolls(req, res)); // Public: Anyone can view polls
router.get("/:pollId", (req, res) => PollController.getPollById(req, res)); // Public: Anyone can view a specific poll

// Require authentication to create, update, or delete polls
router.post("/", authenticateJWT, (req, res) => PollController.createPoll(req, res));
router.put("/:pollId", authenticateJWT, (req, res) => PollController.updatePoll(req, res));
router.post("/:voteOptionId", authenticateJWT, (req, res) => PollController.updateVoteCount(req, res));
router.delete("/:pollId", authenticateJWT, (req, res) => PollController.deletePoll(req, res));
router.delete("/", authenticateJWT, (req, res) => PollController.deleteAllPolls(req, res));

module.exports = router;
