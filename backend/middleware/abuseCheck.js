const Coupon = require('../models/Coupon');

const cooldownPeriod = 3600000; // 1 hour

module.exports = async (req, res, next) => {
  const ip = req.ip;
  const sessionId = req.cookies?.sessionId;

  const recentClaim = await Coupon.findOne({
    'claimedBy.ip': ip,
    'claimedBy.claimedAt': { $gt: new Date(Date.now() - cooldownPeriod) }
  });

  if (recentClaim) {
    return res.status(429).json({ message: 'You have already claimed a coupon recently. Please wait.' });
  }

  next();
};
