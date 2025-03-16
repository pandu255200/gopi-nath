const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// ✅ FIXED: Proper CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://frontend-five-neon-91.vercel.app/'
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Routes
const couponRoutes = require('./routes/couponRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api', couponRoutes);
app.use('/api/admin', adminRoutes);

// ✅ MongoDB Connection
mongoose.connect('mongodb+srv://yeswanth:yeswanth@cluster0.3whyw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Start Server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
