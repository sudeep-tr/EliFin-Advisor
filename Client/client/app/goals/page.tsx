"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { GoalCard } from "@/components/GoalCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", target: "", current: "", deadline: "" });

  async function load() {
    setGoals(await apiFetch("/api/goals"));
  }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await apiFetch("/api/goals", {
      method: "POST",
      body: JSON.stringify({ ...form, target: Number(form.target), current: Number(form.current || 0) }),
    });
    setForm({ name: "", target: "", current: "", deadline: "" });
    load();
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Goals</h1>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <Input placeholder="Goal name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input type="number" placeholder="Target amount" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} required />
        <Input type="number" placeholder="Current amount" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
        <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
        <Button type="submit">Add Goal</Button>
      </form>
      {goals.length === 0 ? (
        <p className="text-sm text-muted-foreground">No goals yet — add your first one above.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {goals.map((g) => <GoalCard key={g._id} goal={g} />)}
        </div>
      )}
    </main>
  );
}
