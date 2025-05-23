const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Add a new parking slot
router.post('/', (req, res) => {
  const { slot_number, slot_status } = req.body;
  const sql = 'INSERT INTO parkingslot(slot_number, slot_status) VALUES (?, ?)';
  db.query(sql, [slot_number, slot_status], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Slot added successfully' });
  });
});

// Get all parking slots
router.get('/', (req, res) => {
  db.query('SELECT * FROM parkingSlot', (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

module.exports = router;
