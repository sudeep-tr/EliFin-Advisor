"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function PortfolioBarChart({ data }: { data: { name: string; invested: number; current: number }[] }) {
  if (data.length === 0) return <p className="text-sm text-muted-foreground">No investments yet — add your first one.</p>;
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="invested" fill="#94a3b8" />
        <Bar dataKey="current" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  );
}
