import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Goal = { _id: string; name: string; target: number; current: number; deadline: string; monthlyRequired?: number };

export function GoalCard({ goal }: { goal: Goal }) {
  const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">{goal.name}</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        <div className="h-2 w-full rounded-full bg-muted">
          <div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-muted-foreground">
          {goal.current} / {goal.target} · due {new Date(goal.deadline).toLocaleDateString()}
        </p>
        {goal.monthlyRequired !== undefined && (
          <p className="text-sm">Need ~{Math.round(goal.monthlyRequired)}/month to hit this goal</p>
        )}
      </CardContent>
    </Card>
  );
}
