import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <h1>Beauty Point Makeup Studio</h1>
      </header>

      {/* Hero Section (Refined & Elegant) */}
      <section className="hero-section">
        <h2>“Where Beauty and Confidence Meet”</h2>
      </section>

      {/* Buttons Section */}
      <div className="button-container">
        <a 
          href="https://wa.me/7499551579" 
          className="btn chat-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Chat with Us
        </a>
        <Link to="/services" className="btn services-btn">
          Explore Services
        </Link>
        <Link to="/book-appointment" className="btn appointment-btn">
          Book Appointment
        </Link>
      </div>

      {/* Owner Section */}
      <section className="owner-section">
        <Card className="owner-card">
          <div className="owner-content">
            {/* Owner Image */}
            <div className="owner-image">
            <img src="/owner.jpg" alt="Shalini Kesarwani" />

            </div>

            {/* Owner Message */}
            <CardContent className="owner-message">
              <Typography variant="h5" className="owner-title">A Message from Our Founder</Typography>
              <Typography variant="body1" className="owner-text">
                "At Beauty Point Makeup Studio, we believe every individual is naturally beautiful. Our mission is to enhance your unique charm with precision, elegance, and passion."
              </Typography>
              <Typography variant="body2" className="owner-name">- Shalini Kesarwani</Typography>
            </CardContent>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Beauty Point Makeup Studio. All rights reserved.</p>
        <p>Contact: 7499551579 | Email: contact@beautypoint.com</p>
      </footer>
    </div>
  );
};

export default HomePage;
