const express = require('express');
const Notification = require('../models/Notification');
const router = express.Router();

// Get notifications for a user (or by role)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching notifications for userId:', userId);
    const user = await require('../models/User').findById(userId);
    console.log('Fetched user:', user);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fetch notifications for user, their role, or global (no user/role)
    const notifications = await Notification.find({
      $or: [
        { user: userId },
        { role: user.role },
        { user: { $exists: false }, role: { $exists: false } }
      ]
    }).sort({ createdAt: -1 });
    console.log('Notifications found:', notifications);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
router.post('/read/:id', async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a notification (admin/faculty action)
router.post('/', async (req, res) => {
  try {
    const { user, role, title, message, link } = req.body;
    const notif = new Notification({ user, role, title, message, link });
    await notif.save();
    res.status(201).json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;