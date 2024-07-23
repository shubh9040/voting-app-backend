const express = require('express');
const appRouter = express.Router();

const voterRoutes = require('./voterRoutes');
const candidateRoutes = require('./candidateRoutes');

// Routes
appRouter.use('/api/voter', voterRoutes);
appRouter.use('/api/candidates', candidateRoutes);

module.exports = appRouter;
