import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#footer-grad)" />
            <path d="M10 22V10L16 16L22 10V22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="footer-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563EB" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
          <span className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 700 }}>DevPath AI</span>
        </div>

        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          Plan Your Career. Build Amazing Projects. Get Internship Ready.
        </p>

        <div className="footer-links">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/career" className="footer-link">Career Mentor</Link>
          <Link to="/project" className="footer-link">Project Mentor</Link>
        </div>

        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
          © {new Date().getFullYear()} DevPath AI. Developed for IBM Project. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
