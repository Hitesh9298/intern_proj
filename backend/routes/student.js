const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/attendance', authMiddleware, (req, res) => {
  // Example: return dummy attendance data
  res.json({ attendance: 92, total: 100, percentage: 92 });
});

module.exports = router;