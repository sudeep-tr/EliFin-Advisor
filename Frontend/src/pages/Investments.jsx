import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./Investments.css";

function Investments() {
  const navigate = useNavigate();

  const API = "http://localhost:5000";

  const token = localStorage.getItem("token");

  // ==========================================
  // AXIOS CONFIG
  // ==========================================

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // STATES
  // ==========================================

  const [investments, setInvestments] = useState([]);

  const [summary, setSummary] = useState({
    totalInvested: 0,
    totalCurrentValue: 0,
    totalReturns: 0,
    returnPercentage: 0,
    totalMonthlySIP: 0,
    investmentCount: 0,
  });

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");

  const [aiAdvice, setAiAdvice] = useState("");

  const [aiLoading, setAiLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "SIP",
    category: "Mutual Fund",
    monthlyAmount: "",
    investedAmount: "",
    currentValue: "",
    startDate: new Date().toISOString().split("T")[0],
    frequency: "monthly",
    notes: "",
  });

  // ==========================================
  // SHOW MESSAGE
  // ==========================================

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3500);
  };

  // ==========================================
  // FETCH INVESTMENTS
  // ==========================================

  const fetchInvestments = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const [investmentResponse, summaryResponse] =
        await Promise.all([
          axios.get(
            `${API}/api/investments`,
            config
          ),

          axios.get(
            `${API}/api/investments/summary`,
            config
          ),
        ]);

      console.log(
        "INVESTMENTS:",
        investmentResponse.data
      );

      console.log(
        "INVESTMENT SUMMARY:",
        summaryResponse.data
      );

      setInvestments(
        investmentResponse.data.investments || []
      );

      setSummary(
        summaryResponse.data.summary || {
          totalInvested: 0,
          totalCurrentValue: 0,
          totalReturns: 0,
          returnPercentage: 0,
          totalMonthlySIP: 0,
          investmentCount: 0,
        }
      );
    } catch (error) {
      console.error(
        "INVESTMENT FETCH ERROR:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      showMessage(
        error.response?.data?.message ||
          "Unable to load investments.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchInvestments();
  }, []);

  // ==========================================
  // HANDLE FORM
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      name: "",
      type: "SIP",
      category: "Mutual Fund",
      monthlyAmount: "",
      investedAmount: "",
      currentValue: "",
      startDate: new Date().toISOString().split("T")[0],
      frequency: "monthly",
      notes: "",
    });
  };

  // ==========================================
  // ADD INVESTMENT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    // Name validation
    if (!form.name.trim()) {
      showMessage(
        "Please enter the investment name.",
        "error"
      );
      return;
    }

    // Invested amount validation
    if (
      form.investedAmount === "" ||
      Number(form.investedAmount) < 0
    ) {
      showMessage(
        "Please enter a valid invested amount.",
        "error"
      );
      return;
    }

    // Current value validation
    if (
      form.currentValue === "" ||
      Number(form.currentValue) < 0
    ) {
      showMessage(
        "Please enter a valid current value.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API}/api/investments`,
        {
          name: form.name.trim(),

          type: form.type,

          category: form.category,

          monthlyAmount:
            Number(form.monthlyAmount) || 0,

          investedAmount:
            Number(form.investedAmount),

          currentValue:
            Number(form.currentValue),

          startDate: form.startDate,

          frequency: form.frequency,

          notes: form.notes,
        },
        config
      );

      console.log(
        "INVESTMENT ADDED:",
        response.data
      );

      resetForm();

      showMessage(
        "Investment added successfully! 📈",
        "success"
      );

      await fetchInvestments();
    } catch (error) {
      console.error(
        "ADD INVESTMENT ERROR:",
        error.response?.data || error.message
      );

      showMessage(
        error.response?.data?.message ||
          "Unable to add investment.",
        "error"
      );

      setLoading(false);
    }
  };

  // ==========================================
  // DELETE INVESTMENT
  // ==========================================

  const deleteInvestment = async (id) => {
    if (!id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this investment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API}/api/investments/${id}`,
        config
      );

      showMessage(
        "Investment deleted successfully. 🗑️",
        "success"
      );

      await fetchInvestments();
    } catch (error) {
      console.error(
        "DELETE INVESTMENT ERROR:",
        error.response?.data || error.message
      );

      showMessage(
        error.response?.data?.message ||
          "Unable to delete investment.",
        "error"
      );
    }
  };

  // ==========================================
  // AI PORTFOLIO ADVICE
  // ==========================================

  const generateAIAdvice = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAiLoading(true);

      setAiAdvice("");

      setMessage("");

      const response = await axios.post(
        `${API}/api/ai/portfolio-advice`,
        {},
        config
      );

      console.log(
        "AI PORTFOLIO RESPONSE:",
        response.data
      );

      if (response.data.success) {
        setAiAdvice(
          response.data.advice || ""
        );
      } else {
        showMessage(
          response.data.message ||
            "Unable to generate portfolio advice.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "AI PORTFOLIO ERROR:",
        error.response?.data || error.message
      );

      showMessage(
        error.response?.data?.message ||
          "Unable to generate portfolio advice.",
        "error"
      );
    } finally {
      setAiLoading(false);
    }
  };

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const money = (value) => {
    return Number(value || 0).toLocaleString(
      "en-IN"
    );
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // CHART DATA
  // ==========================================

  const chartData = [
    {
      name: "Invested",
      amount: Number(
        summary.totalInvested || 0
      ),
    },

    {
      name: "Current Value",
      amount: Number(
        summary.totalCurrentValue || 0
      ),
    },
  ];

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="investments-page">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="investments-header">

        <div>
          <h1>My Investments 📈</h1>

          <p>
            Track your SIPs and investment
            portfolio.
          </p>
        </div>

        <button
          className="investment-back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>

      </div>


      {/* ===================================== */}
      {/* MESSAGE */}
      {/* ===================================== */}

      {message && (
        <div
          className={`investment-message ${
            messageType === "error"
              ? "message-error"
              : "message-success"
          }`}
        >
          {message}
        </div>
      )}


      {/* ===================================== */}
      {/* SUMMARY */}
      {/* ===================================== */}

      <div className="investment-summary">

        <div className="investment-card">
          <span>Total Invested</span>

          <h2>
            ₹{money(summary.totalInvested)}
          </h2>
        </div>


        <div className="investment-card">
          <span>Current Value</span>

          <h2>
            ₹{money(summary.totalCurrentValue)}
          </h2>
        </div>


        <div className="investment-card">
          <span>Total Returns</span>

          <h2
            className={
              Number(summary.totalReturns) >= 0
                ? "positive"
                : "negative"
            }
          >
            {Number(summary.totalReturns) >= 0
              ? "+"
              : "-"}
            ₹
            {money(
              Math.abs(
                Number(
                  summary.totalReturns || 0
                )
              )
            )}
          </h2>
        </div>


        <div className="investment-card">
          <span>Return</span>

          <h2
            className={
              Number(
                summary.returnPercentage
              ) >= 0
                ? "positive"
                : "negative"
            }
          >
            {Number(
              summary.returnPercentage
            ) >= 0
              ? "+"
              : ""}

            {summary.returnPercentage || 0}%
          </h2>
        </div>


        <div className="investment-card">
          <span>Monthly SIP</span>

          <h2>
            ₹{money(summary.totalMonthlySIP)}
          </h2>
        </div>

      </div>


      {/* ===================================== */}
      {/* CHART */}
      {/* ===================================== */}

      <div className="portfolio-chart-card">

        <div className="portfolio-chart-header">

          <div>
            <h2>
              Portfolio Overview 📊
            </h2>

            <p>
              Invested amount vs current
              portfolio value
            </p>
          </div>

        </div>


        <div className="portfolio-chart">

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart data={chartData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(
                    value
                  ).toLocaleString("en-IN")}`
                }
              />

              <Bar
                dataKey="amount"
                name="Amount"
                radius={[
                  8,
                  8,
                  0,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* ===================================== */}
      {/* ADD INVESTMENT */}
      {/* ===================================== */}

      <div className="investment-form-card">

        <h2>
          Add Investment
        </h2>

        <form onSubmit={handleSubmit}>

          {/* NAME + TYPE */}

          <div className="investment-form-row">

            <div className="investment-form-group">

              <label>
                Investment Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Example: Parag Parikh Flexi Cap Fund"
                required
              />

            </div>


            <div className="investment-form-group">

              <label>
                Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
              >

                <option value="SIP">
                  SIP
                </option>

                <option value="Mutual Fund">
                  Mutual Fund
                </option>

                <option value="Stock">
                  Stock
                </option>

                <option value="FD">
                  Fixed Deposit
                </option>

                <option value="Gold">
                  Gold
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

          </div>


          {/* AMOUNTS */}

          <div className="investment-form-row">

            <div className="investment-form-group">

              <label>
                Monthly SIP Amount
              </label>

              <input
                type="number"
                name="monthlyAmount"
                value={form.monthlyAmount}
                onChange={handleChange}
                placeholder="₹5,000"
                min="0"
              />

            </div>


            <div className="investment-form-group">

              <label>
                Invested Amount
              </label>

              <input
                type="number"
                name="investedAmount"
                value={form.investedAmount}
                onChange={handleChange}
                placeholder="₹60,000"
                min="0"
                required
              />

            </div>


            <div className="investment-form-group">

              <label>
                Current Value
              </label>

              <input
                type="number"
                name="currentValue"
                value={form.currentValue}
                onChange={handleChange}
                placeholder="₹65,000"
                min="0"
                required
              />

            </div>

          </div>


          {/* DATE / FREQUENCY / CATEGORY */}

          <div className="investment-form-row">

            <div className="investment-form-group">

              <label>
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />

            </div>


            <div className="investment-form-group">

              <label>
                Frequency
              </label>

              <select
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
              >

                <option value="monthly">
                  Monthly
                </option>

                <option value="quarterly">
                  Quarterly
                </option>

                <option value="yearly">
                  Yearly
                </option>

                <option value="one-time">
                  One Time
                </option>

              </select>

            </div>


            <div className="investment-form-group">

              <label>
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >

                <option value="Mutual Fund">
                  Mutual Fund
                </option>

                <option value="Equity">
                  Equity
                </option>

                <option value="Fixed Income">
                  Fixed Income
                </option>

                <option value="Gold">
                  Gold
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

          </div>


          {/* NOTES */}

          <div className="investment-form-group">

            <label>
              Notes
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional notes about this investment..."
              rows="3"
            />

          </div>


          {/* SUBMIT */}

          <button
            className="add-investment-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Adding..."
              : "+ Add Investment"}
          </button>

        </form>

      </div>


      {/* ===================================== */}
      {/* AI ADVISOR */}
      {/* ===================================== */}

      <div className="ai-advisor-card">

        <div className="ai-advisor-header">

          <div>

            <h2>
              🤖 EliFin AI Advisor
            </h2>

            <p>
              Get AI-powered insights about
              your investment portfolio.
            </p>

          </div>


          <button
            className="generate-advice-btn"
            onClick={generateAIAdvice}
            disabled={aiLoading}
          >

            {aiLoading
              ? "Analyzing..."
              : "✨ Generate Advice"}

          </button>

        </div>


        {aiAdvice && (

          <div className="ai-advice-content">

            <div
              className="ai-text"
              style={{
                whiteSpace: "pre-wrap",
              }}
            >
              {aiAdvice}
            </div>

          </div>

        )}

      </div>


      {/* ===================================== */}
      {/* PORTFOLIO */}
      {/* ===================================== */}

      <div className="portfolio-section">

        <div className="portfolio-title">

          <div>

            <h2>
              My Portfolio
            </h2>

            <p>
              {summary.investmentCount || 0}{" "}
              investment
              {summary.investmentCount !== 1
                ? "s"
                : ""}
            </p>

          </div>

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="investment-loading">
            Loading portfolio...
          </div>

        ) : investments.length === 0 ? (

          /* EMPTY */

          <div className="empty-portfolio">

            <div className="empty-icon">
              📈
            </div>

            <h3>
              No investments yet
            </h3>

            <p>
              Add your first SIP or
              investment above.
            </p>

          </div>

        ) : (

          /* PORTFOLIO GRID */

          <div className="portfolio-grid">

            {investments.map(
              (investment) => {

                const investedAmount =
                  Number(
                    investment.investedAmount ||
                      0
                  );

                const currentValue =
                  Number(
                    investment.currentValue ||
                      0
                  );

                const returns =
                  currentValue -
                  investedAmount;

                const returnPercentage =
                  investedAmount > 0
                    ? (
                        (returns /
                          investedAmount) *
                        100
                      ).toFixed(2)
                    : "0.00";

                return (

                  <div
                    className="portfolio-card"
                    key={investment._id}
                  >

                    {/* CARD TOP */}

                    <div className="portfolio-card-top">

                      <div>

                        <h3>
                          {investment.name}
                        </h3>

                        <span className="investment-type">
                          {investment.type}
                        </span>

                      </div>


                      <button
                        type="button"
                        className="investment-delete"
                        onClick={() =>
                          deleteInvestment(
                            investment._id
                          )
                        }
                        title="Delete investment"
                      >
                        🗑️
                      </button>

                    </div>


                    {/* DETAILS */}

                    <div className="portfolio-details">

                      <div>

                        <span>
                          Monthly SIP
                        </span>

                        <strong>
                          ₹
                          {money(
                            investment.monthlyAmount
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Invested
                        </span>

                        <strong>
                          ₹
                          {money(
                            investment.investedAmount
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Current Value
                        </span>

                        <strong>
                          ₹
                          {money(
                            investment.currentValue
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Returns
                        </span>

                        <strong
                          className={
                            returns >= 0
                              ? "positive"
                              : "negative"
                          }
                        >
                          {returns >= 0
                            ? "+"
                            : "-"}
                          ₹
                          {money(
                            Math.abs(
                              returns
                            )
                          )}
                        </strong>

                      </div>

                    </div>


                    {/* FOOTER */}

                    <div className="portfolio-footer">

                      <span>
                        Started{" "}
                        {formatDate(
                          investment.startDate
                        )}
                      </span>


                      <strong
                        className={
                          returns >= 0
                            ? "positive"
                            : "negative"
                        }
                      >
                        {returns >= 0
                          ? "+"
                          : ""}

                        {returnPercentage}%
                      </strong>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Investments;