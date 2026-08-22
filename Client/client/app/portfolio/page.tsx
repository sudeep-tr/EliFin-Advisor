"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { InvestmentForm } from "@/components/InvestmentForm";
import { PortfolioBarChart } from "@/components/charts/PortfolioBarChart";
import { portfolioSummary } from "@/lib/calculations";
import { SummaryCard } from "@/components/SummaryCard";

export default function PortfolioPage() {
  const [investments, setInvestments] = useState<any[]>([]);

  async function load() {
    setInvestments(await apiFetch("/api/investments"));
  }
  useEffect(() => { load(); }, []);

  const summary = portfolioSummary(investments);
  const chartData = investments.map((i) => ({ name: i.name, invested: i.investedAmount, current: i.currentValue }));

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Portfolio</h1>
      <InvestmentForm onAdded={load} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Invested" value={summary.totalInvested} />
        <SummaryCard label="Current Value" value={summary.totalCurrent} />
        <SummaryCard label="Gain / Loss" value={summary.gainLoss} />
      </div>
      <PortfolioBarChart data={chartData} />
    </main>
  );
}
