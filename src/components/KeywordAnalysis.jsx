// components/KeywordAnalysis.jsx
import React from 'react';

// In KeywordAnalysis.js
function KeywordAnalysis({ analysis }) {
    if (!analysis || !analysis.suggestions) {
      return <div>No keyword analysis available.</div>; // Handle case where analysis is not available
    }
  
    return (
      <div className="keyword-analysis">
        <h2>Keyword Analysis</h2>
        <p>Suggestions: {analysis.suggestions.length} keywords found.</p>
        <ul>
          {analysis.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default KeywordAnalysis;
