import { useEffect, useState } from "react";
import axios from "axios";
import Chatbot from "../components/Chatbot";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [healthScore, setHealthScore] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Profile
      const profileResponse = await axios.get(
        "http://localhost:5000/api/users/profile",
        config
      );

      setProfile(
        profileResponse.data.user || profileResponse.data
      );

      // Financial Summary
      const summaryResponse = await axios.get(
        "http://localhost:5000/api/transactions/summary",
        config
      );

      setSummary(summaryResponse.data.summary);

      // Health Score
      const healthResponse = await axios.get(
        "http://localhost:5000/api/transactions/health-score",
        config
      );

      setHealthScore(
        healthResponse.data.healthScore ??
        healthResponse.data.score ??
        0
      );

    } catch (error) {
      console.error(
        "Dashboard error:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!profile || !summary) {
    return <h2>Loading dashboard...</h2>;
  }

  // Convert categoryExpenses into chart data
  const spendingData = Object.entries(
    summary.categoryExpenses || {}
  ).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  return (
    <div style={{ padding: "30px" }}>

      <h1>EliFin Dashboard 💰</h1>

      <h2>Welcome, {profile.name} 👋</h2>

      <p>Email: {profile.email}</p>

      <hr />

      {/* Financial Overview */}

      <h2>Financial Overview</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >

        <div>
          <h3>💰 Total Income</h3>
          <p>₹{summary.totalIncome}</p>
        </div>

        <div>
          <h3>💸 Total Expenses</h3>
          <p>₹{summary.totalExpenses}</p>
        </div>

        <div>
          <h3>🏦 Savings</h3>
          <p>₹{summary.savings}</p>
        </div>

        <div>
          <h3>📈 Savings Rate</h3>
          <p>{summary.savingsRate}%</p>
        </div>

      </div>

      <hr />

      {/* Financial Health */}

      <h2>Financial Health ❤️</h2>

      <h1>{healthScore}/100</h1>

      <hr />

      {/* Spending Chart */}

      <h2>Spending Breakdown 📊</h2>
      <hr />

<Chatbot />

      {spendingData.length === 0 ? (
        <p>No expenses recorded yet.</p>
      ) : (
        <div
          style={{
            width: "100%",
            height: "400px",
          }}
        >
          <ResponsiveContainer>
            <PieChart>

              <Pie
                data={spendingData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={140}
                label
              >

                {spendingData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                  />
                ))}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
}

export default Dashboard;