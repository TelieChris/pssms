import React from 'react';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to SmartPark!</h1>
        <p className="text-gray-700 text-lg">
          Manage vehicles, parking slots, records, payments, and reports all in one place.
        </p>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-blue-600">
          <div className="bg-blue-100 p-4 rounded hover:bg-blue-200 transition">🚗 Cars</div>
          <div className="bg-blue-100 p-4 rounded hover:bg-blue-200 transition">🅿️ Slots</div>
          <div className="bg-blue-100 p-4 rounded hover:bg-blue-200 transition">📋 Records</div>
          <div className="bg-blue-100 p-4 rounded hover:bg-blue-200 transition">💳 Payments</div>
          <div className="bg-blue-100 p-4 rounded hover:bg-blue-200 transition">📊 Reports</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
