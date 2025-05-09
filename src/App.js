import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import WelcomeScreen from "./components/WelcomeScreen";
import HomePage from "./components/HomePage";
import ServicesPage from "./components/ServicesPage";
import BookAppointment from "./components/BookAppointment";
import Admin from "./components/admin/Admin";
import Appointment from "./components/admin/appointment"; 
import Billing from "./components/admin/Billing";

// ✅ Auth Pages
import Login from "./auth/Login";
import Signup from "./auth/Signup";

// ✅ Feedback Pages
import Feedback from "./components/admin/feedback/Feedback"; 
import MediaFeedback from "./components/admin/feedback/Mediafeedback";
import TextFeedback from "./components/admin/feedback/Textfeedback";
import TestimonialsFeedback from "./components/admin/feedback/Testimonialfeedback";

// ✅ Testimonial Submission Page
import SubmitTestimonial from "./components/SubmitTestimonial";

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <Router>
      {showWelcome ? (
        <WelcomeScreen onFinish={() => setShowWelcome(false)} />
      ) : (
        <Routes>
          {/* ✅ Main Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/book-appointment" element={<BookAppointment />} />

          {/* ✅ Admin Panel */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/appointment" element={<Appointment />} />
          <Route path="/admin/billing" element={<Billing />} />

          {/* ✅ Feedback Section */}
          <Route path="/admin/feedback" element={<Feedback />} />
          <Route path="/admin/feedback/media" element={<MediaFeedback />} />
          <Route path="/admin/feedback/text" element={<TextFeedback />} />
          <Route path="/admin/feedback/testimonials" element={<TestimonialsFeedback />} />

          {/* ✅ Testimonial Submission Page */}
          <Route path="/submit-testimonial" element={<SubmitTestimonial />} />

          {/* ✅ Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Redirect any unknown routes to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
