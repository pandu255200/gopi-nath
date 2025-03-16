const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const authMiddleware = require('../middleware/authMiddleware');

// USER: Claim Coupon (no login)
// USER: Claim Coupon (no login required)
router.post('/claim', async (req, res) => {
    try {
        // Find the first unclaimed and active coupon (Round-Robin style)
        const coupon = await Coupon.findOne({ isActive: true, claimed: false }).sort({ createdAt: 1 });

        if (!coupon) {
            return res.status(404).json({ message: 'No active coupons available at the moment.' });
        }

        // Mark coupon as claimed
        coupon.claimed = true;
        coupon.claimedAt = new Date(); // Optional: add a timestamp
        await coupon.save();

        res.json({ success: true, coupon });
    } catch (err) {
        console.error('Error claiming coupon:', err);
        res.status(500).json({ message: 'Server error while claiming coupon.' });
    }
});


// ADMIN: View All Coupons
router.get('/admin/coupons', authMiddleware, async (req, res) => {
    const coupons = await Coupon.find();
    res.json(coupons);
});

// ADMIN: Add Coupon
router.post('/admin/add', authMiddleware, async (req, res) => {
    const { code } = req.body;
    const newCoupon = new Coupon({ code });
    await newCoupon.save();
    res.json({ success: true });
});

// ADMIN: Toggle Availability
router.put('/admin/toggle/:id', authMiddleware, async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ error: 'Coupon not found' });

        coupon.isActive = !coupon.isActive;
        await coupon.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Toggle Error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});


// ADMIN: Claim History
router.get('/admin/claims', authMiddleware, async (req, res) => {
    const claimedCoupons = await Coupon.find({ claimed: true });
    res.json(claimedCoupons);
});

module.exports = router;
