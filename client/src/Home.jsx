import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MainHome.css";
function Home() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:3001/home")
      .then((result) => {
        console.log(result);
        if (result.data !== "Success") navigate("/login");
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="home-wrapper">
      <div className="home-content">
        <h1 className="home-title">
          Welcome Back to <span className="highlight">SafeNet</span>
        </h1>
        <p className="home-subtitle">
          Secure your connection. Simplify your access.
        </p>

        <div className="button-group">
          <button
            onClick={() => navigate("/scanner")}
            className="btn login-btn"
          >
            Virus Scan
          </button>

          <button
            onClick={() => navigate("/register")}
            className="btn signup-btn"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
