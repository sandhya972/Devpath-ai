import React, { useState } from 'react';
import { generateCareerRoadmap, streamCareerRoadmap } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CareerMentor() {
  const [formData, setFormData] = useState({
    collegeYear: '3rd Year',
    skills: 'JavaScript, React, HTML/CSS, basic Node.js',
    interests: 'Full Stack Web Development, Cloud Computing',
    dreamCompany: 'IBM',
    careerGoal: 'Secure a Software Engineer Internship',
  });

  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationError) setValidationError(null);
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.collegeYear.trim()) {
      return 'Please select your College Year.';
    }
    if (!formData.skills.trim()) {
      return 'Please specify your current technical skills.';
    }
    if (!formData.interests.trim()) {
      return 'Please specify your domains of interest.';
    }
    if (!formData.dreamCompany.trim()) {
      return 'Please specify your target dream company.';
    }
    if (!formData.careerGoal.trim()) {
      return 'Please specify your career goal.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const valErr = validateForm();
    if (valErr) {
      setValidationError(valErr);
      return;
    }

    setValidationError(null);
    setError(null);
    setResult(null);
    setStreamedText('');
    setLoading(true);
    setIsStreaming(true);

    streamCareerRoadmap(
      formData,
      (chunk) => {
        setLoading(false);
        setStreamedText((prev) => prev + chunk);
      },
      () => {
        setIsStreaming(false);
        setLoading(false);
      },
      async (streamErr) => {
        console.warn('Streaming failed, attempting fallback API request:', streamErr);
        setIsStreaming(false);
        try {
          const data = await generateCareerRoadmap(formData);
          setResult(data);
        } catch (err) {
          const friendlyMessage =
            err.response?.data?.error ||
            err.message ||
            'Unable to reach the DevPath AI service. Please ensure the backend server is running and your GEMINI_API_KEY is configured.';
          setError(friendlyMessage);
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const getCardContent = (key) => {
    if (result && result[key]) {
      return result[key];
    }
    if (streamedText) {
      return streamedText;
    }
    return null;
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
          AI <span className="gradient-text">Career Mentor</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
          Personalized skill gap analysis, 90-day execution roadmap, and interview prep strategy.
        </p>
      </div>

      {/* Form Container */}
      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto 4rem' }}>
        <form onSubmit={handleSubmit} noValidate>
          {validationError && (
            <div className="alert-error" style={{ marginBottom: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <strong>Validation Notice:</strong> {validationError}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                </svg>
                College Year *
              </label>
              <select className="form-control" name="collegeYear" value={formData.collegeYear} onChange={handleChange} required>
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Graduate / Alum">Graduate / Alum</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18" />
                  <path d="M5 21V7l8-4v18" />
                  <path d="M19 21V11l-6-4" />
                </svg>
                Dream Company *
              </label>
              <input
                type="text"
                className="form-control"
                name="dreamCompany"
                placeholder="e.g. IBM, Google, Microsoft, Startup"
                value={formData.dreamCompany}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              Current Skills *
            </label>
            <textarea
              className="form-control"
              name="skills"
              placeholder="e.g. Python, Data Structures, React, SQL, Git"
              value={formData.skills}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                Interests & Domains *
              </label>
              <input
                type="text"
                className="form-control"
                name="interests"
                placeholder="e.g. Backend Dev, AI/ML, Cloud Architecture"
                value={formData.interests}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Career Goal *
              </label>
              <input
                type="text"
                className="form-control"
                name="careerGoal"
                placeholder="e.g. Land a Backend Developer Internship"
                value={formData.careerGoal}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary btn-glow"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1.05rem',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              {loading ? 'Processing Roadmap...' : 'Generate Roadmap'}
            </button>
          </div>
        </form>
      </div>

      {/* Friendly Error Alert with Retry Button */}
      {error && (
        <div className="alert-error" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <strong>Service Error:</strong> {error}
            </div>
          </div>
          <button
            onClick={() => handleSubmit()}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', background: '#ffffff', color: '#ef4444', borderColor: '#ef4444' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Retry Request
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && <LoadingSpinner message="Analyzing your skills & building custom career roadmap..." />}

      {/* Result Cards Section */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Career Roadmap Output Cards
        </h2>

        <div className="cards-grid">
          {/* Card 1: Skill Gap Analysis */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <h3 className="result-card-title">Skill Gap Analysis</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('skillGap') ? (
                <div>
                  {getCardContent('skillGap')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">Skill gap feedback will appear here after clicking Generate.</span>
              )}
            </div>
          </div>

          {/* Card 2: 90-Day Roadmap */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className="result-card-title">90-Day Roadmap</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('ninetyDayRoadmap') ? (
                <div>
                  {getCardContent('ninetyDayRoadmap')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">90-day phase roadmap milestones will appear here.</span>
              )}
            </div>
          </div>

          {/* Card 3: Weekly Learning Plan */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <h3 className="result-card-title">Weekly Learning Plan</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('weeklyLearningPlan') ? (
                <div>
                  {getCardContent('weeklyLearningPlan')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">Weekly study schedules & routines will appear here.</span>
              )}
            </div>
          </div>

          {/* Card 4: Learning Resources */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h3 className="result-card-title">Learning Resources</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('learningResources') ? (
                <div>
                  {getCardContent('learningResources')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">Recommended documentation, books, and courses will appear here.</span>
              )}
            </div>
          </div>

          {/* Card 5: Interview Preparation Topics */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="result-card-title">Interview Preparation Topics</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('interviewTopics') ? (
                <div>
                  {getCardContent('interviewTopics')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">Core coding, system design, and interview questions will appear here.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
