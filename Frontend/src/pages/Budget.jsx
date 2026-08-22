import { useEffect, useState } from "react";
import "./Budget.css";
import api from "../api/axios";

function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // MESSAGE
  // ==========================================

  const [message, setMessage] = useState("");

  // ==========================================
  // FETCH BUDGETS
  // ==========================================

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await api.get("/budgets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("BUDGET RESPONSE:", response.data);

      setBudgets(response.data.budgets || []);
    } catch (error) {
      console.error(
        "FETCH BUDGET ERROR:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // ==========================================
  // ADD / UPDATE BUDGET
  // ==========================================

  const saveBudget = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!category || !limit) {
      setMessage("Please enter category and limit.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login again.");
        return;
      }

      console.log("SAVING BUDGET:", {
        category,
        amount: Number(limit),
      });

      await api.post(
        "/budgets",
        {
          category: category,
          amount: Number(limit),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategory("");
      setLimit("");

      await fetchBudgets();

      setMessage("Budget saved successfully! ✅");
    } catch (error) {
      console.error(
        "SAVE BUDGET ERROR:",
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to save budget"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const deleteBudget = async (id) => {
    if (!window.confirm("Delete this budget?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/budgets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchBudgets();

      setMessage("Budget deleted successfully. 🗑️");
    } catch (error) {
      console.error(
        "DELETE BUDGET ERROR:",
        error.response?.data || error.message
      );

      setMessage("Failed to delete budget.");
    }
  };

  // ==========================================
  // MONEY FORMAT
  // ==========================================

  const money = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="budget-page">

      {/* HEADER */}

      <div className="budget-header">
        <h1>💰 Budget Planner</h1>

        <p>
          Set spending limits and keep
          your finances under control.
        </p>
      </div>


      {/* ADD BUDGET */}

      <div className="budget-form-card">

        <h2>Set Monthly Budget</h2>

        <form onSubmit={saveBudget}>

          <div className="budget-form-group">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="">
                Select category
              </option>

              <option value="Food">
                🍔 Food
              </option>

              <option value="Travel">
                🚗 Travel
              </option>

              <option value="Shopping">
                🛍️ Shopping
              </option>

              <option value="Entertainment">
                🎮 Entertainment
              </option>

              <option value="Bills">
                🧾 Bills
              </option>

              <option value="Education">
                📚 Education
              </option>

              <option value="Healthcare">
                🏥 Healthcare
              </option>

              <option value="Investment">
                📈 Investment
              </option>

              <option value="Other">
                📦 Other
              </option>

            </select>

          </div>


          <div className="budget-form-group">

            <label>
              Monthly Limit (₹)
            </label>

            <input
              type="number"
              min="0"
              value={limit}
              onChange={(e) =>
                setLimit(e.target.value)
              }
              placeholder="6000"
              required
            />

          </div>


          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Set Budget"}
          </button>

        </form>


        {/* MESSAGE */}

        {message && (
          <div className="budget-message">
            {message}
          </div>
        )}

      </div>


      {/* BUDGET LIST */}

      <div className="budget-list-section">

        <div className="budget-list-header">

          <h2>
            This Month's Budgets
          </h2>

          <span>
            {budgets.length} categories
          </span>

        </div>


        {budgets.length === 0 ? (

          <div className="empty-budget">

            <div>
              💰
            </div>

            <h3>
              No budgets yet
            </h3>

            <p>
              Create your first monthly
              budget above.
            </p>

          </div>

        ) : (

          <div className="budget-list">

            {budgets.map((budget) => {

              const budgetLimit =
                Number(
                  budget.limit ??
                  budget.amount ??
                  0
                );

              const spent =
                Number(
                  budget.spent ?? 0
                );

              const remaining =
                budgetLimit - spent;

              const percentage =
                budgetLimit > 0
                  ? Math.min(
                      Math.round(
                        (spent /
                          budgetLimit) *
                          100
                      ),
                      100
                    )
                  : 0;

              const exceeded =
                spent > budgetLimit;

              const warning =
                percentage >= 80 &&
                !exceeded;


              return (

                <div
                  className="budget-card"
                  key={
                    budget._id ||
                    budget.id
                  }
                >

                  {/* TOP */}

                  <div className="budget-card-top">

                    <div>

                      <h3>
                        {budget.category}
                      </h3>

                      <p>

                        ₹
                        {money(spent)}

                        {" "}spent of{" "}

                        ₹
                        {money(
                          budgetLimit
                        )}

                      </p>

                    </div>


                    <button
                      className="delete-budget"
                      onClick={() =>
                        deleteBudget(
                          budget._id ||
                          budget.id
                        )
                      }
                    >
                      🗑️
                    </button>

                  </div>


                  {/* PROGRESS */}

                  <div className="budget-progress">

                    <div
                      className={
                        exceeded
                          ? "progress-danger"
                          : warning
                          ? "progress-warning"
                          : "progress-normal"
                      }
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>


                  {/* FOOTER */}

                  <div className="budget-footer">

                    <span>

                      {exceeded
                        ? `⚠️ Over budget by ₹${money(
                            Math.abs(
                              remaining
                            )
                          )}`
                        : warning
                        ? `⚠️ ₹${money(
                            remaining
                          )} remaining`
                        : `✅ ₹${money(
                            remaining
                          )} remaining`}

                    </span>


                    <strong>
                      {percentage}%
                    </strong>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default Budget;