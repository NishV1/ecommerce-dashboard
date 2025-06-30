import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
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

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await fetch("http://localhost:5000/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await result.json();

      if (result.ok) {
        localStorage.setItem("user-info", JSON.stringify(data));
        navigate("/products");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      {error && <div className="error-message">{error}</div>}
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
        placeholder="Enter Password" 
      />
      <button 
        className="loginButton" 
        onClick={handleLogin} 
        type="button"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <p className="auth-link">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
