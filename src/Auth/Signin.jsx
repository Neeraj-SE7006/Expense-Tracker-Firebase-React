import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import "./Signin.css"; // Import the CSS file for styling
export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate("/home");
    } catch (error) {
      setLoading(false);
      setError("Authentication failed. Please check your credentials.");
      console.log(error);
    }
  };

  return (
    <div className="signin-container">
      <h1>Sign In</h1>{" "}
      <form onSubmit={handleSignIn} className="signin-form">
        <input
          className="signin-input"
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Email"
        />
        <input
          className="signin-input"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <button type="submit" className="signin-button">
          Sign In
        </button>
      </form>
      <Link to="/forgot-password">
        <p>Forgot your password? </p>
      </Link>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>{" "}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
    </div>
  );
};
