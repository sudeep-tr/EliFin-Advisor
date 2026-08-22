import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      console.log("🔐 Logging in...");

      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await axios.post(
        `${API}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("✅ LOGIN RESPONSE:", response.data);

      // ==============================
      // CHECK TOKEN
      // ==============================

      const token = response.data?.token;
      const user = response.data?.user;

      if (!token) {
        console.error(
          "❌ Token missing:",
          response.data
        );

        setError(
          "Login successful, but authentication token was not received."
        );

        return;
      }

      // ==============================
      // SAVE LOGIN DATA
      // ==============================

      localStorage.setItem(
        "token",
        token
      );

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      console.log(
        "✅ Token saved:",
        localStorage.getItem("token")
      );

      // ==============================
      // GO TO DASHBOARD
      // ==============================

      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {

      console.error(
        "❌ LOGIN ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        "Invalid email or password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          🤖
        </div>

        <h1>EliFin</h1>

        <p className="auth-subtitle">
          Your financial companion
        </p>

        <h2>
          Welcome 
        </h2>

        <p className="auth-description">
          Login to continue .
        </p>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login →"}
          </button>

        </form>

        <p className="auth-footer">

          Don't have an account?{" "}

          <Link to="/register">
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;
