"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STEPS = ["Expenses", "Savings", "Risk starting point"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ monthlyExpense: "", savings: "", riskPreference: "medium" });
  const [loading, setLoading] = useState(false);

  async function finish() {
    setLoading(true);
    try {
      await apiFetch("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          monthlyExpense: Number(form.monthlyExpense),
          savings: Number(form.savings),
        }),
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader><CardTitle>{STEPS[step]} ({step + 1}/{STEPS.length})</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {step === 0 && (
            <Input type="number" placeholder="Average monthly expense" value={form.monthlyExpense} onChange={(e) => setForm({ ...form, monthlyExpense: e.target.value })} />
          )}
          {step === 1 && (
            <Input type="number" placeholder="Current savings" value={form.savings} onChange={(e) => setForm({ ...form, savings: e.target.value })} />
          )}
          {step === 2 && (
            <p className="text-sm text-muted-foreground">
              You'll take a full risk assessment quiz later — for now, we'll set a sensible default and refine it after your first login.
            </p>
          )}
          <div className="flex justify-between pt-2">
            {step > 0 ? <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button> : <span />}
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button onClick={finish} disabled={loading}>{loading ? "Saving…" : "Finish"}</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
