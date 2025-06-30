import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user-info");
    // Trigger navigation update
    window.dispatchEvent(new Event('userDataChanged'));
    navigate("/signup");
  }, [navigate]);

  return (
    <div className="signout">
      <h1>Signing out...</h1>
    </div>
  );
};

export default Signout;
