import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import CarPage from './pages/CarPage';
import SlotPage from './pages/ParkingSlotPage';
import RecordPage from './pages/ParkingRecordPage';
import PaymentPage from './pages/PaymentPage';
import ReportPage from './pages/ReportPage';
import NavBar from './pages/NavBar';
// import Logout from './pages/Logout';

function App() {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/car" element={<CarPage />} />
        <Route path="/slot" element={<SlotPage />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/report" element={<ReportPage />} />
        {/* <Route path="/logout" element={<Logout />} />  */}
      </Routes>
    </Router>
  );
}

export default App;
