import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainHome.css";

function MainHome() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <div className="home-content">
        <h1 className="home-title">
          Welcome to <span className="highlight">SafeNet</span>
        </h1>
        <p className="home-subtitle">
          Secure your connection. Simplify your access.
        </p>

        <div className="button-group">
          <button onClick={() => navigate("/login")} className="btn login-btn">
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="btn signup-btn"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainHome;
