const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create new car
router.post('/', (req, res) => {
  const { plateNumber, driverName, phoneNumber } = req.body;
  const sql = 'INSERT INTO car (plate_number,driver_name,phone_number) VALUES (?, ?, ?)';
  db.query(sql, [plateNumber, driverName, phoneNumber], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Car added successfully' });
  });
});

// Get all cars
router.get('/', (req, res) => {
  db.query('SELECT * FROM car', (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

module.exports = router;
