import React, { useState } from 'react';
import { generateProjectPlan, streamProjectPlan } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProjectMentor() {
  const [formData, setFormData] = useState({
    currentSkills: 'React, Node.js, Express, MongoDB, Tailwind CSS',
    domain: 'Full Stack Web Development',
    difficulty: 'Intermediate',
    timeAvailable: '2-4 weeks',
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
    if (!formData.currentSkills.trim()) {
      return 'Please enter your current skills.';
    }
    if (!formData.domain.trim()) {
      return 'Please select an industry domain.';
    }
    if (!formData.difficulty.trim()) {
      return 'Please select a difficulty level.';
    }
    if (!formData.timeAvailable.trim()) {
      return 'Please select your available timeframe.';
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

    streamProjectPlan(
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
          const data = await generateProjectPlan(formData);
          setResult(data);
        } catch (err) {
          const friendlyMessage =
            err.response?.data?.error ||
            err.message ||
            'Unable to communicate with the Project Architect service. Please ensure the backend Express server is running and GEMINI_API_KEY is configured.';
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
          AI <span className="gradient-text">Project Mentor</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
          Generate industry-standard project blueprints complete with folder structure, API schemas, and interview questions.
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

          <div className="form-group">
            <label className="form-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              Current Skills *
            </label>
            <input
              type="text"
              className="form-control"
              name="currentSkills"
              placeholder="e.g. React, Node.js, Python, PostgreSQL, Docker"
              value={formData.currentSkills}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                Domain *
              </label>
              <select className="form-control" name="domain" value={formData.domain} onChange={handleChange} required>
                <option value="Full Stack Web Development">Full Stack Web Dev</option>
                <option value="Frontend Development">Frontend Dev</option>
                <option value="Backend Engineering & APIs">Backend Engineering</option>
                <option value="Mobile Application (React Native / Flutter)">Mobile App</option>
                <option value="AI / Machine Learning App">AI / Machine Learning</option>
                <option value="Cloud & DevOps Engineering">Cloud & DevOps</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Difficulty *
              </label>
              <select className="form-control" name="difficulty" value={formData.difficulty} onChange={handleChange} required>
                <option value="Beginner">Beginner (Foundational)</option>
                <option value="Intermediate">Intermediate (Resume Builder)</option>
                <option value="Advanced">Advanced (Production Capstone)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Time Available *
              </label>
              <select className="form-control" name="timeAvailable" value={formData.timeAvailable} onChange={handleChange} required>
                <option value="< 1 week">&lt; 1 week (Hackathon speed)</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="2-4 weeks">2-4 weeks (Recommended)</option>
                <option value="1+ months">1+ months (Deep architecture)</option>
              </select>
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
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              {loading ? 'Designing Architecture...' : 'Generate Project'}
            </button>
          </div>
        </form>
      </div>

      {/* Friendly Error Banner with Retry Button */}
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
      {loading && <LoadingSpinner message="Architecting production-ready project blueprint..." />}

      {/* Result Cards Grid */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          Project Architecture Output Cards
        </h2>

        <div className="cards-grid">
          {/* Card 1: Project Title */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </div>
              <h3 className="result-card-title">Project Title</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('projectTitle') ? (
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-blue)' }}>
                  {getCardContent('projectTitle')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">Generated project title will appear here.</span>
              )}
            </div>
          </div>

          {/* Card 2: Description */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <h3 className="result-card-title">Description</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('description') ? (
                <div>
                  {getCardContent('description')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">Project high-level overview and problem summary will appear here.</span>
              )}
            </div>
          </div>

          {/* Card 3: Features */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <h3 className="result-card-title">Features</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('features') ? (
                <div>
                  {getCardContent('features')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">Key functional features & technical capabilities list will appear here.</span>
              )}
            </div>
          </div>

          {/* Card 4: Tech Stack */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <h3 className="result-card-title">Tech Stack</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('techStack') ? (
                <div>
                  {getCardContent('techStack')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">Recommended technologies, frameworks, and libraries will appear here.</span>
              )}
            </div>
          </div>

          {/* Card 5: Folder Structure */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="result-card-title">Folder Structure</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('folderStructure') ? (
                <div>
                  {getCardContent('folderStructure')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">Recommended directory tree structure will appear here.</span>
              )}
            </div>
          </div>

          {/* Card 6: Database */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
              </div>
              <h3 className="result-card-title">Database</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('database') ? (
                <div>
                  {getCardContent('database')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">Database schemas, models, and entity specs will appear here.</span>
              )}
            </div>
          </div>

          {/* Card 7: API Endpoints */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <h3 className="result-card-title">API Endpoints</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('apiEndpoints') ? (
                <div>
                  {getCardContent('apiEndpoints')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">RESTful/GraphQL API endpoint specifications will appear here.</span>
              )}
            </div>
          </div>

          {/* Card 8: Development Timeline */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="result-card-title">Development Timeline</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('developmentTimeline') ? (
                <div>
                  {getCardContent('developmentTimeline')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">Development phases and step-by-step milestones will appear here.</span>
              )}
            </div>
          </div>

          {/* Card 9: Deployment Strategy */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12l-5 5" />
                  <path d="M12 15l-5 5" />
                </svg>
              </div>
              <h3 className="result-card-title">Deployment Strategy</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('deploymentStrategy') ? (
                <div>
                  {getCardContent('deploymentStrategy')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">Production deployment setup, CI/CD, and hosting instructions will appear here.</span>
              )}
            </div>
          </div>

          {/* Card 10: Interview Questions */}
          <div className="result-card">
            <div className="result-card-header">
              <div className="result-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="result-card-title">Interview Questions</h3>
            </div>
            <div className="result-card-body">
              {getCardContent('interviewQuestions') ? (
                <div>
                  {getCardContent('interviewQuestions')}
                  {isStreaming && <span className="typing-cursor"></span>}
                </div>
              ) : (
                <span className="empty-placeholder">Technical deep-dive questions interviewers will ask about this project will appear here.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
