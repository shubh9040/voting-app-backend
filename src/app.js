const express = require("express");
const connectDB = require("./config/db");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());


// Routes
const appRouter = require("./routes/appRouter"); // Ensure the correct path
app.use(appRouter);

module.exports = app;
