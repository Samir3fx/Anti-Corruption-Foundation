// models/Complaint.js
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  name: String,
  father_spouse_name: String,
  gender: String,
  dob: String,
  email: String,
  mobile: String,
  image: String,
  address: String,
  complain: String,
  complaintNo: String,
  status: {
    type: String,
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
