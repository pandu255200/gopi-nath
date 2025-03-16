const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: String,
  password: String, // Hashed password
});

module.exports = mongoose.model('Admin', adminSchema);
