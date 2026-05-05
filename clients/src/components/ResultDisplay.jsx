import React from 'react';

/**
 * ResultDisplay Component
 * Shows binary verdict: Live ✓ (green) or Spoof ✗ (red)
 */
export const ResultDisplay = ({ prediction, isLoading, error, confidence }) => {
  if (error) {
    return (
      <div className="result-container error-state">
        <div className="error-message">⚠️ {error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="result-container loading-state">
        <div className="loading-spinner"></div>
        <p>Processing...</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="result-container idle-state">
        <div className="idle-message">Waiting for prediction...</div>
      </div>
    );
  }

  const isLive = prediction === 'Live';
  const verdictClass = isLive ? 'live' : 'spoof';
  const verdictIcon = isLive ? '✓' : '✗';
  const verdictText = isLive ? 'LIVE' : 'SPOOF';

  return (
    <div className={`result-container ${verdictClass}`}>
      <div className="verdict-badge">
        <div className="verdict-icon">{verdictIcon}</div>
        <div className="verdict-text">{verdictText}</div>
      </div>
      {confidence !== undefined && (
        <div className="confidence-display">
          Confidence: {(confidence * 100).toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
