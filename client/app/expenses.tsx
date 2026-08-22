"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { ExpenseForm } from "@/components/ExpenseForm";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);

  async function load() {
    const data = await apiFetch("/api/expenses");
    setExpenses(data);
  }

  useEffect(() => { load(); }, []);

  const byCategory = expenses.reduce((acc: Record<string, number>, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const pieData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Expenses</h1>
      <ExpenseForm onAdded={load} />
      <CategoryPieChart data={pieData} />
      <div className="space-y-2">
        {expenses.length === 0 && <p className="text-sm text-muted-foreground">No expenses yet — add your first one above.</p>}
        {expenses.map((e) => (
          <div key={e._id} className="flex justify-between rounded-md border p-3 text-sm">
            <span>{e.category} — {e.description}</span>
            <span>{e.amount}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
