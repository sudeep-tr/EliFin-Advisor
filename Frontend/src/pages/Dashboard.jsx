import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [health, setHealth] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // API CONFIG
  // ==========================================

  const API = "http://localhost:5000";

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${API}/api/users/profile`,
        authConfig
      );

      setUser(response.data.user);
    } catch (error) {
      console.error(
        "PROFILE ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // FETCH FINANCIAL SUMMARY
  // ==========================================

  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        `${API}/api/transactions/summary`,
        authConfig
      );

      setSummary(response.data.summary);
    } catch (error) {
      console.error(
        "SUMMARY ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // FETCH FINANCIAL HEALTH
  // ==========================================

  const fetchHealth = async () => {
    try {
      const response = await axios.get(
        `${API}/api/health`,
        authConfig
      );

      setHealth(response.data.health);
    } catch (error) {
      console.error(
        "HEALTH ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // FETCH RECENT TRANSACTIONS
  // ==========================================

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${API}/api/transactions`,
        authConfig
      );

      const data = response.data.transactions || [];

      setTransactions(data.slice(0, 5));
    } catch (error) {
      console.error(
        "TRANSACTIONS ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // FETCH ALL DASHBOARD DATA
  // ==========================================

  const fetchDashboard = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchProfile(),
        fetchSummary(),
        fetchHealth(),
        fetchTransactions(),
      ]);
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);
      setError("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>

        <p>Loading your financial dashboard...</p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>⚠️ Something went wrong</h2>

        <p>{error}</p>

        <button onClick={fetchDashboard}>
          Try Again
        </button>
      </div>
    );
  }

  // ==========================================
  // VALUES
  // ==========================================

  const totalIncome = summary?.totalIncome || 0;

  const totalExpenses = summary?.totalExpenses || 0;

  const savings = summary?.savings || 0;

  const savingsRate = summary?.savingsRate || 0;

  const healthScore = health?.score || 0;

  const healthLevel = health?.level || "Not Available";

  const categoryExpenses =
    summary?.categoryExpenses || {};

  // ==========================================
  // FIND TOP EXPENSE CATEGORY
  // ==========================================

  const categoryEntries = Object.entries(
    categoryExpenses
  );

  const topCategory =
    categoryEntries.length > 0
      ? categoryEntries.reduce((a, b) =>
          b[1] > a[1] ? b : a
        )
      : null;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">

        <div>
          <h1>
            Welcome, {user?.name || "User"} 👋
          </h1>

          <p>
            Here's your financial overview.
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>


      {/* =====================================
          PROFILE
      ====================================== */}

      <div className="profile-card">

        <div className="profile-avatar">
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}
        </div>

        <div className="profile-info">

          <h2>
            {user?.name || "User"}
          </h2>

          <p>
            {user?.email || "No email"}
          </p>

          <div className="profile-details">

            <span>
              🎂 Age: {user?.age || "-"}
            </span>

            <span>
              💼 Monthly Income: ₹
              {formatMoney(user?.income)}
            </span>

          </div>

        </div>

      </div>


      {/* =====================================
          FINANCIAL OVERVIEW
      ====================================== */}

      <div className="section-title">

        <h2>
          Financial Overview
        </h2>

        <button
          onClick={() =>
            navigate("/transactions")
          }
        >
          Manage Transactions →
        </button>

      </div>


      <div className="overview-grid">

        {/* INCOME */}

        <div className="overview-card income-card">

          <div className="card-icon">
            💰
          </div>

          <div>

            <p>
              Total Income
            </p>

            <h2>
              ₹{formatMoney(totalIncome)}
            </h2>

          </div>

        </div>


        {/* EXPENSES */}

        <div className="overview-card expense-card">

          <div className="card-icon">
            💸
          </div>

          <div>

            <p>
              Total Expenses
            </p>

            <h2>
              ₹{formatMoney(totalExpenses)}
            </h2>

          </div>

        </div>


        {/* SAVINGS */}

        <div className="overview-card savings-card">

          <div className="card-icon">
            💵
          </div>

          <div>

            <p>
              Savings
            </p>

            <h2>
              ₹{formatMoney(savings)}
            </h2>

          </div>

        </div>


        {/* SAVINGS RATE */}

        <div className="overview-card rate-card">

          <div className="card-icon">
            📈
          </div>

          <div>

            <p>
              Savings Rate
            </p>

            <h2>
              {savingsRate}%
            </h2>

          </div>

        </div>

      </div>


      {/* =====================================
          FINANCIAL HEALTH
      ====================================== */}

      <div className="health-section">

        <div className="section-title">

          <div>
            <h2>
              Financial Health ❤️
            </h2>

            <p>
              Based on your current financial
              behaviour.
            </p>
          </div>

        </div>


        <div className="health-card">

          {/* SCORE */}

          <div className="health-score-container">

            <div
              className="health-circle"
              style={{
                "--score":
                  `${healthScore * 3.6}deg`,
              }}
            >

              <div className="health-circle-inner">

                <strong>
                  {healthScore}
                </strong>

                <span>
                  /100
                </span>

              </div>

            </div>


            <h3>
              {healthLevel}
            </h3>

            <p>
              {health?.message ||
                "Financial health information is unavailable."}
            </p>

          </div>


          {/* BREAKDOWN */}

          <div className="health-breakdown">

            <div className="health-item">

              <div>
                💰
              </div>

              <span>
                Savings
              </span>

              <strong>
                {health?.breakdown?.savings ||
                  0}
                /40
              </strong>

            </div>


            <div className="health-item">

              <div>
                📊
              </div>

              <span>
                Expense Control
              </span>

              <strong>
                {health?.breakdown?.expenses ||
                  0}
                /25
              </strong>

            </div>


            <div className="health-item">

              <div>
                🎯
              </div>

              <span>
                Budget
              </span>

              <strong>
                {health?.breakdown?.budget ||
                  0}
                /20
              </strong>

            </div>


            <div className="health-item">

              <div>
                🏦
              </div>

              <span>
                Emergency Fund
              </span>

              <strong>
                {health?.breakdown?.emergency ||
                  0}
                /15
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          SPENDING INSIGHTS
      ====================================== */}

      <div className="insights-section">

        <div className="section-title">

          <h2>
            Spending Insights 📊
          </h2>

        </div>


        <div className="insights-grid">

          <div className="insight-card">

            <span className="insight-icon">
              🔥
            </span>

            <div>

              <h3>
                Top Expense
              </h3>

              {topCategory ? (

                <p>
                  <strong>
                    {topCategory[0]}
                  </strong>

                  {" "}₹
                  {formatMoney(
                    topCategory[1]
                  )}
                </p>

              ) : (

                <p>
                  No expenses recorded yet.
                </p>

              )}

            </div>

          </div>


          <div className="insight-card">

            <span className="insight-icon">
              💎
            </span>

            <div>

              <h3>
                Savings Rate
              </h3>

              <p>
                You're saving{" "}
                <strong>
                  {savingsRate}%
                </strong>{" "}
                of your income.
              </p>

            </div>

          </div>


          <div className="insight-card">

            <span className="insight-icon">
              🧠
            </span>

            <div>

              <h3>
                AI Financial Advice
              </h3>

              <p>
                <button
              onClick={() =>
                navigate("/ai-advisor")
              }
            >
              Ask AI →
            </button>
                Get personalized advice
                from EliFin AI.
              </p>

            </div>

            

          </div>

        </div>

      </div>


      {/* =====================================
          RECENT TRANSACTIONS
      ====================================== */}

      <div className="transactions-section">

        <div className="section-title">

          <h2>
            Recent Transactions 💳
          </h2>

          <button
            onClick={() =>
              navigate("/transactions")
            }
          >
            View All →
          </button>

        </div>


        {transactions.length === 0 ? (

          <div className="empty-transactions">

            <div>
              💳
            </div>

            <h3>
              No transactions yet
            </h3>

            <p>
              Start adding transactions
              to see your financial activity.
            </p>

            <button
              onClick={() =>
                navigate("/transactions")
              }
            >
              Add Transaction
            </button>

          </div>

        ) : (

          <div className="transactions-list">

            {transactions.map(
              (transaction) => {

                const isIncome =
                  transaction.type ===
                  "income";

                return (

                  <div
                    className="transaction-row"
                    key={transaction._id}
                  >

                    <div className="transaction-icon">

                      {isIncome
                        ? "💰"
                        : "💸"}

                    </div>


                    <div className="transaction-info">

                      <h4>
                        {transaction.category ||
                          "Transaction"}
                      </h4>

                      <p>
                        {transaction.description ||
                          "No description"}
                      </p>

                    </div>


                    <div className="transaction-date">

                      {formatDate(
                        transaction.date
                      )}

                    </div>


                    <div
                      className={
                        isIncome
                          ? "transaction-amount income"
                          : "transaction-amount expense"
                      }
                    >

                      {isIncome
                        ? "+"
                        : "-"}₹
                      {formatMoney(
                        transaction.amount
                      )}

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>


      {/* =====================================
          QUICK ACTIONS
      ====================================== */}

      <div className="quick-actions">

        <h2>
          Quick Actions ⚡
        </h2>


        <div className="quick-action-grid">

          <button
            onClick={() =>
              navigate("/transactions")
            }
          >
            <span>💸</span>
            Add Transaction
          </button>


          <button
            onClick={() =>
              navigate("/budget")
            }
          >
            <span>🎯</span>
            Manage Budget
          </button>


          <button
            onClick={() =>
              navigate("/ai-advisor")
            }
          >
            <span>🤖</span>
            Ask EliFin AI
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;