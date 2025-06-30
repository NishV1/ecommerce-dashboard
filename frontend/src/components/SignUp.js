import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user-info");
    if (user) {
      navigate("/products");
    }
  }, [navigate]);

  const collectData = async () => {
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await fetch("http://localhost:5000/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await result.json();

      if (result.ok) {
        localStorage.setItem("user-info", JSON.stringify(data));
        // Trigger navigation update
        window.dispatchEvent(new Event('userDataChanged'));
        navigate("/products");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <h1>Sign Up</h1>
      {error && <div className="error-message">{error}</div>}
      <input 
        className="inputBox" 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Enter Username" 
      />
      <input 
        className="inputBox" 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Enter Email" 
      />
      <input 
        className="inputBox" 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Enter Password (min 6 characters)" 
      />
      <button 
        className="registerButton" 
        onClick={collectData} 
        type="button"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      <p className="auth-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default SignUp;