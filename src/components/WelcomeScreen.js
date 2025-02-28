import React, { useEffect, useState } from "react";
import "./style/App.css"; 

const WelcomeScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 1000); // Delay for fade-out animation
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`welcome-screen ${fadeOut ? "fade-out" : "fade-in"}`}>
      <div className="makeup-animation">
        <div className="brush"></div>
        <div className="lipstick"></div>
        <div className="compact"></div>
      </div>
      <h1 className="welcome-title">Beauty Point</h1>
      <p className="welcome-subtitle">Step into a world of elegance & luxury</p>
    </div>
  );
};

export default WelcomeScreen;
