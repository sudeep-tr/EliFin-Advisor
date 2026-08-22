import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [formData, setFormData] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    age: storedUser.age || "",
    income: storedUser.income || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          name: formData.name,
          email: formData.email,
          age: Number(formData.age),
          income: Number(formData.income),
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setFormData({
        ...formData,
        password: "",
      });

      setMessage("Profile updated successfully! ✅");

    } catch (error) {
      console.error(
        "PROFILE UPDATE ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to update profile"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-icon">
          👤
        </div>

        <h1>Edit Profile</h1>

        <p className="profile-subtitle">
          Update your EliFin account details
        </p>

        {message && (
          <div className="profile-success">
            {message}
          </div>
        )}

        {error && (
          <div className="profile-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="profile-form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="profile-form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="profile-row">

            <div className="profile-form-group">
              <label>Age</label>

              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                min="1"
              />
            </div>

            <div className="profile-form-group">
              <label>Monthly Income</label>

              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleChange}
                placeholder="₹ Income"
                min="0"
              />
            </div>

          </div>

          <div className="profile-form-group">
            <label>
              New Password
              <span> (optional)</span>
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
          </div>

          <button
            type="submit"
            className="profile-save-btn"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Changes ✓"}
          </button>

        </form>

        <button
          className="profile-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default Profile;