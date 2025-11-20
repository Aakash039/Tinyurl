// models/Link.js
const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Za-z0-9]{6,8}$/
  },
  targetUrl: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  lastClickedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Link', linkSchema);
