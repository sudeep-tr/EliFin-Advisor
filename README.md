# 💰 EliFin

### AI-Powered Personal Finance & Wealth Management Platform

EliFin is a full-stack **AI-powered personal finance and wealth management platform** that helps users manage their money, track expenses, create budgets, analyze investments, and receive intelligent financial insights — all through a clean, modern web app.

🔗 **Live app:** [eli-fin-advisor.vercel.app](https://eli-fin-advisor.vercel.app)
🔗 **API base URL:** [elifin-advisor-lzbr.onrender.com](https://elifin-advisor-lzbr.onrender.com)

---

## ✨ Features

- 🔐 **User Authentication**
  - Registration and login
  - JWT-based authentication
  - Protected routes

- 💸 **Expense Management**
  - Add and manage expenses
  - Categorize transactions
  - Track spending patterns

- 📊 **Budget Management**
  - Create budgets for different categories
  - Set spending limits
  - Monitor budget usage

- 📈 **Investment Management**
  - Add and track investments
  - Monitor portfolio information
  - View investment-related insights

- 🤖 **AI Financial Advisor**
  - AI-powered financial recommendations (Groq API)
  - Personalized financial insights
  - Investment and budgeting guidance via an in-app chatbot

- 📊 **Financial Dashboard**
  - Overview of financial activity
  - Financial health score
  - Budget, expense, and investment summaries

- 🎨 **Modern Responsive UI**
  - Clean interface, built with React + Vite
  - Responsive design across devices

---

## 🛠️ Tech Stack

**Frontend:** React.js, Vite, JavaScript, Axios, React Router, CSS3
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, REST APIs
**AI:** Groq API for AI-powered financial analysis and recommendations
**Hosting:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

---

## 🏗️ Project Structure

```text
EliFin/
│
├── Frontend/
│   ├── public/
│   └── src/
│       ├── components/     # Chatbot, shared UI pieces
│       ├── pages/          # Login, Register, Dashboard, Profile, Investments, AIAdvisor, Transactions
│       ├── api/             # Shared Axios instance
│       ├── assets/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── .env
│
├── README.md
└── .gitignore
```

---

## ⚙️ Environment Variables

Neither `.env` file is committed to the repo — create them locally and set the same values on your hosting platform's dashboard.

**`backend/.env`**
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=a_long_random_secret_string
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

**`Frontend/.env.local`**
```env
VITE_API_URL=http://localhost:5000
```

> `VITE_API_URL` should always be the **bare backend origin, with no `/api` suffix** — every frontend request builds the `/api/...` path itself on top of this value. In production (Vercel), this is set to `https://elifin-advisor-lzbr.onrender.com`.

---

## 🚀 Getting Started (Local Development)

**1. Clone the repo**
```bash
git clone https://github.com/sudeep-tr/EliFin-Advisor.git
cd EliFin-Advisor
```

**2. Set up the backend**
```bash
cd backend
npm install
# create .env using the template above
npm start
```
The API runs at `http://localhost:5000`.

**3. Set up the frontend** (in a new terminal)
```bash
cd Frontend
npm install
# create .env.local using the template above
npm run dev
```
The app runs at `http://localhost:5173`.

---

## ☁️ Deployment

The app is deployed as three independent pieces:

| Layer | Platform | Notes |
|---|---|---|
| Database | MongoDB Atlas | Free M0 cluster |
| Backend | Render | Auto-deploys on push to `main`; free tier sleeps after inactivity |
| Frontend | Vercel | Auto-deploys on push to `main`; Vite auto-detected |

CORS on the backend must explicitly allow the deployed frontend's origin (`https://eli-fin-advisor.vercel.app`), and `VITE_API_URL` must be set in Vercel's project settings and the project redeployed after any change to it.

---

## 🧩 Known Conventions / Gotchas

- Every page that calls the API reads its base URL from `import.meta.env.VITE_API_URL`, falling back to `http://localhost:5000` for local dev. Never hardcode `http://localhost:5000` directly in a component.
- File imports are case-sensitive in production builds (Linux) even though they may work locally on Windows/Mac — e.g. `import App from "./App.jsx"`, not `"./app.jsx"`.
- Optional fields (like a new password on profile update) should only be included in the request payload when actually provided, to avoid backend validation rejecting an empty value.

---

