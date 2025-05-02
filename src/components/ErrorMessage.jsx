import React from "react";
import PropTypes from "prop-types";

function ErrorMessage({ message, onRetry = null }) {
  return (
    <div className="error-message" role="alert" aria-live="assertive">
      <h2>⚠️ Error</h2>
      <p>{message}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onRetry: PropTypes.func,
};

export default ErrorMessage;
