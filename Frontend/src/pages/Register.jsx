
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    income: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API = "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.age ||
      !formData.income
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      console.log("📝 Registering user...");

      const response = await axios.post(
        `${API}/api/auth/register`,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          age: Number(formData.age),
          income: Number(formData.income),
        }
      );

      console.log(
        "✅ REGISTER RESPONSE:",
        response.data
      );

      setSuccess(
        "Account created successfully! Redirecting..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error(
        "❌ REGISTER ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Unable to create account. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        {/* LOGO */}

        <div className="register-logo">

          <div className="register-logo-icon">
            ₹
          </div>

          <h1>
            Eli<span>Fin</span>
          </h1>

        </div>


        {/* HEADING */}

        <div className="register-heading">

          <h2>
            Create Your Account 🚀
          </h2>

          <p>
            Start managing your finances
            smarter with EliFin.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="register-error">
            ⚠️ {error}
          </div>
        )}


        {/* SUCCESS */}

        {success && (
          <div className="register-success">
            ✅ {success}
          </div>
        )}


        {/* FORM */}

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <div className="register-form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />

          </div>


          {/* EMAIL */}

          <div className="register-form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

          </div>


          {/* PASSWORD */}

          <div className="register-form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />

          </div>


          {/* AGE + INCOME */}

          <div className="register-row">

            <div className="register-form-group">

              <label>
                Age
              </label>

              <input
                type="number"
                name="age"
                min="1"
                max="120"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
              />

            </div>


            <div className="register-form-group">

              <label>
                Monthly Income
              </label>

              <input
                type="number"
                name="income"
                min="0"
                placeholder="₹ Income"
                value={formData.income}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* BUTTON */}

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >

            {loading
              ? "Creating Account..."
              : "Create Account →"}

          </button>

        </form>


        {/* LOGIN LINK */}

        <div className="login-link">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login
          </Link>

        </div>


        {/* FOOTER */}

        <p className="register-footer">
          🔒 Your financial information is securely protected.
        </p>

      </div>

    </div>
  );
}

export default Register;

