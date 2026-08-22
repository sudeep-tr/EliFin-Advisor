export function monthlyRequired(target: number, current: number, deadline: Date | string) {
  const end = new Date(deadline);
  const now = new Date();
  const months = Math.max(1, (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth()));
  return Math.max(0, (target - current) / months);
}

export function portfolioSummary(investments: { investedAmount: number; currentValue: number }[]) {
  const totalInvested = investments.reduce((s, i) => s + i.investedAmount, 0);
  const totalCurrent = investments.reduce((s, i) => s + i.currentValue, 0);
  return { totalInvested, totalCurrent, gainLoss: totalCurrent - totalInvested };
}
