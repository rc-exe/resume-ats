// components/ScoreDisplay.jsx
import React from 'react';

function ScoreDisplay({ score }) {
  const getScoreColor = () => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  return (
    <div className="score-display">
      <h2>Your ATS Score</h2>
      <div className="score-circle" style={{ borderColor: getScoreColor() }}>
        {score}
      </div>
      <p className="score-message">
        {score >= 80
          ? 'Excellent! Your resume is well optimized for ATS.'
          : score >= 60
          ? 'Good, but there is room for improvement.'
          : 'Your resume needs significant optimization for ATS.'}
      </p>
    </div>
  );
}

export default ScoreDisplay;