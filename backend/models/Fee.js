console.log('Loading Fee model');
const mongoose = require('mongoose');
const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Paid', 'Unpaid', 'Partial'], default: 'Unpaid' },
  amount: { type: Number, required: true },
  dueDate: Date,
  lastPaid: Date,
});
module.exports = mongoose.model('Fee', feeSchema);