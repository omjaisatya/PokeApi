import React from "react";

function Loader() {
  return (
    <div className="loader-container" role="status" aria-label="Loading">
      <div className="loader-spinner" />
      <span className="loader-text">Loading...</span>
    </div>
  );
}

export default Loader;
