import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    record_id: '',
    payment_date: '',
    amount_per_hour: '',
  });
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');

  const fetchData = () => {
    axios.get('/payment')
      .then(res => setPayments(res.data))
      .catch(err => console.error('Error fetching payments:', err));

    axios.get('/parkingRecord')
      .then(res => setRecords(res.data))
      .catch(err => console.error('Error fetching parking records:', err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.record_id || !form.amount_per_hour) {
      alert('Please fill all required fields');
      return;
    }

    const dataToSend = {
      record_id: form.record_id,
      amount_per_hour: parseFloat(form.amount_per_hour),
    };

    if (form.payment_date) {
      dataToSend.payment_date = form.payment_date;
    }

    axios.post('/payment', dataToSend)
      .then(res => {
        setForm({ record_id: '', payment_date: '', amount_per_hour: '' });
        fetchData();
        setMessage(`Paid RWF ${res.data.amount_paid} for ${res.data.duration} hours`);
        setTimeout(() => setMessage(''), 5000);
      })
      .catch(err => {
        console.error('Error creating payment:', err);
        alert('Failed to create payment');
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Payment Management</h2>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6 max-w-md">
        <label className="block">
          <span>Parking Record</span>
          <select
            value={form.record_id}
            onChange={e => setForm({ ...form, record_id: e.target.value })}
            className="block border p-2 rounded w-full"
            required
          >
            <option value="">Select Parking Record</option>
            {records.map(r => (
              <option key={r.record_id} value={r.record_id}>
                {r.plate_number} - Slot {r.slot_number} (Entry: {new Date(r.entry_time).toLocaleString()})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span>Amount Per Hour (RWF)</span>
          <input
            type="number"
            step="0.01"
            value={form.amount_per_hour}
            onChange={e => setForm({ ...form, amount_per_hour: e.target.value })}
            className="block border p-2 rounded w-full"
            required
          />
        </label>

        <label className="block">
          <span>Payment Date (optional)</span>
          <input
            type="datetime-local"
            value={form.payment_date}
            onChange={e => setForm({ ...form, payment_date: e.target.value })}
            className="block border p-2 rounded w-full"
          />
        </label>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Pay
        </button>
      </form>

      {message && (
        <div className="bg-green-100 text-green-800 px-4 py-2 mb-4 rounded">
          {message}
        </div>
      )}

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Plate Number</th>
            <th className="border p-2">Slot Number</th>
            <th className="border p-2">Entry Time</th>
            <th className="border p-2">Exit Time</th>
            <th className="border p-2">Amount Paid</th>
            <th className="border p-2">Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.payment_id}>
              <td className="border p-2">{p.plate_number}</td>
              <td className="border p-2">{p.slot_number}</td>
              <td className="border p-2">{new Date(p.entry_time).toLocaleString()}</td>
              <td className="border p-2">{p.exit_time ? new Date(p.exit_time).toLocaleString() : '---'}</td>
              <td className="border p-2">{p.amount_paid}</td>
              <td className="border p-2">{new Date(p.payment_date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentPage;
