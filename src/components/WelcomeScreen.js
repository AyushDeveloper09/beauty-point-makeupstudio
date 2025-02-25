import React, { useEffect } from "react";

const WelcomeScreen = ({ onFinish }) => {
  useEffect(() => {
    setTimeout(onFinish, 3000);
  }, [onFinish]);

  return (
    <div className="welcome-screen">
      <h1 className="welcome-title">Beauty Point</h1>
      <p className="welcome-subtitle">Step into a world of elegance & luxury</p>
    </div>
  );
};

export default WelcomeScreen;
