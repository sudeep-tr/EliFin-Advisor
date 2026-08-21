import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm EliFin AI. Ask me anything about your finances.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) {
      return;
    }

    const userMessage = input;

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
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/ai/chat",
        {
          message: userMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            response.data.reply ||
            "I couldn't generate a response.",
        },
      ]);

    } catch (error) {
      console.error(
        "Chat error:",
        error.response?.data || error.message
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to EliFin AI right now. 😕",
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "30px auto",
        border: "1px solid #ddd",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >

      {/* Header */}

      <div
        style={{
          padding: "18px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2 style={{ margin: 0 }}>
          🤖 EliFin AI
        </h2>

        <small>
          Your personal financial assistant
        </small>
      </div>


      {/* Messages */}

      <div
        style={{
          height: "450px",
          overflowY: "auto",
          padding: "20px",
        }}
      >

        {messages.map((message, index) => (

          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                message.role === "user"
                  ? "flex-end"
                  : "flex-start",
              marginBottom: "15px",
            }}
          >

            <div
              style={{
                maxWidth: "75%",
                padding: "12px 16px",
                borderRadius: "12px",
                background:
                  message.role === "user"
                    ? "#e8f0fe"
                    : "#f5f5f5",
              }}
            >

              {message.role === "assistant" ? (
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              ) : (
                <p style={{ margin: 0 }}>
                  {message.content}
                </p>
              )}

            </div>

          </div>

        ))}

        {loading && (
          <p>🤖 EliFin is thinking...</p>
        )}

      </div>


      {/* Input */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "15px",
          borderTop: "1px solid #ddd",
        }}
      >

        <textarea
          rows="2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask EliFin..."
          style={{
            flex: 1,
            resize: "none",
            padding: "10px",
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send ➤
        </button>

      </div>

    </div>
  );
}

export default Chatbot;