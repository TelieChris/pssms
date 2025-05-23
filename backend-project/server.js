const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set true only if using HTTPS
}));

app.use('/api/auth', authRoutes);
const carRoutes = require('./routes/carRoutes');
app.use('/api/car', carRoutes);
const slotRoutes = require('./routes/slotRoutes');
app.use('/api/parkingSlot', slotRoutes);
const recordRoutes = require('./routes/recordRoutes');
app.use('/api/parkingRecord', recordRoutes);
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);
const reportRoutes = require('./routes/reports');
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
