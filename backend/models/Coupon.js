const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: String,
  isActive: { type: Boolean, default: true },
  claimed: { type: Boolean, default: false },
  claimedAt: Date,
  claimedBy: String, // Optional: User info / session ID
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
