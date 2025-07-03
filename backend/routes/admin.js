const express = require('express');
const Department = require('../models/Department');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Departments CRUD
router.get('/departments', async (req, res) => {
  const departments = await Department.find().populate('head', 'name email');
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

// Teachers CRUD
router.get('/teachers', async (req, res) => {
  const teachers = await User.find({ role: 'faculty' });
  res.json(teachers);
});
router.post('/teachers', async (req, res) => {
  const { name, email, password, empid, department } = req.body;
  const user = new User({ name, email, password, empid, department, role: 'faculty' });
  await user.save();
  res.json(user);
});
router.put('/teachers/:id', async (req, res) => {
  const { name, email, empid, department } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { name, email, empid, department }, { new: true });
  res.json(user);
});
router.delete('/teachers/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Students CRUD
router.get('/students', async (req, res) => {
  const students = await User.find({ role: 'student' });
  res.json(students);
});
router.post('/students', async (req, res) => {
  const { name, email, password, rollno, department } = req.body;
  const user = new User({ name, email, password, rollno, department, role: 'student' });
  await user.save();
  res.json(user);
});
router.put('/students/:id', async (req, res) => {
  const { name, email, rollno, department } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { name, email, rollno, department }, { new: true });
  res.json(user);
});
router.delete('/students/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Reports
router.get('/reports', async (req, res) => {
  const totalDepartments = await Department.countDocuments();
  const totalTeachers = await User.countDocuments({ role: 'faculty' });
  const totalStudents = await User.countDocuments({ role: 'student' });
  res.json({ totalDepartments, totalTeachers, totalStudents });
});

router.put('/reset-password/:id', async (req, res) => {
  const { password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(req.params.id, { password: hashed });
  res.json({ success: true });
});

module.exports = router;