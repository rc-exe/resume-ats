// components/Suggestions.jsx
import React from 'react';

function Suggestions({ suggestions }) {
  return (
    <div className="suggestions">
      <h2>Improvement Suggestions</h2>
      <ul>
        {suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
}

export default Suggestions;