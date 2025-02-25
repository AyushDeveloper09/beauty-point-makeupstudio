import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen";
import HomePage from "./components/HomePage";
import ServicesPage from "./components/ServicesPage";
import BookAppointment from "./components/BookAppointment";
import Admin from "./components/admin/Admin"; 
import Appointment from "./components/admin/appointment"; // ✅ Using "appointment" (singular)
import Billing from "./components/admin/Billing"; // ✅ Import Billing

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <Router>
      {showWelcome ? (
        <WelcomeScreen onFinish={() => setShowWelcome(false)} />
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/book-appointment" element={<BookAppointment />} /> 
          <Route path="/admin" element={<Admin />} /> {/* Admin Panel */}
          <Route path="/admin/appointment" element={<Appointment />} /> {/* ✅ Using singular version */}
          <Route path="/admin/billing" element={<Billing />} /> {/* ✅ Billing Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
