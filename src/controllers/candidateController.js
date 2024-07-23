const Candidate = require("../models/Candidate");

// Function to parse date string and handle time zone
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

// Create Candidate
exports.createCandidate = async (req, res) => {
  const { firstName, lastName, dateOfBirth } = req.body;
  console.log("dateOfBirth : ", dateOfBirth);
  try {
    const dob = parseDateString(dateOfBirth);
    const age = calculateAge(dob);

    if (age < 18) {
      return res.status(400).json({
        success: false,
        error: "Candidate must be at least 18 years old.",
      });
    }

    const candidate = await Candidate.create({
      firstName,
      lastName,
      dateOfBirth: dob,
    });
    res.status(201).json({
      success: true,
      message: "Candidate created successfully.",
      data: candidate,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// exports.getCandidates = async (req, res) => {
//   try {
//     const candidates = await Candidate.find();
//     res.status(200).json({ success: true, data: candidates });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();

    // Format the date to only include day, month, and year
    const formattedCandidates = candidates.map((candidate) => {
      const { _id, firstName, lastName, dateOfBirth, votes } = candidate;
      const formattedDateOfBirth = dateOfBirth
        ? new Date(dateOfBirth).toLocaleDateString("en-GB")
        : null; // Format date to dd/mm/yyyy
      return {
        _id,
        firstName,
        lastName,
        dateOfBirth: formattedDateOfBirth,
        votes,
      };
    });

    res.status(200).json({ success: true, data: formattedCandidates });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
