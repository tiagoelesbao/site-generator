// src/components/Logo.js
import React from 'react';

function Logo() {
  return (
    <div className="site-logo">
      <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="4" fill="#121225"/>
        <path d="M7 16C7 11.0294 11.0294 7 16 7C20.9706 7 25 11.0294 25 16C25 20.9706 20.9706 25 16 25" 
              stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 25L16 19" stroke="#30c9e8" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 16L20 16" stroke="#30c9e8" strokeWidth="2" strokeLinecap="round"/>
        <defs>
          <linearGradient id="paint0_linear" x1="7" y1="7" x2="25" y2="25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#824ee2"/>
            <stop offset="1" stopColor="#30c9e8"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="logo-text">SiteGen<span className="logo-accent">AI</span></span>
    </div>
  );
}

export default Logo;