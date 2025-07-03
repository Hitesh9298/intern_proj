require('./models/User');
require('./models/Attendance');
require('./models/Result');
require('./models/Notice');
require('./models/Fee');
require('./models/Timetable');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = mongoose.model('User');
const Attendance = mongoose.model('Attendance');
const Result = mongoose.model('Result');
const Notice = mongoose.model('Notice');
const Fee = mongoose.model('Fee');
const Timetable = mongoose.model('Timetable');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear old data
    await User.deleteMany({});
    await Attendance.deleteMany({});
    await Result.deleteMany({});
    await Notice.deleteMany({});
    await Fee.deleteMany({});
    await Timetable.deleteMany({});
    console.log('Cleared old data');

    // Create a student user
    const password = await bcrypt.hash('student123', 10);
    const student = await User.create({
      name: 'Hitesh',
      email: 'student@college.edu',
      password,
      role: 'student',
      rollno: '2023CS101',
      department: 'Computer Science'
    });
    console.log('Created student:', student.email);

    // Attendance
    await Attendance.create({
      student: student._id,
      total: 100,
      attended: 92
    });
    console.log('Created attendance');

    // Results
    await Result.create({
      student: student._id,
      semester: 'Spring 2024',
      cgpa: 8.7,
      subjects: [
        { name: 'Mathematics', grade: 'A', marks: 90 },
        { name: 'Physics', grade: 'B+', marks: 82 },
        { name: 'Computer Science', grade: 'A+', marks: 95 }
      ]
    });
    console.log('Created results');

    // Notices
    await Notice.create([
      { title: 'Exam Schedule', content: 'Mid-semester exams start from 10th May.', forRole: 'student' },
      { title: 'Fee Reminder', content: 'Pay your semester fees before 5th May.', forRole: 'student' },
      { title: 'Holiday Notice', content: 'College will remain closed on 1st May.', forRole: 'all' }
    ]);
    console.log('Created notices');

    // Fees
    await Fee.create({
      student: student._id,
      status: 'Paid',
      amount: 50000,
      dueDate: new Date('2024-05-05'),
      lastPaid: new Date('2024-04-20')
    });
    console.log('Created fee');

    // Create a faculty user
    const facultyPassword = await bcrypt.hash('faculty123', 10);
    const faculty = await User.create({
      name: 'Test Faculty',
      email: 'faculty@college.edu',
      password: facultyPassword,
      role: 'faculty',
      empid: 'EMP09',
      department: 'Computer Science'
    });
    console.log('Created faculty:', faculty.email);

    // Create demo timetable
    await Timetable.create([
      {
        faculty: faculty._id,
        day: 'Monday',
        slots: [
          { time: '09:00-10:00', subject: 'Mathematics', class: 'CS101' },
          { time: '11:00-12:00', subject: 'Physics', class: 'CS102' }
        ]
      },
      {
        faculty: faculty._id,
        day: 'Wednesday',
        slots: [
          { time: '10:00-11:00', subject: 'Mathematics', class: 'CS101' },
          { time: '13:00-14:00', subject: 'Computer Science', class: 'CS103' }
        ]
      }
    ]);
    console.log('Timetable seeded!');

    console.log('Seeding done!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();