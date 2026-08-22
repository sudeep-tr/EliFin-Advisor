"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { ChatBubble } from "@/components/ChatBubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Message = { role: "user" | "assistant"; text: string };

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    const userMsg: Message = { role: "user", text: question };
    setMessages((m) => [...m, userMsg]);
    setQuestion("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/coach", { method: "POST", body: JSON.stringify({ question: userMsg.text }) });
      setMessages((m) => [...m, { role: "assistant", text: data.answer }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Sorry, something went wrong. Try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex h-screen max-w-2xl flex-col p-6">
      <h1 className="mb-2 text-2xl font-bold">AI Coach</h1>
      <p className="mb-4 text-xs text-muted-foreground">Educational only — not financial advice.</p>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.length === 0 && <p className="text-sm text-muted-foreground">Ask about budgeting, saving strategies, or how to think about risk.</p>}
        {messages.map((m, i) => <ChatBubble key={i} role={m.role} text={m.text} />)}
        {loading && <ChatBubble role="assistant" text="Thinking…" />}
      </div>
      <form onSubmit={send} className="mt-4 flex gap-2">
        <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question…" />
        <Button type="submit" disabled={loading}>Send</Button>
      </form>
    </main>
  );
}
