// components/Loader.jsx
import React from "react";

const Loader = ({ message }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center my-5">
      <div
        className="spinner-border text-info"
        role="status"
        style={{ width: "5rem", height: "5rem", borderWidth: "0.5rem" }}
      >
        <span className="visually-hidden">{message || "Loading..."}</span>
      </div>
      {message && <span className="mt-3 fs-5">{message}</span>}
    </div>
  );
};

export default Loader;