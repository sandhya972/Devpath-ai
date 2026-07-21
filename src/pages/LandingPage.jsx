import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{ padding: '3rem 0' }}>
      {/* Hero Section */}
      <section className="container" style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '2rem',
            background: 'var(--badge-bg)',
            color: 'var(--badge-text)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Powered by Gemini AI Engine
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}>
          Plan Your Career. <br />
          <span className="gradient-text">Build Amazing Projects.</span> <br />
          Get Internship Ready.
        </h1>

        <p style={{ maxWidth: '680px', margin: '0 auto 2.5rem', fontSize: '1.15rem', color: 'var(--text-secondary)' }}>
          DevPath AI is your personal AI mentor designed to bridge the gap between academic learning and industry expectations. 
          Generate tailored 90-day career roadmaps and complete portfolio project blueprints in seconds.
        </p>

        {/* Hero CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/career" className="btn btn-primary btn-glow" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            Career Mentor
          </Link>
          <Link to="/project" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Project Mentor
          </Link>
        </div>
      </section>

      {/* Interactive Mock Preview Section */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div className="glass-card" style={{ padding: '2rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></span>
              <span style={{ marginLeft: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>devpath-ai // live-demo-preview</span>
            </div>
            <span className="badge" style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)', padding: '0.2rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>
              AI Response Blueprint
            </span>
          </div>

          <div className="cards-grid" style={{ marginTop: '1rem' }}>
            <div className="result-card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
              <div className="result-card-header">
                <div className="result-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="result-card-title">90-Day Milestones</h3>
              </div>
              <div className="result-card-body">
                <p style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>Phase 1: Foundations (Days 1-30)</p>
                <p>Master Data Structures, System Design, & Async Node.js concurrency pattern.</p>
              </div>
            </div>

            <div className="result-card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
              <div className="result-card-header">
                <div className="result-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <h3 className="result-card-title">Full Architecture Spec</h3>
              </div>
              <div className="result-card-body">
                <p style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>Microservice API Design</p>
                <p>Express REST controllers with Dockerized PostgreSQL & JWT Authentication.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Why Choose DevPath AI?</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Tailored tools built specifically for CS students and aspiring software engineers.</p>
        </div>

        <div className="cards-grid">
          <div className="glass-card hover-lift" style={{ padding: '2rem' }}>
            <div className="result-card-icon" style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', marginBottom: '1.25rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Personalized Career Paths</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Analyze your current college year, skills, and target dream company to receive a precise 90-day execution plan.
            </p>
          </div>

          <div className="glass-card hover-lift" style={{ padding: '2rem' }}>
            <div className="result-card-icon" style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', marginBottom: '1.25rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Production Project Architecture</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Generate complete project specs including directory trees, API endpoints, DB schemas, and interview questions.
            </p>
          </div>

          <div className="glass-card hover-lift" style={{ padding: '2rem' }}>
            <div className="result-card-icon" style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', marginBottom: '1.25rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Interview Readiness</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Know exactly what technical concepts and system design questions recruiters will ask during technical interviews.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
