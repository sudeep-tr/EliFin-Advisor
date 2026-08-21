// Sign up
await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password, age, income }) });

// Log in
await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

// Get expenses (cookie sent automatically, backend already knows who's asking)
const expenses = await apiFetch("/api/expenses");
