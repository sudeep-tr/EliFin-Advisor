import { useEffect, useState } from "react";
import axios from "axios";
import "./Transactions.css";

function Transactions() {
  const API = "http://localhost:5000";
  const token = localStorage.getItem("token");

  // ==========================================
  // STATE
  // ==========================================

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(true);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
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
    }, 3000);
  };

  // ==========================================
  // FETCH TRANSACTIONS
  // ==========================================

  const fetchTransactions = async () => {
    if (!token) {
      showMessage("Please login to view transactions.", "error");
      setFetching(false);
      return;
    }

    try {
      setFetching(true);

      const response = await axios.get(
        `${API}/api/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("TRANSACTIONS:", response.data);

      setTransactions(
        response.data.transactions || []
      );
    } catch (error) {
      console.error(
        "FETCH TRANSACTIONS ERROR:",
        error.response?.data || error.message
      );

      showMessage(
        error.response?.data?.message ||
          "Unable to load transactions.",
        "error"
      );
    } finally {
      setFetching(false);
    }
  };

  // ==========================================
  // LOAD TRANSACTIONS
  // ==========================================

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // ==========================================
  // SELECT INCOME / EXPENSE
  // ==========================================

  const selectType = (type) => {
    setForm((previousForm) => ({
      ...previousForm,
      type,
      category: "",
    }));
  };

  // ==========================================
  // ADD TRANSACTION
  // ==========================================

  const addTransaction = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    // Validation
    if (!form.amount) {
      showMessage(
        "Please enter the transaction amount.",
        "error"
      );
      return;
    }

    if (Number(form.amount) <= 0) {
      showMessage(
        "Amount must be greater than ₹0.",
        "error"
      );
      return;
    }

    if (!form.category) {
      showMessage(
        "Please select a category.",
        "error"
      );
      return;
    }

    if (!form.date) {
      showMessage(
        "Please select a date.",
        "error"
      );
      return;
    }

    if (!token) {
      showMessage(
        "Please login before adding a transaction.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API}/api/transactions`,
        {
          type: form.type,
          amount: Number(form.amount),
          category: form.category,
          description: form.description,
          date: form.date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "TRANSACTION ADDED:",
        response.data
      );

      // Reset form
      setForm({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date()
          .toISOString()
          .split("T")[0],
      });

      // Refresh transactions
      await fetchTransactions();

      showMessage(
        "Transaction added successfully! ✅",
        "success"
      );
    } catch (error) {
      console.error(
        "ADD TRANSACTION ERROR:",
        error.response?.data || error.message
      );

      showMessage(
        error.response?.data?.message ||
          "Failed to add transaction.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE TRANSACTION
  // ==========================================

  const deleteTransaction = async (id) => {
    if (!id) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `${API}/api/transactions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchTransactions();

      showMessage(
        "Transaction deleted successfully. 🗑️",
        "success"
      );
    } catch (error) {
      console.error(
        "DELETE TRANSACTION ERROR:",
        error.response?.data || error.message
      );

      showMessage(
        error.response?.data?.message ||
          "Failed to delete transaction.",
        "error"
      );
    }
  };

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString(
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
  // CALCULATE TOTALS
  // ==========================================

  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const totalExpense = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="transactions-page">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="transactions-header">

        <div>
          <h1>💸 Transactions</h1>

          <p>
            Track your income and expenses.
          </p>
        </div>

      </div>


      {/* ===================================== */}
      {/* MESSAGE */}
      {/* ===================================== */}

      {message && (
        <div
          className={`transaction-message ${
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
{/* ================================= */}
{/* TRANSACTION SUMMARY */}
{/* ================================= */}

<div className="transaction-summary">

  {/* TOTAL INCOME */}
  <div className="transaction-summary-card income-summary">

    <div className="summary-icon">
      ↑
    </div>

    <div className="summary-content">

      <span className="summary-label">
        Total Income
      </span>

      <strong className="summary-amount transaction-income">
        +₹{formatMoney(totalIncome)}
      </strong>

      <small>
        Money received
      </small>

    </div>

  </div>


  {/* TOTAL EXPENSE */}
  <div className="transaction-summary-card expense-summary">

    <div className="summary-icon">
      ↓
    </div>

    <div className="summary-content">

      <span className="summary-label">
        Total Expenses
      </span>

      <strong className="summary-amount transaction-expense">
        -₹{formatMoney(totalExpense)}
      </strong>

      <small>
        Money spent
      </small>

    </div>

  </div>


  {/* BALANCE */}
  <div className="transaction-summary-card balance-summary">

    <div className="summary-icon">
      ₹
    </div>

    <div className="summary-content">

      <span className="summary-label">
        Available Balance
      </span>

      <strong
        className={`summary-amount ${
          totalIncome - totalExpense >= 0
            ? "transaction-income"
            : "transaction-expense"
        }`}
      >
        {totalIncome - totalExpense >= 0
          ? "+"
          : "-"}
        ₹
        {formatMoney(
          Math.abs(
            totalIncome - totalExpense
          )
        )}
      </strong>

      <small>
        Income − Expenses
      </small>

    </div>

  </div>

</div>


      {/* ===================================== */}
      {/* ADD TRANSACTION */}
      {/* ===================================== */}

      <div className="transaction-form-card">

        <h2>Add Transaction</h2>

        <form onSubmit={addTransaction}>

          {/* TYPE */}

          <div className="transaction-type">

            <button
              type="button"
              className={
                form.type === "income"
                  ? "type-active income-active"
                  : ""
              }
              onClick={() =>
                selectType("income")
              }
            >
              💰 Income
            </button>


            <button
              type="button"
              className={
                form.type === "expense"
                  ? "type-active expense-active"
                  : ""
              }
              onClick={() =>
                selectType("expense")
              }
            >
              💸 Expense
            </button>

          </div>


          {/* AMOUNT */}

          <div className="form-group">

            <label>
              Amount (₹)
            </label>

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="5000"
              min="1"
              required
            />

          </div>


          {/* CATEGORY */}

          <div className="form-group">

            <label>
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >

              <option value="">
                Select category
              </option>

              {form.type === "income" ? (
                <>
                  <option value="Salary">
                    💼 Salary
                  </option>

                  <option value="Business">
                    🏢 Business
                  </option>

                  <option value="Freelance">
                    💻 Freelance
                  </option>

                  <option value="Investment">
                    📈 Investment
                  </option>

                  <option value="Other">
                    📦 Other
                  </option>
                </>
              ) : (
                <>
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
                </>
              )}

            </select>

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Example: Monthly salary"
            />

          </div>


          {/* DATE */}

          <div className="form-group">

            <label>
              Date
            </label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            className="add-transaction-button"
            disabled={loading}
          >
            {loading
              ? "Adding..."
              : "+ Add Transaction"}
          </button>

        </form>

      </div>


      {/* ===================================== */}
      {/* HISTORY */}
      {/* ===================================== */}

      <div className="transaction-history">

        <div className="history-header">

          <div>
            <h2>
              Transaction History
            </h2>

            <span>
              {transactions.length}{" "}
              transaction
              {transactions.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

        </div>


        {/* LOADING */}

        {fetching ? (

          <div className="no-transactions">

            <div className="empty-icon">
              ⏳
            </div>

            <h3>
              Loading transactions...
            </h3>

          </div>

        ) : transactions.length === 0 ? (

          /* EMPTY */

          <div className="no-transactions">

            <div className="empty-icon">
              💸
            </div>

            <h3>
              No transactions yet
            </h3>

            <p>
              Add your first income or
              expense above.
            </p>

          </div>

        ) : (

          /* LIST */

          <div className="transaction-list">

            {transactions.map(
              (transaction) => (

                <div
                  className="transaction-item"
                  key={transaction._id}
                >

                  {/* ICON */}

                  <div
                    className={
                      transaction.type ===
                      "income"
                        ? "transaction-icon income-icon"
                        : "transaction-icon expense-icon"
                    }
                  >
                    {transaction.type ===
                    "income"
                      ? "↑"
                      : "↓"}
                  </div>


                  {/* DETAILS */}

                  <div className="transaction-details">

                    <strong>
                      {transaction.category}
                    </strong>

                    <span>
                      {transaction.description ||
                        "No description"}
                    </span>

                  </div>


                  {/* DATE */}

                  <div className="transaction-date">

                    {formatDate(
                      transaction.date
                    )}

                  </div>


                  {/* AMOUNT */}

                  <div
                    className={
                      transaction.type ===
                      "income"
                        ? "transaction-income"
                        : "transaction-expense"
                    }
                  >

                    {transaction.type ===
                    "income"
                      ? "+"
                      : "-"}

                    ₹
                    {formatMoney(
                      transaction.amount
                    )}

                  </div>


                  {/* DELETE */}

                  <button
                    type="button"
                    className="delete-transaction"
                    onClick={() =>
                      deleteTransaction(
                        transaction._id
                      )
                    }
                    title="Delete transaction"
                  >
                    🗑️
                  </button>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Transactions;