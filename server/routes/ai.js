const express = require('express');
const router = express.Router();
const { tailorResume } = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');
const { aiRateLimiter } = require('../middleware/rateLimiter');

router.post('/tailor', authMiddleware, aiRateLimiter, tailorResume);

module.exports = router;
