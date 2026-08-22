import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold">EliFin</h1>
      <p className="max-w-md text-muted-foreground">
        Track your expenses, watch your portfolio, hit your goals, and get an AI coach in your corner — all in one place.
      </p>
      <div className="flex gap-4">
        <Link href="/signup"><Button>Sign Up</Button></Link>
        <Link href="/login"><Button variant="outline">Log In</Button></Link>
      </div>
    </main>
  );
}
