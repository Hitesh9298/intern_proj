const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  rollno: { type: String }, // Only for students
  empid: { type: String },  // Only for faculty/admin
  department: { type: String },
  profileImage: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
