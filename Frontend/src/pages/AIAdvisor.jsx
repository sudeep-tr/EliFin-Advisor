import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AIAdvisor.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function AIAdvisor() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! 👋 I'm EliFin AI Advisor. I can help you understand investments, SIPs, mutual funds, stocks, savings, budgeting, diversification, and other personal finance topics. What would you like to know?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // SCROLL TO LATEST MESSAGE
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =====================================================
  // CHECK LOGIN
  // =====================================================

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = async (e) => {
    e?.preventDefault();

    const userMessage = input.trim();

    if (!userMessage || loading) {
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/api/ai-advisor/chat`,
        {
          message: userMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              response.data.reply ||
              "Sorry, I couldn't generate a response.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              response.data.message ||
              "Unable to generate a response.",
          },
        ]);
      }
    } catch (error) {
      console.error(
        "AI ADVISOR ERROR:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Sorry, I'm unable to respond right now. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // QUICK QUESTIONS
  // =====================================================

  const quickQuestions = [
    "What is an SIP?",
    "How should I diversify my investments?",
    "What is the difference between stocks and mutual funds?",
    "How much should I save every month?",
  ];

  const askQuickQuestion = (question) => {
    setInput(question);
  };

  // =====================================================
  // FORMAT AI MESSAGE
  // =====================================================

 const formatMessage = (text) => {
  if (!text) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h2 className="ai-markdown-heading">
            {children}
          </h2>
        ),

        h2: ({ children }) => (
          <h3 className="ai-markdown-heading">
            {children}
          </h3>
        ),

        h3: ({ children }) => (
          <h4 className="ai-markdown-heading">
            {children}
          </h4>
        ),

        p: ({ children }) => (
          <p className="ai-markdown-paragraph">
            {children}
          </p>
        ),

        strong: ({ children }) => (
          <strong className="ai-markdown-bold">
            {children}
          </strong>
        ),

        ul: ({ children }) => (
          <ul className="ai-markdown-list">
            {children}
          </ul>
        ),

        ol: ({ children }) => (
          <ol className="ai-markdown-list">
            {children}
          </ol>
        ),

        li: ({ children }) => (
          <li>{children}</li>
        ),

        table: ({ children }) => (
          <div className="ai-table-wrapper">
            <table className="ai-markdown-table">
              {children}
            </table>
          </div>
        ),

        thead: ({ children }) => (
          <thead>{children}</thead>
        ),

        tbody: ({ children }) => (
          <tbody>{children}</tbody>
        ),

        tr: ({ children }) => (
          <tr>{children}</tr>
        ),

        th: ({ children }) => (
          <th>{children}</th>
        ),

        td: ({ children }) => (
          <td>{children}</td>
        ),

        blockquote: ({ children }) => (
          <blockquote className="ai-blockquote">
            {children}
          </blockquote>
        ),

        code: ({ children }) => (
          <code className="ai-inline-code">
            {children}
          </code>
        ),
      }}
    >
       {text.replace(/\\\|/g, "|")}
</ReactMarkdown>
  );
};

  // =====================================================
  // CLEAR CHAT
  // =====================================================

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared! 🧠 Ask me anything about personal finance, investing, saving, SIPs, mutual funds, or financial planning.",
      },
    ]);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="ai-advisor-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="ai-advisor-header">

        <div>
          <h1>🤖 EliFin AI Advisor</h1>

          <p>
            Your AI-powered financial education assistant.
          </p>
        </div>

        <div className="ai-header-buttons">

          <button
            className="clear-chat-btn"
            onClick={clearChat}
          >
            🗑️ Clear Chat
          </button>

          <button
            className="ai-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

        </div>

      </div>


      {/* =================================================
          QUICK QUESTIONS
      ================================================= */}

      <div className="quick-questions">

        <h3>💡 Try asking</h3>

        <div className="quick-question-list">

          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() =>
                askQuickQuestion(question)
              }
            >
              {question}
            </button>
          ))}

        </div>

      </div>


      {/* =================================================
          CHAT CARD
      ================================================= */}

      <div className="ai-chat-card">

        {/* CHAT HEADER */}

        <div className="chat-header">

          <div className="ai-avatar">
            🤖
          </div>

          <div>
            <h2>EliFin AI</h2>

            <span>
              ● Online
            </span>
          </div>

        </div>


        {/* =================================================
            MESSAGES
        ================================================= */}

        <div className="chat-messages">

          {messages.map((message, index) => (

            <div
              key={index}
              className={`chat-message ${
                message.role === "user"
                  ? "user-message"
                  : "assistant-message"
              }`}
            >

              {message.role === "assistant" && (
                <div className="message-avatar">
                  🤖
                </div>
              )}

              <div className="message-bubble">

                {formatMessage(
                  message.content
                )}

              </div>

            </div>

          ))}


          {/* =================================================
              TYPING INDICATOR
          ================================================= */}

          {loading && (

            <div className="chat-message assistant-message">

              <div className="message-avatar">
                🤖
              </div>

              <div className="message-bubble typing-bubble">

                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>

              </div>

            </div>

          )}

          <div ref={messagesEndRef} />

        </div>


        {/* =================================================
            INPUT
        ================================================= */}

        <form
          className="chat-input-container"
          onSubmit={sendMessage}
        >

          <input
            type="text"
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder="Ask EliFin about finance..."
            disabled={loading}
          />

          <button
            type="submit"
            disabled={
              loading || !input.trim()
            }
          >
            {loading ? "..." : "➤"}
          </button>

        </form>

        <div className="chat-disclaimer">

          ⚠️ EliFin provides general financial
          education and information. It does not
          provide regulated personalized financial
          advice. Investment values can fluctuate.

        </div>

      </div>

    </div>
  );
}

export default AIAdvisor;
