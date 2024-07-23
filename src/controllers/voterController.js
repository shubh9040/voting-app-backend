const Voter = require("../models/Voter");
const dotenv = require("dotenv");
const Candidate = require("../models/Candidate");

dotenv.config();

// Function to parse date string in yyyy-mm-dd format
const parseDateString = (dateString) => {
  return new Date(dateString); // No need for manual parsing; JavaScript handles yyyy-mm-dd format natively
};

// Function to calculate age
const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

// Voter Signup
exports.signup = async (req, res) => {
  const { firstName, lastName, dateOfBirth } = req.body;
  console.log("dateOfBirth : ", dateOfBirth);

  try {
    const dob = parseDateString(dateOfBirth);
    const age = calculateAge(dob);

    if (age < 18) {
      return res.status(400).json({
        success: false,
        error: "Voter must be at least 18 years old.",
      });
    }

    const user = await Voter.create({ firstName, lastName, dateOfBirth: dob });
    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.vote = async (req, res) => {
  const { voterId, candidateId } = req.body;
  try {
    const voter = await Voter.findById(voterId);
    const candidate = await Candidate.findById(candidateId);
    if (!voter) {
      return res
        .status(404)
        .json({ success: false, error: "Voter not found." });
    }

    if (!candidate) {
      return res
        .status(404)
        .json({ success: false, error: "Candidate not found." });
    }

    if (voter.isVoted) {
      return res.status(409).json({ success: false, error: "Already voted." });
    }
    voter.isVoted = true;
    candidate.votes = candidate.votes + 1;
    await voter.save();
    await candidate.save();
    res.status(200).json({ success: true, message: "Voted successfully." });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllVoter = async (req, res) => {
  try {
    const isVoted = req.query.isVoted;
    let query = {};
    if (isVoted === "true") {
      query.isVoted = true;
    } else if (isVoted === "false") {
      query.isVoted = false;
    }
    
    const voters = await Voter.find(query);
    
    // Format the date to only include day, month, and year
    const formattedVoters = voters.map(voter => {
      const { _id, firstName, lastName, dateOfBirth, isVoted } = voter;
      const formattedDateOfBirth = new Date(dateOfBirth).toLocaleDateString('en-GB'); // Format date to dd/mm/yyyy
      return {
        _id,
        firstName,
        lastName,
        dateOfBirth: formattedDateOfBirth,
        isVoted,
      };
    });

    if (formattedVoters.length === 0) {
      res.status(404).json({ success: false, data: [] });
    } else {
      res.status(200).json({ success: true, data: formattedVoters });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
