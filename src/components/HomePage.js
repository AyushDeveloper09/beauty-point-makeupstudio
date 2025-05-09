import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./style/App.css";

import SpecialOffers from "./SpecialOffers";
import TestimonialSection from "../components/TestimonialSection";

const HomePage = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef(null);

  const aboutRef = useRef(null);
  const feedbackRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 300);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error =>
        console.log("Autoplay with sound blocked:", error)
      );
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const scrollToFeedback = () => {
    feedbackRef.current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="brand-logo">
          <img
            src={`${process.env.PUBLIC_URL}/assets/brandlogo.png`}
            alt="Beauty Point Makeup Studio"
          />
        </div>

        {/* Hamburger for mobile */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        {/* Navigation */}
        <nav className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
          <a href="/" className="nav-item">Home</a>
          <button className="nav-item" onClick={scrollToAbout}>About Us</button>
          <button className="nav-item" onClick={scrollToFeedback}>Feedback</button>

          <button className="login-btn" onClick={() => { navigate("/login"); setMenuOpen(false); }}>
            Login
          </button>
          <button className="signup-btn" onClick={() => { navigate("/signup"); setMenuOpen(false); }}>
            Sign Up
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="hero-section">
        <div className={`hero-text ${fadeIn ? "fade-in" : ""}`}>
          <h1 className="business-name">Beauty Point Makeup Studio</h1>
          <p className="hero-tagline">
            At Beauty Point Makeup Studio, we don't just apply makeup—we enhance your confidence,
            celebrate your beauty, and ensure that every special moment is picture-perfect.
          </p>
          <div className="hero-buttons">
            <button
              className="whatsapp-btn"
              onClick={() => window.open("https://wa.me/6390600533", "_blank", "noopener noreferrer")}
            >
              Chat with Us
            </button>
            <button className="secondary-btn" onClick={() => navigate("/services")}>
              Explore Services
            </button>
            <button className="primary-btn" onClick={() => navigate("/book-appointment")}>
              Book Appointment
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img
            src={`${process.env.PUBLIC_URL}/assets/hero.png`}
            alt="Makeup Studio"
          />
        </div>
      </div>

      {/* Hero Video Section */}
      <div className={`hero-video-container ${fadeIn ? "fade-in" : ""}`}>
        <video
          ref={videoRef}
          autoPlay
          muted
          controls
          playsInline
          className="hero-video"
          onEnded={() => console.log("Video ended")}
        >
          <source
            src={`${process.env.PUBLIC_URL}/assets/0228.mp4`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Special Offers */}
      <SpecialOffers />

      {/* Testimonial Section */}
      <div ref={feedbackRef}>
        <TestimonialSection />
      </div>

      {/* About / Owner Section */}
      <div ref={aboutRef} className="owner-section">
        <div className="owner-card">
          <img
            src={`${process.env.PUBLIC_URL}/assets/owner.png`}
            alt="Owner"
            className="owner-image"
          />
          <div className="owner-text">
            <h2>Shalini Kesarwani (Our Founder)</h2>
            <p>
              Our founder, a passionate and skilled makeup artist, believes in
              bringing out the best in every individual. With years of experience,
              she ensures that each client leaves feeling confident and beautiful.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Beauty Point Makeup Studio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
