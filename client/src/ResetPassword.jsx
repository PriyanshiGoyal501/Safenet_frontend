import React from "react";
import { Link, useParams } from "react-router-dom";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function ResetPassword() {
  const [password, setPassword] = useState();

  const navigate = useNavigate();
  const { id, token } = useParams();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3001/reset-password/${id}/${token}`, { password })
      .then((result) => {
        console.log(result);
        if (result.data.Status === "Success") {
          navigate("/login");
        } else {
          alert("Token expired or password update failed");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="container">
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter your Password"
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Update
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
