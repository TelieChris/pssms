const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all payments with related parking record info
router.get('/', (req, res) => {
  const sql = `
    SELECT p.payment_id, p.record_id, p.amount_paid, p.payment_date,
           pr.entry_time, pr.exit_time, c.plate_number, ps.slot_number
    FROM payment p
    JOIN parkingrecord pr ON p.record_id = pr.record_id
    JOIN car c ON pr.car_id = c.car_id
    JOIN parkingslot ps ON pr.slot_id = ps.slot_id
    ORDER BY p.payment_date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching payments:', err);
      return res.status(500).json({ error: 'Server error fetching payments' });
    }
    res.json(results);
  });
});

// Get a payment by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT p.payment_id, p.record_id, p.amount_paid, p.payment_date,
           pr.entry_time, pr.exit_time, c.plate_number, ps.slot_number
    FROM payment p
    JOIN parkingrecord pr ON p.record_id = pr.record_id
    JOIN car c ON pr.car_id = c.car_id
    JOIN parkingslot ps ON pr.slot_id = ps.slot_id
    WHERE p.payment_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching payment:', err);
      return res.status(500).json({ error: 'Server error fetching payment' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(results[0]);
  });
});

// Create a new payment
// Create a new payment
router.post('/', (req, res) => {
    const { record_id, payment_date, amount_per_hour } = req.body;
  
    if (!record_id || !amount_per_hour) {
      return res.status(400).json({ error: 'record_id and amount_per_hour are required' });
    }
  
    const paymentDate = payment_date ? new Date(payment_date) : new Date();
  
    // Step 1: Get entry_time and slot_id from parkingrecord
    const getEntrySql = 'SELECT entry_time, slot_id FROM parkingrecord WHERE record_id = ?';
    db.query(getEntrySql, [record_id], (err, results) => {
      if (err) {
        console.error('Error fetching entry_time:', err);
        return res.status(500).json({ error: 'Error fetching entry_time' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Parking record not found' });
      }
  
      const entry_time = new Date(results[0].entry_time);
      const slot_id = results[0].slot_id;
      const exit_time = paymentDate;
  
      const durationHours = Math.max(0, (exit_time - entry_time) / (1000 * 60 * 60));
      const roundedDuration = Math.ceil(durationHours); // Round up to nearest hour
      const amount_paid = roundedDuration * parseFloat(amount_per_hour);
  
      // Step 2: Insert payment
      const insertSql = `
        INSERT INTO payment (record_id, amount_paid, payment_date)
        VALUES (?, ?, ?)
      `;
      db.query(insertSql, [record_id, amount_paid, paymentDate], (err, result) => {
        if (err) {
          console.error('Error inserting payment:', err);
          return res.status(500).json({ error: 'Failed to create payment' });
        }
  
        // Step 3: Update parking record (exit_time and duration)
        const updateRecordSql = `
          UPDATE parkingrecord
          SET exit_time = ?, duration = ?
          WHERE record_id = ?
        `;
        db.query(updateRecordSql, [exit_time, roundedDuration, record_id], (err) => {
          if (err) {
            console.error('Error updating parking record:', err);
            return res.status(500).json({ error: 'Payment created, but failed to update parking record' });
          }
  
          // Step 4: Update slot status to 'Occupied'
          const updateSlotSql = `
            UPDATE parkingslot
            SET slot_status = 'Available'
            WHERE slot_id = ?
          `;
          db.query(updateSlotSql, [slot_id], (err) => {
            if (err) {
              console.error('Error updating slot status:', err);
              return res.status(500).json({ error: 'Payment created, but failed to update slot status' });
            }
  
            res.status(201).json({
              message: 'Payment created, parking record updated, and slot marked as Occupied',
              paymentId: result.insertId,
              amount_paid,
              duration: roundedDuration,
            });
          });
        });
      });
    });
  });
  
  

// Update a payment by ID
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { amount_paid, payment_date } = req.body;

  if (!amount_paid) {
    return res.status(400).json({ error: 'amount_paid is required' });
  }
  const sql = `
    UPDATE payment
    SET amount_paid = ?, payment_date = ?
    WHERE payment_id = ?
  `;
  const paymentDate = payment_date || new Date();

  db.query(sql, [amount_paid, paymentDate, id], (err, result) => {
    if (err) {
      console.error('Error updating payment:', err);
      return res.status(500).json({ error: 'Failed to update payment' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ message: 'Payment updated successfully' });
  });
});

// Delete a payment by ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM payment WHERE payment_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting payment:', err);
      return res.status(500).json({ error: 'Failed to delete payment' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  });
});

module.exports = router;
