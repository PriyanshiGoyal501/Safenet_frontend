import React from "react";
import { Link } from "react-router-dom";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState();

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/forgot-password", { email })
      .then((result) => {
        console.log(result);
        if (result.data === "Success") {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="container">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter your email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Send
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
