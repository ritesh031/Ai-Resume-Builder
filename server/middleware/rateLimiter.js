const rateLimit = require('express-rate-limit');

const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: 'Too many AI requests. Please wait an hour.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { aiRateLimiter };
