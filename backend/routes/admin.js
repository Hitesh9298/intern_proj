const express = require('express');
const Department = require('../models/Department');
const User = require('../models/User');
const router = express.Router();

// Departments CRUD
router.get('/departments', async (req, res) => {
  const departments = await Department.find().populate('head');
  res.json(departments);
});
router.post('/departments', async (req, res) => {
  const { name, head } = req.body;
  const dept = new Department({ name, head });
  await dept.save();
  res.json(dept);
});
router.put('/departments/:id', async (req, res) => {
  const { name, head } = req.body;
  const dept = await Department.findByIdAndUpdate(req.params.id, { name, head }, { new: true });
  res.json(dept);
});
router.delete('/departments/:id', async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Similar CRUD for teachers and students...

module.exports = router;