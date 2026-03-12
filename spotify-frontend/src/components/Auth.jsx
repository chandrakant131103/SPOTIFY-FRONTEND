import React, { useState, useEffect } from 'react';

const Auth = () => {
  // 1. Add state to track screen width
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="auth-container" style={{ display: 'flex', height: '100vh', width: '100vw', background: '#000' }}>
      
      {/* 2. ONLY render the Hero section if NOT mobile */}
      {!isMobile && (
        <div className="auth-left-panel" style={{ flex: 1, position: 'relative' }}>
          {/* Your Surfer Image and Big Pulse Text go here */}
          <div className="hero-content">
             <h1 className="brand-logo-large">PULSE</h1>
             <p>The heartbeat of modern music.</p>
          </div>
        </div>
      )}

      {/* 3. The Form Section - Stretches to fill screen on mobile */}
      <div className="auth-form-side" style={{ 
        flex: isMobile ? '1' : '0.4', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px'
      }}>
        <div className="form-box">
          {/* --- YOUR FORM CONTENT (Inputs, Buttons) --- */}
          <h2 style={{ marginBottom: '20px' }}>Join Pulse</h2>
          
          {/* Your inputs go here... */}
          
        </div>
      </div>
    </div>
  );
};

export default Auth;
