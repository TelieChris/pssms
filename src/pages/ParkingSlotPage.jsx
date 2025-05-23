import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

function ParkingSlotPage() {
  const [form, setForm] = useState({ slot_number: '', slot_status: 'available' });
  const [slots, setSlots] = useState([]);

  const fetchSlots = async () => {
    const res = await axios.get('/parkingSlot');
    setSlots(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/parkingSlot', form);
    setForm({ slot_number: '', slot_status: 'available' });
    fetchSlots();
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Parking Slot Management</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          type="text"
          placeholder="Slot Number"
          className="block border p-2 rounded w-full"
          value={form.slot_number}
          onChange={(e) => setForm({ ...form, slot_number: e.target.value })}
          required
        />
        <select
          className="block border p-2 rounded w-full"
          value={form.slot_status}
          onChange={(e) => setForm({ ...form, slot_status: e.target.value })}
        >
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Slot
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Slot Number</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, i) => (
            <tr key={i}>
              <td className="border p-2">{slot.slot_number}</td>
              <td className="border p-2">{slot.slot_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ParkingSlotPage;
