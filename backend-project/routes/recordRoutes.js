const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all parking records (joined with car and slot info)
router.get('/', (req, res) => {
  const sql = `
    SELECT pr.*, c.plate_number, ps.slot_number 
    FROM parkingrecord pr 
    JOIN car c ON pr.car_id = c.car_id 
    JOIN parkingslot ps ON pr.slot_id = ps.slot_id
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

// Check-in a car (create parking record)
router.post('/entry', (req, res) => {
  const { car_id, slot_id, entry_time } = req.body;
  const entryTime = entry_time ? new Date(entry_time) : new Date();

  const sql = `
    INSERT INTO parkingrecord (car_id, slot_id, entry_time)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [car_id, slot_id, entryTime], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    // Update slot status to 'occupied'
    db.query(
      `UPDATE parkingslot SET slot_status = 'occupied' WHERE slot_id = ?`,
      [slot_id],
      (err2) => {
        if (err2) return res.status(500).json({ error: err2 });

        res.json({
          message: 'Car checked in successfully. Slot marked as occupied.',
          record_id: result.insertId,
        });
      }
    );
  });
});

// Check-out a car (update exit_time and duration)
router.put('/exit/:id', (req, res) => {
  const recordId = req.params.id;
  const exitTime = new Date();

  // Step 1: Get the existing entry_time and slot_id
  db.query(
    `SELECT slot_id, entry_time FROM parkingrecord WHERE record_id = ?`,
    [recordId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      if (rows.length === 0)
        return res.status(404).json({ message: 'Record not found' });

      const { slot_id, entry_time } = rows[0];
      const duration = Math.ceil(
        (exitTime - new Date(entry_time)) / (1000 * 60 * 60)
      );

      // Step 2: Update exit_time and duration
      db.query(
        `UPDATE parkingrecord SET exit_time = ?, duration = ? WHERE record_id = ?`,
        [exitTime, duration, recordId],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2 });

          // Step 3: Mark slot as available again
          db.query(
            `UPDATE parkingslot SET slot_status = 'available' WHERE slot_id = ?`,
            [slot_id],
            (err3) => {
              if (err3) return res.status(500).json({ error: err3 });

              res.json({
                message: 'Car checked out successfully. Slot is now available.',
                duration,
              });
            }
          );
        }
      );
    }
  );
});

// Delete a parking record (optional)
router.delete('/:id', (req, res) => {
  const recordId = req.params.id;

  // First, get the slot_id
  db.query(
    `SELECT slot_id FROM parkingrecord WHERE record_id = ?`,
    [recordId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      if (rows.length === 0)
        return res.status(404).json({ message: 'Record not found' });

      const { slot_id } = rows[0];

      // Delete the record
      db.query(`DELETE FROM parkingrecord WHERE record_id = ?`, [recordId], (err2) => {
        if (err2) return res.status(500).json({ error: err2 });

        // Free up the slot
        db.query(`UPDATE parkingslot SET slot_status = 'available' WHERE slot_id = ?`, [slot_id], (err3) => {
          if (err3) return res.status(500).json({ error: err3 });

          res.json({ message: 'Record deleted and slot freed up' });
        });
      });
    }
  );
});

module.exports = router;
