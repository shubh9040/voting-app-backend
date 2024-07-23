const express = require("express");
const { signup, vote, getAllVoter } = require("../controllers/voterController");
const router = express.Router();

// Route: POST api/voter/signup - Sign-up voter
router.post("/signup", signup);
// Route: patch api/voter/vote - Voting voter
router.patch("/vote", vote);
// Route: GET api/voter/all-voter?isVoted=true/false - Get all voter list
router.get("/all-voter", getAllVoter);

module.exports = router;
