import { useState } from "react";

const ErrorBoundary = ({ children }) => {
  const [error, setError] = useState(null);

  const handleRetry = () => {
    setError(null);
  };

  if (error) {
    return (
      <div className="error-boundary">
        <h3>Something went wrong!</h3>
        <p>{error.message}</p>
        <button onClick={handleRetry}>Try Again</button>
        <button onClick={() => window.location.reload()}>Reload App</button>
      </div>
    );
  }

  try {
    return typeof children === "function" ? children() : children;
  } catch (err) {
    console.error("Caught by functional ErrorBoundary:", err);
    setError(err);
    return null;
  }
};

export default ErrorBoundary;
