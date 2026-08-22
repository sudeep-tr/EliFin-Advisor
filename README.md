# 💰 EliFin

**AI-Powered Personal Finance & Wealth Management Platform**

> *Track. Understand. Plan. Grow.* 📊

---

## 🌟 Overview

Managing personal finances becomes complex when expenses, budgets, investments, and goals are scattered across multiple platforms. **EliFin** consolidates your entire financial life into a single hub. Powered by **Groq AI**, it moves beyond passive tracking to deliver actionable, real-time financial intelligence.

---

## 🚀 Key Features

* **🔐 Secure Authentication:** JWT-based user registration, login, and protected API routes.
* **💸 Expense Management:** Track, categorize, and analyze spending patterns over time.
* **📊 Budget Tracking:** Set category spending limits and monitor budget utilization proactively.
* **📈 Investment Tracking:** Monitor portfolio growth and receive automated allocation suggestions.
* **🤖 AI Financial Advisor:** Context-aware insights covering saving strategies, spending alerts, and financial planning.
* **🖥️ Centralized Dashboard:** A single-pane view of net worth, active budgets, expenses, and AI recommendations.

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js, JavaScript, CSS3 | User interface & interactive UI |
| **Routing & API** | React Router, Axios | Client-side routing & HTTP requests |
| **Backend** | Node.js, Express.js | Server runtime & REST API architecture |
| **Database** | MongoDB, Mongoose | NoSQL database & document modeling |
| **Security** | JWT, bcrypt | User authentication & credential hashing |
| **AI Integration** | Groq API | Fast LLM inference for financial analysis |

---

## 🏗️ Architecture & Data Flow

```text
[ User UI (React) ] ──(REST API)──> [ Express / Node.js Backend ]
                                              │
        ┌─────────────────────────────────────┼─────────────────────────────────────┐
        ▼                                     ▼                                     ▼
[ MongoDB Atlas ]                      [ JWT Auth Engine ]                  [ Groq AI Advisor ]
(User Data & Logs)                     (Token Verification)                 (Financial Analysis)
        │                                                                           │
        └───────────────────────────────> [ Insights Engine ] <────────────────────┘
                                                  │
                                                  ▼
                                      [ Centralized Dashboard ]
