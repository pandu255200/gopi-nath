const express = require('express');
const router = express.Router();
// const Admin = require('../models/Admin')
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const Coupon = require('../models/Coupon'); // <-- Add this line!



// Register Admin (Only once — or pre-seed manually)
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, password: hash });
    await admin.save();
    res.json({ success: true });
});

// Login Admin
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password)))
        return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, 'secretkey', { expiresIn: '1d' });
    res.json({ token });
});

// routes/adminRoutes.js or wherever your route is
// ✅ Clean & safer toggle route (NO findById, NO coupon.save, NO coupon.code error)
router.put('/admin/toggle/:id', authMiddleware, async (req, res) => {
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            { $bit: { isActive: { xor: 1 } } }, // ✅ bitwise toggle
            { new: true, runValidators: false }
        );

        if (!updatedCoupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.json({ success: true, coupon: updatedCoupon });
    } catch (err) {
        console.error('Toggle error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router; // ✅ correct!
