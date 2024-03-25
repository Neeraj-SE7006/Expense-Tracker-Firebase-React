import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "./SignUp.css"; // Import the CSS file for styling
export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setconfirmpass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();
  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    const emailRegex = /^[A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6}$/;
    const isEmailValid = emailRegex.test(email);
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    const isPasswordValid = passwordRegex.test(password);
    if (isEmailValid && isPasswordValid && confirmpass === password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          setLoading(false);
          console.log(user);
          navigate("/login");
        })
        .catch((error) => {
          setLoading(false);
          setError("Error signing up. Please try again.");
          console.log(error);
        });
    } else {
      setLoading(false);
      alert("invalid");
    }
  }
  return (
    <>
      {" "}
      <div className="signup-container">
        {" "}
        <h1>Sign Up</h1>{" "}
        <form onSubmit={handleSignUp} className="signup-form">
          {" "}
          <input
            className="signup-input"
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />{" "}
          <input
            className="signup-input"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <input
            className="signup-input"
            onChange={(e) => setconfirmpass(e.target.value)}
            type="password"
            placeholder="Confirm Password"
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>{" "}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      </div>
    </>
  );
}
