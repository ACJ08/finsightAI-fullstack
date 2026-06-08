import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Store error info for display
    this.setState({ errorInfo });
    
    // Log error details for debugging
    console.error('🔴 Application Error caught by ErrorBoundary:', error);
    console.error('Error Stack:', errorInfo.componentStack);
    
    // In production, you might want to send this to an error reporting service
    // Example: Sentry, LogRocket, etc.
    // sentryClient.captureException(error, { contexts: { react: errorInfo } });
  }

  handleReset = () => {
    // Clear the error and reload the page
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              ⚠️ Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              We're sorry, but the application encountered an unexpected error.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Our team has been notified. Please try the steps below.
            </p>
            
            {/* Error details section (visible in development) */}
            {process.env.NODE_ENV !== 'production' && (
              <details className="mb-6 text-left bg-gray-100 p-4 rounded text-sm text-gray-700 max-h-48 overflow-y-auto">
                <summary className="cursor-pointer font-bold mb-2 text-red-600">
                  Error Details (Development Only)
                </summary>
                <div className="mt-2">
                  <p className="font-semibold mb-2">Error Message:</p>
                  <pre className="text-xs text-red-600 whitespace-pre-wrap break-words mb-4">
                    {this.state.error?.toString()}
                  </pre>
                  <p className="font-semibold mb-2">Component Stack:</p>
                  <pre className="text-xs text-red-600 whitespace-pre-wrap break-words">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
            
            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Return to Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Refresh Page
              </button>
            </div>
            
            {/* Help text */}
            <p className="text-xs text-gray-500 mt-6">
              If the problem persists, please contact support with error ID: {Math.random().toString(36).substr(2, 9)}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
