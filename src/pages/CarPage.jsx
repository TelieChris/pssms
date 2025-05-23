import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

function CarPage() {
  const [form, setForm] = useState({ plateNumber: '', driverName: '', phoneNumber: '' });
  const [cars, setCars] = useState([]);

  const fetchCars = async () => {
    const res = await axios.get('/car');
    setCars(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/car', form);
    setForm({ plateNumber: '', driverName: '', phoneNumber: '' });
    fetchCars();
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Car Management</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          type="text"
          placeholder="Plate Number"
          className="block border p-2 rounded w-full"
          value={form.plateNumber}
          onChange={(e) => setForm({ ...form, plateNumber: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Driver Name"
          className="block border p-2 rounded w-full"
          value={form.driverName}
          onChange={(e) => setForm({ ...form, driverName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="block border p-2 rounded w-full"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Car
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Plate Number</th>
            <th className="border p-2">Driver Name</th>
            <th className="border p-2">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car, i) => (
            <tr key={i}>
              <td className="border p-2">{car.plate_number}</td>
              <td className="border p-2">{car.driver_name}</td>
              <td className="border p-2">{car.phone_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CarPage;
