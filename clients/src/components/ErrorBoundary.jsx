import React from 'react';

/**
 * ErrorBoundary Component
 * Catches React component errors and displays them on the page
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f3f4f6',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>
            ⚠️ Something went wrong
          </h1>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', color: '#666' }}>
              Error details (click to expand)
            </summary>
            <pre
              style={{
                backgroundColor: '#fff',
                padding: '1rem',
                borderRadius: '4px',
                textAlign: 'left',
                overflow: 'auto',
                marginTop: '1rem',
                border: '1px solid #e5e7eb',
              }}
            >
              {this.state.error && this.state.error.toString()}
              {'\n\n'}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <p style={{ marginTop: '2rem', color: '#666' }}>
            Check the browser console (F12) for more details
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
