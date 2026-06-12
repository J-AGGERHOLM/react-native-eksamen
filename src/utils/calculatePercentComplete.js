export function CalculatePercentage(target, totalPaid) {
  const targetNumber = Number(target);
  const totalPaidNumber = Number(totalPaid);

  if (targetNumber <= 0) {
    return 0;
  }

  const percentage = Math.round((totalPaidNumber / targetNumber) * 100);

  return Math.min(percentage, 100);
}