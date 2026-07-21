import React from 'react';

export default function LoadingSpinner({ message = 'AI is crafting your response...' }) {
  return (
    <div className="spinner-container">
      <div className="gradient-spinner"></div>
      <p style={{ fontWeight: 600, color: 'var(--accent-blue)', fontSize: '1.05rem' }}>
        {message}
      </p>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Generating personalized blueprints powered by Gemini AI...
      </p>
    </div>
  );
}
