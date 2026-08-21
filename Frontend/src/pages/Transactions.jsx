import { useEffect, useState } from "react";
import axios from "axios";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/transactions",
        config
      );

      setTransactions(
        response.data.transactions || response.data
      );
    } catch (error) {
      console.error(
        "Fetch transactions error:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add transaction
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/transactions",
        {
          ...formData,
          amount: Number(formData.amount),
        },
        config
      );

      setMessage("Transaction added successfully! ✅");

      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
      });

      fetchTransactions();

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to add transaction"
      );
    }
  };

  return (
    <div>
      <h1>Transactions 💸</h1>

      {/* Add Transaction */}
      <h2>Add Transaction</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Type</label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label>Amount</label>

          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Category</label>

          <input
            type="text"
            name="category"
            placeholder="Food, Salary, Rent..."
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description</label>

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          Add Transaction
        </button>

      </form>

      <p>{message}</p>

      <hr />

      {/* Transaction List */}
      <h2>My Transactions</h2>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div>
          {transactions.map((transaction) => (
            <div key={transaction._id}>

              <h3>
                {transaction.type === "income"
                  ? "💰 Income"
                  : "💸 Expense"}
              </h3>

              <p>
                Amount: ₹{transaction.amount}
              </p>

              <p>
                Category: {transaction.category}
              </p>

              <p>
                Description: {transaction.description}
              </p>

              <hr />

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Transactions;