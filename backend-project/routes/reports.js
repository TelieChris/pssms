const express = require('express');
const router = express.Router();
const db = require('../config/db'); // your MySQL connection

// GET /api/reports/payments - fetch all payment reports
router.get('/payments', (req, res) => {
  const sql = `
    SELECT p.payment_id, p.amount_paid, p.payment_date,
           pr.entry_time, pr.exit_time,
           c.plate_number,
           ps.slot_number
    FROM payment p
    JOIN parkingrecord pr ON p.record_id = pr.record_id
    JOIN car c ON pr.car_id = c.car_id
    JOIN parkingslot ps ON pr.slot_id = ps.slot_id
    ORDER BY p.payment_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching payment reports:', err);
      return res.status(500).json({ error: 'Server error fetching payment reports' });
    }
    res.json(results);
  });
});

// Get payments for a specific day (daily report)
router.get('/payments/daily', (req, res) => {
    // Expect date as query param, e.g. ?date=2025-05-23
    const { date } = req.query;
  
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required (YYYY-MM-DD)' });
    }
  
    // Define start and end of the day for filtering
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
  
    const sql = `
      SELECT p.payment_id, p.record_id, p.amount_paid, p.payment_date,
             pr.entry_time, pr.exit_time, pr.duration, c.plate_number, ps.slot_number
      FROM payment p
      JOIN parkingrecord pr ON p.record_id = pr.record_id
      JOIN car c ON pr.car_id = c.car_id
      JOIN parkingslot ps ON pr.slot_id = ps.slot_id
      WHERE p.payment_date BETWEEN ? AND ?
      ORDER BY p.payment_date DESC
    `;
  
    db.query(sql, [startOfDay, endOfDay], (err, results) => {
      if (err) {
        console.error('Error fetching daily payments:', err);
        return res.status(500).json({ error: 'Server error fetching daily payments' });
      }
      res.json(results);
    });
  });
  

module.exports = router;
