// lib/api.ts — MOCK VERSION for frontend-only testing, no backend required.
//
// Drop this in as a temporary replacement for your real lib/api.ts, or save
// it alongside as lib/mock-api.ts and swap the import in your pages.
//
// It fakes every endpoint the frontend guide calls, with a small in-memory
// "database" that resets on page refresh. Network calls are simulated with
// a short delay so loading states are visible too.
//
// IMPORTANT: middleware.ts checks for a `token` cookie to decide whether to
// redirect protected pages to /login. This mock doesn't run on a server, so
// it can't set a real httpOnly cookie. To view protected pages without the
// real backend, either:
//   (a) open DevTools console and run: document.cookie = "token=fake"
//   (b) temporarily comment out the redirect logic in middleware.ts
// Removing this file and restoring the real api.ts is all you need to do
// once your Express server is ready — no other file changes required.

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// ---- in-memory fake database (resets on refresh) --------------------------

let currentUser: any = null;

let expenses = [
  { _id: "e1", category: "Rent", amount: 1200, description: "August rent", date: "2026-08-01" },
  { _id: "e2", category: "Food", amount: 340, description: "Groceries", date: "2026-08-10" },
  { _id: "e3", category: "Transport", amount: 80, description: "Metro card", date: "2026-08-15" },
];

let investments = [
  { _id: "i1", type: "stocks", name: "Index Fund A", investedAmount: 5000, currentValue: 5650, riskLevel: "medium" },
  { _id: "i2", type: "bonds", name: "Govt Bond Fund", investedAmount: 3000, currentValue: 3090, riskLevel: "low" },
];

let goals = [
  { _id: "g1", name: "Emergency Fund", target: 10000, current: 6500, deadline: "2026-12-31" },
  { _id: "g2", name: "Vacation", target: 2000, current: 400, deadline: "2027-03-01" },
];

let latestRiskAssessment: any = null;

// ---- mock apiFetch ---------------------------------------------------------

export async function apiFetch(path: string, options: RequestInit = {}) {
  await delay();
  const method = options.method || "GET";
  const body = options.body ? JSON.parse(options.body as string) : {};

  // ---- auth ----
  if (path === "/api/auth/register" && method === "POST") {
    currentUser = { _id: "u1", name: body.name, email: body.email };
    return currentUser;
  }
  if (path === "/api/auth/login" && method === "POST") {
    currentUser = { _id: "u1", name: "Demo User", email: body.email };
    return currentUser;
  }
  if (path === "/api/auth/logout" && method === "POST") {
    currentUser = null;
    return { message: "Logged out" };
  }
  if (path === "/api/auth/me") {
    if (!currentUser) throw new Error("Not authenticated");
    return currentUser;
  }
  if (path === "/api/auth/profile" && method === "PUT") {
    return { ...currentUser, ...body };
  }

  // ---- dashboard ----
  if (path === "/api/dashboard/summary") {
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const totalInvested = investments.reduce((s, i) => s + i.investedAmount, 0);
    const totalCurrent = investments.reduce((s, i) => s + i.currentValue, 0);
    const expensesByCategory = expenses.reduce((acc: Record<string, number>, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    return {
      score: 72,
      income: 60000,
      monthlyExpense: 1600,
      savings: 8000,
      totalExpenses,
      portfolio: { totalInvested, totalCurrent, gainLoss: totalCurrent - totalInvested },
      expensesByCategory,
      goalPreview: goals.slice(0, 3),
      riskProfile: latestRiskAssessment ? { score: latestRiskAssessment.score, level: latestRiskAssessment.level } : null,
    };
  }

  // ---- expenses ----
  if (path === "/api/expenses" && method === "GET") return expenses;
  if (path === "/api/expenses" && method === "POST") {
    const newExpense = { _id: `e${expenses.length + 1}`, date: new Date().toISOString(), ...body };
    expenses = [newExpense, ...expenses];
    return newExpense;
  }
  if (path.startsWith("/api/expenses/") && method === "DELETE") {
    const id = path.split("/").pop();
    expenses = expenses.filter((e) => e._id !== id);
    return { message: "Deleted" };
  }

  // ---- investments ----
  if (path === "/api/investments" && method === "GET") return investments;
  if (path === "/api/investments" && method === "POST") {
    const newInvestment = { _id: `i${investments.length + 1}`, ...body };
    investments = [newInvestment, ...investments];
    return newInvestment;
  }
  if (path.startsWith("/api/investments/") && method === "DELETE") {
    const id = path.split("/").pop();
    investments = investments.filter((i) => i._id !== id);
    return { message: "Deleted" };
  }

  // ---- goals ----
  if (path === "/api/goals" && method === "GET") {
    return goals.map((g) => {
      const months = Math.max(
        1,
        (new Date(g.deadline).getFullYear() - new Date().getFullYear()) * 12 +
          (new Date(g.deadline).getMonth() - new Date().getMonth())
      );
      return { ...g, monthlyRequired: Math.max(0, (g.target - g.current) / months) };
    });
  }
  if (path === "/api/goals" && method === "POST") {
    const newGoal = { _id: `g${goals.length + 1}`, ...body };
    goals = [...goals, newGoal];
    return newGoal;
  }
  if (path.startsWith("/api/goals/") && method === "PUT") {
    const id = path.split("/").pop();
    goals = goals.map((g) => (g._id === id ? { ...g, ...body } : g));
    return goals.find((g) => g._id === id);
  }
  if (path.startsWith("/api/goals/") && method === "DELETE") {
    const id = path.split("/").pop();
    goals = goals.filter((g) => g._id !== id);
    return { message: "Deleted" };
  }

  // ---- risk assessment ----
  if (path === "/api/risk-assessment" && method === "POST") {
    const avg = body.answers.reduce((s: number, a: any) => s + a.value, 0) / body.answers.length;
    const score = Math.round(avg);
    const level = score <= 33 ? "low" : score <= 66 ? "medium" : "high";
    latestRiskAssessment = { score, level, answers: body.answers };
    return latestRiskAssessment;
  }
  if (path === "/api/risk-assessment/latest") return latestRiskAssessment;

  // ---- coach ----
  if (path === "/api/coach" && method === "POST") {
    return {
      answer: `(Mock reply) You asked: "${body.question}". In a real session this would call the AI coach endpoint — this canned response just confirms the chat UI is wired up correctly.`,
    };
  }

  throw new Error(`Mock API: no handler for ${method} ${path}`);
}
