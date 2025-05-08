import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("user-info"); // Retrieve user info from local storage
    if (user) {
      navigate("/products"); // If user is already signed in, redirect to products page
    }
  }, []);
  // useEffect to check if user is already signed in and redirect to products page if so
  const collectData = async () => {
    console.warn(username,email,password);
    let result = await fetch("http://localhost:5000/signup", { // Fixed URL
      method: "POST",
      body: JSON.stringify({ username, email, password }),
      headers:{
        'Content-Type': 'application/json',
      }
    });
    result = await result.json();
    console.warn(result);
    localStorage.setItem("user-info", JSON.stringify(result)); // Store user info in local storage
    navigate("/products"); // Redirect to products page after successful registration
  }
  return (
    <div className="register">
      <h1>Log-in or Register!</h1>
      <input className="inputBox" type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Enter Username" />
      <input className="inputBox" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Email" />
      <input className="inputBox" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Password" />
      <button className="registerButton" onClick={collectData} type="button">Sign Up</button>
    </div>
  );
}

export default SignUp;