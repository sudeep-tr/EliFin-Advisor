export function ScoreGauge({ score }: { score: number }) {
  const color = score >= 70 ? "text-green-600" : score >= 40 ? "text-yellow-600" : "text-red-600";
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className={`text-5xl font-bold ${color}`}>{score}</div>
      <div className="text-sm text-muted-foreground">Financial Health Score</div>
    </div>
  );
}
