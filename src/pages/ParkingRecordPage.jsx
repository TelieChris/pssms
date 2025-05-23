import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

function ParkingRecordPage() {
  const [form, setForm] = useState({
    car_id: '',
    slot_id: '',
    entry_time: '',
  });

  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [slots, setSlots] = useState([]);

  // Fetch cars, slots and records
  const fetchData = async () => {
    try {
      const [resRecords, resCars, resSlots] = await Promise.all([
        axios.get('/parkingRecord'),
        axios.get('/car'),
        axios.get('/parkingSlot'),
      ]);

      setRecords(resRecords.data);
      setCars(resCars.data);

      // Only show slots marked as 'available'
      const available = resSlots.data.filter((s) => s.slot_status === 'Available');
      setSlots(available);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();

    const payload = {
      car_id: form.car_id,
      slot_id: form.slot_id,
      ...(form.entry_time && { entry_time: form.entry_time }),
    };

    try {
      await axios.post('/parkingRecord/entry', payload);
      setForm({ car_id: '', slot_id: '', entry_time: '' });
      fetchData();
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  const handleCheckOut = async (record_id) => {
    try {
      await axios.put(`/parkingRecord/exit/${record_id}`);
      fetchData();
    } catch (error) {
      console.error('Check-out failed:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Parking Record Management</h2>

      {/* Check-In Form */}
      <form onSubmit={handleCheckIn} className="space-y-4 bg-gray-100 p-4 rounded shadow mb-8">
        <div>
          <label className="block font-medium mb-1">Select Car</label>
          <select
            value={form.car_id}
            onChange={(e) => setForm({ ...form, car_id: e.target.value })}
            className="block border p-2 rounded w-full"
            required
          >
            <option value="">-- Choose Car --</option>
            {cars.map((car) => (
              <option key={car.car_id} value={car.car_id}>
                {car.plate_number}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Select Available Slot</label>
          <select
            value={form.slot_id}
            onChange={(e) => setForm({ ...form, slot_id: e.target.value })}
            className="block border p-2 rounded w-full"
            required
          >
            <option value="">-- Choose Slot --</option>
            {slots.map((slot) => (
              <option key={slot.slot_id} value={slot.slot_id}>
                {slot.slot_number}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Entry Time (optional)</label>
          <input
            type="datetime-local"
            value={form.entry_time}
            onChange={(e) => setForm({ ...form, entry_time: e.target.value })}
            className="block border p-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Check In
        </button>
      </form>

      {/* Parking Records Table */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Plate</th>
            <th className="border p-2">Slot</th>
            <th className="border p-2">Entry</th>
            <th className="border p-2">Exit</th>
            <th className="border p-2">Duration (hrs)</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.record_id}>
              <td className="border p-2">{r.plate_number}</td>
              <td className="border p-2">{r.slot_number}</td>
              <td className="border p-2">
                {new Date(r.entry_time).toLocaleString()}
              </td>
              <td className="border p-2">
                {r.exit_time ? new Date(r.exit_time).toLocaleString() : '---'}
              </td>
              <td className="border p-2">{r.duration || '---'}</td>
              <td className="border p-2 text-center">
                {!r.exit_time ? (
                  <span className="text-gray-500">Parked</span>
                ) : (
                  <span className="text-gray-500">Done</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ParkingRecordPage;
