const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: String,
  publishby: String,
  imageurl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('News', newsSchema);
