"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { ScoreGauge } from "@/components/ScoreGauge";
import { SummaryCard } from "@/components/SummaryCard";
import { GoalCard } from "@/components/GoalCard";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    apiFetch("/api/dashboard/summary").then(setSummary).catch(console.error);
  }, []);

  if (!summary) return <main className="p-6">Loading…</main>;

  const pieData = Object.entries(summary.expensesByCategory || {}).map(([name, value]) => ({ name, value: value as number }));

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreGauge score={summary.score} />
        <SummaryCard label="Income" value={summary.income} />
        <SummaryCard label="Monthly Expense" value={summary.monthlyExpense} />
        <SummaryCard label="Savings" value={summary.savings} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Spending by Category</h2>
          <CategoryPieChart data={pieData} />
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Portfolio</h2>
          <p>Invested: {summary.portfolio.totalInvested}</p>
          <p>Current: {summary.portfolio.totalCurrent}</p>
          <p>Gain/Loss: {summary.portfolio.gainLoss}</p>
        </div>
      </div>
      <div>
        <h2 className="mb-2 font-semibold">Goals</h2>
        {summary.goalPreview.length === 0 ? (
          <p className="text-sm text-muted-foreground">No goals yet — add one on the Goals page.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {summary.goalPreview.map((g: any) => <GoalCard key={g._id} goal={g} />)}
          </div>
        )}
      </div>
    </main>
  );
}
