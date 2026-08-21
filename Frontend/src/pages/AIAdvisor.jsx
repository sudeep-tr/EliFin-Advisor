import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function AIAdvisor() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) {
      return;
    }

    try {
      setLoading(true);
      setAnswer("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/ai/advice",
        {
          question,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnswer(
        response.data.advice || "No advice received."
      );

    } catch (error) {
      console.error(
        "AI error:",
        error.response?.data || error.message
      );

      setAnswer(
        "Unable to get AI advice right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>🤖 EliFin AI Advisor</h1>

      <p>
        Get personalized financial advice based on your
        actual financial data.
      </p>

      <textarea
        rows="5"
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          boxSizing: "border-box",
        }}
        placeholder="Ask something like: How can I improve my savings?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <br />
      <br />

      <button
        onClick={askAI}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Thinking... 🤔" : "Ask EliFin 🤖"}
      </button>

      {answer && (
        <div
          style={{
            marginTop: "30px",
            padding: "25px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            lineHeight: "1.6",
          }}
        >
          <h2>💡 EliFin's Advice</h2>

          <ReactMarkdown>
            {answer}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default AIAdvisor;