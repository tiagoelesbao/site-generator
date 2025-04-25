// src/components/Logo.js - Nova versão premium minimalista
import React from 'react';

function Logo() {
  return (
    <div className="site-logo">
      <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22.5" cy="22.5" r="21.5" fill="url(#premium_gradient)" fillOpacity="0.05" stroke="url(#premium_stroke)" strokeWidth="1.5"/>
        <path d="M12 22.5C12 16.7005 16.7005 12 22.5 12C28.2995 12 33 16.7005 33 22.5C33 28.2995 28.2995 33 22.5 33" 
              stroke="url(#premium_path)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22.5 33L22.5 25" stroke="#E0E0E2" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22.5 22.5L28 22.5" stroke="#E0E0E2" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="22.5" cy="22.5" r="2.5" fill="#FFFFFF" fillOpacity="0.2"/>
        <defs>
          <linearGradient id="premium_gradient" x1="10" y1="10" x2="35" y2="35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity="0.8"/>
            <stop offset="1" stopColor="#C0C0C0" stopOpacity="0.4"/>
          </linearGradient>
          <linearGradient id="premium_stroke" x1="10" y1="10" x2="35" y2="35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF"/>
            <stop offset="1" stopColor="#A0A0A0"/>
          </linearGradient>
          <linearGradient id="premium_path" x1="12" y1="12" x2="33" y2="33" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF"/>
            <stop offset="1" stopColor="#D0D0D0"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="logo-text">SiteGen<span className="logo-accent">AI</span></span>
    </div>
  );
}

export default Logo;