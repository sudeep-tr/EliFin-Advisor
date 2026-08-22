"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TYPES = ["stocks", "mutual_fund", "bonds", "crypto", "real_estate"];
const RISK_LEVELS = ["low", "medium", "high"];

export function InvestmentForm({ onAdded }: { onAdded: () => void }) {
  const [form, setForm] = useState({ type: TYPES[0], name: "", investedAmount: "", currentValue: "", riskLevel: "medium" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/api/investments", {
        method: "POST",
        body: JSON.stringify({ ...form, investedAmount: Number(form.investedAmount), currentValue: Number(form.currentValue) }),
      });
      setForm({ type: TYPES[0], name: "", investedAmount: "", currentValue: "", riskLevel: "medium" });
      onAdded();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <select className="rounded-md border px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
        {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <Input type="number" placeholder="Invested amount" value={form.investedAmount} onChange={(e) => setForm({ ...form, investedAmount: e.target.value })} required />
      <Input type="number" placeholder="Current value" value={form.currentValue} onChange={(e) => setForm({ ...form, currentValue: e.target.value })} required />
      <select className="rounded-md border px-3 py-2" value={form.riskLevel} onChange={(e) => setForm({ ...form, riskLevel: e.target.value })}>
        {RISK_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <Button type="submit" disabled={loading}>{loading ? "Adding…" : "Add Investment"}</Button>
    </form>
  );
}
