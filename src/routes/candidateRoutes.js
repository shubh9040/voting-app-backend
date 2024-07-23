const express = require("express");
const router = express.Router();
const {
  createCandidate,
  getCandidates,
} = require("../controllers/candidateController");

// Route: POST /api/candidates/create - Create a new candidate
router.post("/create", createCandidate);

// Route: GET /api/candidates/get-all - Get all candidates
router.get("/get-all", getCandidates);

module.exports = router;
