const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: String,
  publishby: String,
  imageurl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Gallery', gallerySchema);
