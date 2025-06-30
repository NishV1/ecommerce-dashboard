import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user-info");
    navigate("/signup");
  }, [navigate]);

  return (
    <div className="signout">
      <h1>Signing out...</h1>
    </div>
  );
};

export default Signout;
