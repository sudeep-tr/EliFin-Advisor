import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import React from "react";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="navbar-logo">
        💰 <Link to="/dashboard">
          EliFin
        </Link>
      </div>

      <div className="navbar-links">

        <Link to="/dashboard">
          🏠 Dashboard
        </Link>

        <Link to="/transactions">
          💸 Transactions
        </Link>

        <Link to="/budget">
          💰 Budget
        </Link>
        <Link to="/investments">
          📈 Investments
        </Link>

        <Link to="/ai-advisor">
          🤖 AI Advisor
        </Link>
        <Link to="/profile">
  👤 Profile
</Link>

        <button
          onClick={logout}
          className="logout-button"
        >
          🚪 Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;