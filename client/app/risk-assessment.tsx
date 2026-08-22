"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QUESTIONS = [
  { id: "q1", text: "How would you react to a 20% drop in your portfolio's value?" },
  { id: "q2", text: "How many years until you need this money?" },
  { id: "q3", text: "How comfortable are you with investment volatility?" },
  { id: "q4", text: "How much of your income can you set aside without affecting your lifestyle?" },
];

const OPTIONS = [
  { label: "Not at all", value: 10 },
  { label: "A little", value: 40 },
  { label: "Somewhat", value: 65 },
  { label: "Very", value: 90 },
];

export default function RiskAssessmentPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);

  async function submit() {
    const payload = Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
    const data = await apiFetch("/api/risk-assessment", { method: "POST", body: JSON.stringify({ answers: payload }) });
    setResult(data);
  }

  const explanation: Record<string, string> = {
    low: "You're likely more comfortable with stable, lower-volatility holdings — think bonds and diversified funds over concentrated bets.",
    medium: "You can likely tolerate moderate swings for moderate growth — a balanced mix of equities and safer assets tends to fit.",
    high: "You're likely comfortable riding out significant short-term volatility in pursuit of higher long-term growth.",
  };

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Risk Assessment</h1>
      {!result ? (
        <div className="space-y-4">
          {QUESTIONS.map((q) => (
            <Card key={q.id}>
              <CardHeader><CardTitle className="text-base">{q.text}</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {OPTIONS.map((o) => (
                  <Button
                    key={o.label}
                    variant={answers[q.id] === o.value ? "default" : "outline"}
                    onClick={() => setAnswers({ ...answers, [q.id]: o.value })}
                  >
                    {o.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
          <Button onClick={submit} disabled={Object.keys(answers).length < QUESTIONS.length}>Submit</Button>
        </div>
      ) : (
        <Card>
          <CardHeader><CardTitle>Your risk level: {result.level}</CardTitle></CardHeader>
          <CardContent>
            <p>Score: {result.score}/100</p>
            <p className="mt-2 text-muted-foreground">{explanation[result.level]}</p>
            <p className="mt-4 text-xs text-muted-foreground">This is educational information about volatility tolerance, not investment advice.</p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
