import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // Don't show navbar when user isn't logged in
  if (!token) {
    return null;
  }

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 30px",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* Logo */}

      <Link
        to="/dashboard"
        style={{
          textDecoration: "none",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        💰 EliFin
      </Link>

      {/* Navigation */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >

        <Link to="/dashboard">
          📊 Dashboard
        </Link>

        <Link to="/transactions">
          💸 Transactions
        </Link>

        <Link to="/ai-advisor">
          🤖 AI Advisor
        </Link>

        <button onClick={logout}>
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;