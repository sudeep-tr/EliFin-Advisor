import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AIAdvisor from "./pages/AIAdvisor";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
  <Route path="/" element={<Home />} />

  <Route
    path="/login"
    element={<Login />}
  />

  <Route
    path="/register"
    element={<Register />}
  />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/transactions"
    element={
      <ProtectedRoute>
        <Transactions />
      </ProtectedRoute>
    }
  />
  <Route
  path="/ai-advisor"
  element={
    <ProtectedRoute>
      <AIAdvisor />
    </ProtectedRoute>
  }
/>
</Routes>
    </BrowserRouter>
  );
}

export default App;