import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  const fetchReports = async (selectedDate) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/reports/payments/daily', {
        params: { date: selectedDate },
      });
      setReports(response.data);
    } catch (err) {
      setError('Failed to load payment reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(date);
  }, [date]);

  // Export to Excel function
  const exportToExcel = () => {
    if (reports.length === 0) return;

    // Map your report data to a format suitable for Excel
    const dataForExcel = reports.map((r) => ({
      'Plate Number': r.plate_number,
      'Slot Number': r.slot_number,
      'Entry Time': new Date(r.entry_time).toLocaleString(),
      'Exit Time': r.exit_time ? new Date(r.exit_time).toLocaleString() : '---',
      'Duration (hrs)': r.duration ?? '---',
      'Amount Paid': r.amount_paid,
      'Payment Date': new Date(r.payment_date).toLocaleString(),
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Report');

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Create Blob and save file
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, `Daily_Report_${date}.xlsx`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Daily Payment Reports</h2>

      <div className="mb-4 flex items-center gap-4">
        <label htmlFor="report-date" className="font-medium">
          Select Date:
        </label>
        <input
          id="report-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1"
          max={new Date().toISOString().slice(0, 10)}
        />
        <button
          onClick={exportToExcel}
          disabled={reports.length === 0}
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download Excel
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading payment reports...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {reports.length === 0 ? (
            <p className="text-gray-500">No payment records found for this date.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Plate Number</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Slot Number</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Entry Time</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Exit Time</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Duration (hrs)</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Amount Paid</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Payment Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((r) => (
                    <tr key={r.payment_id}>
                      <td className="px-4 py-2 whitespace-nowrap">{r.plate_number}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{r.slot_number}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{new Date(r.entry_time).toLocaleString()}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{r.exit_time ? new Date(r.exit_time).toLocaleString() : '---'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{r.duration ?? '---'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{r.amount_paid}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{new Date(r.payment_date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReportPage;
