export function CalculateAmountLeft(target, totalPaid) {
  const targetNumber = Number(target);
  const totalPaidNumber = Number(totalPaid);

  return Math.max(targetNumber - totalPaidNumber, 0);
}