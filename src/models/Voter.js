const mongoose = require("mongoose");

const VoterSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  isVoted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("Voter", VoterSchema);
