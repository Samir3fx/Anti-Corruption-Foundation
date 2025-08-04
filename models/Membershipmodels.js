// models/Membership.js
const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  name: String,
  father_spouse_name: String,
  gender: String,
  dob: String,
  email: String,
  mobile: String,
  aadhar: String,
  image: String,
  member: String,
  amount: Number,
  address: String,
  enrollmentNo: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Membership', membershipSchema);
